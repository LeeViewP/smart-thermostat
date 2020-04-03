#########################################################################
#  Smart-Thermostat setup script for RaspberryPi
#########################################################################
#!/bin/bash

RED='\033[1;31m'
GRN='\033[1;32m'
YLW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

APPSRVDIR='/home/pi/smart-thermostat/'
NODEDIR='/opt/nodejs'
NODEARCH=$(uname -m)

echo -e "${GRN}#########################################################################${NC}"
echo -e "${GRN}#                      Smart Thermostat App Setup                       #${NC}"
echo -e "${GRN}#########################################################################${NC}"
echo -e "${YLW}Note: script can take long on older Pis${NC}"
echo -e "${YLW}Note: setup requires your input at certain steps${NC}"

# #update apt-get, distribution, kernel
echo -e "${CYAN}************* STEP: Running apt-get update *************${NC}"
sudo apt-get update -m
# echo -e "${CYAN}************* STEP: Upgrading distribution *************${NC}"
# sudo apt-get upgrade
# echo -e "${CYAN}************* STEP: Running dist-upgrade *************${NC}"
# sudo apt-get dist-upgrade
#sudo apt-get clean

#install NodeJS
echo -e "${CYAN}************* STEP: Install NodeJS *************${NC}"
if [[ "$NODEARCH" == "armv6l" ]] ; then
  mkdir ~/tempnode -p
  cd ~/tempnode
  wget https://nodejs.org/dist/v4.6.2/node-v4.6.2-linux-armv6l.tar.gz
  tar -xzf node-v4.6.2-linux-armv6l.tar.gz
  sudo rm node-v4.6.2-linux-armv6l.tar.gz
  sudo rm -rf $NODEDIR
  mkdir -p $NODEDIR
  sudo mv node-v4.6.2-linux-armv6l/* $NODEDIR
  sudo rm -rf ~/tempnode;
  cd ~/
  echo 'Creating symbolic link to node in /usr/bin/'
  sudo ln -sf $NODEDIR/bin/node /usr/bin/node
  echo 'Creating symbolic link to nodejs in /usr/bin/'
  sudo ln -sf $NODEDIR/bin/node /usr/bin/nodejs
  echo 'Creating symbolic link to npm in /usr/bin/'
  sudo ln -sf $NODEDIR/bin/npm /usr/bin/npm
else
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -;
  sudo apt-get -y install nodejs;
fi

echo -e "${CYAN}************* STEP: Installing git *************${NC}"
sudo apt-get -y install git

echo -e "${CYAN}************* STEP: Setup Smart Thermostat app & dependencies *************${NC}"
sudo mkdir -p $APPSRVDIR    #main dir where smart-thermostat app lives
cd $APPSRVDIR || exit
git init
git remote add origin https://github.com/LeeViewP/smart-thermostat.git
git pull origin master
sudo npm install --unsafe-perm --build-from-source
sudo npm cache clean    #clear any caches/incomplete installs
sudo mkdir $APPSRVDIR/logs -p

#create db and empty placeholders so chown pi will override root permissions
sudo mkdir $APPSRVDIR/data/db -p
touch $APPSRVDIR/data/db/relays.json
touch $APPSRVDIR/data/db/schedules.json
touch $APPSRVDIR/data/db/sensors.json
touch $APPSRVDIR/data/db/settings.json
touch $APPSRVDIR/data/db/zones.json

echo -e "${CYAN}************* STEP: Run raspi-config *************${NC}"
if (whiptail --title "Run raspi-config ?" --yesno "Would you like to run raspi-config?\nNote: you should run this tool and configure the essential settings of your Pi if you haven't done it yet!" 12 78) then
  sudo raspi-config
fi

echo -e "${CYAN}************* STEP: Configuring logrotate *************${NC}"
sudo echo "#this is used by logrotate and should be placed in /etc/logrotate.d/
#rotate the smart-thermostat logs and keep a limit of how many are archived
#note: archives are rotated in $APPSRVDIR/logs so that dir must exist prior to rotation
$APPSRVDIR/logs/*.log {
        size 20M
        missingok
        rotate 20
        dateext
        dateformat -%Y-%m-%d
        compress
        notifempty
        nocreate
        copytruncate
}" | sudo tee /etc/logrotate.d/smart-thermostat

echo -e "${CYAN}************* STEP: Setup Smart Thermostat service ... *************${NC}"
sudo cp $APPSRVDIR/.setup/smart-thermostat.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable smart-thermostat.service
sudo systemctl start smart-thermostat.service

# echo -e "${RED}Make sure: ${YLW}to edit your gateway settings from the UI or from settings.json5 (and restart to apply changes)${NC}"
# echo -e "${RED}By default ${YLW}the gateway app uses the GPIO serial port. Run ${GRN}raspi-config${NC} and ensure the GPIO serial is enabled and GPIO console is disabled.${NC}"
# echo -e "${YLW}If you use MoteinoUSB or another serial port you must edit the serial port setting or the app will not receive messages from your Moteino nodes.${NC}"
# echo -e "${RED}App restarts ${YLW}can be requested from the Gateway UI (power symbol button on settings page, or from the terminal via ${RED}sudo systemctl restart gateway.service${NC}"
# echo -e "${RED}Don't forget: ${YLW}install proftpd (choose standalone mode) if you plan to FTP transfer files to your Pi (very useful!) with ${GRN}sudo apt-get install proftpd${NC}"
# echo -e "${RED}Don't forget: ${YLW}install minicom - useful for serial port debugging with ${GRN}sudo apt-get install minicom${NC}"
# echo -e "${RED}Adding users: ${YLW}You can run tool again to add more gateway users (skip all other steps, reboot when done)${NC}"
# echo -e "${RED}! Important : ${YLW}If not done already - configure your Pi core settings (timezone, expand SD etc) by running ${GRN}raspi-config${NC}"

echo -e "${CYAN}************* ALL DONE! *************${NC}"
sudo chown -R pi:pi $APPSRVDIR
cd ~/
exit 0