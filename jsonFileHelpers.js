const fs = require('fs');

function readJSONFile(filename) {
    return new Promise((resolve, reject) => {
        let fileContent = require(filename);
        if (fileContent.length === 0) {
            reject({
                status: 202,
                message: "Empty file",
            })
        }
        resolve(fileContent)
    })
}
function writeJSONFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}



module.exports = {
    readJSONFile,
    writeJSONFile
}