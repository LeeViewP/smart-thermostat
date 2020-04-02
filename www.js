const express = require('express');
const path = require('path');
const www = express.static(path.relative(process.cwd(), './www'));
module.exports.www = www;