const fs = require('fs');

const config = {
  dataDir: './data',
  dataFile: 'store.json'
};

let data;
let saved = false;


function exitHandler(err) {
  saveData();
  process.exit(1);
}

function readData() {
  createDataDir();
  let rawData = fs.readFileSync([config.dataDir, config.dataFile].join('/'), 'utf8');
  data = JSON.parse(rawData) || {};
}

function saveData() {
  if (!data) return false;
  if (saved) return false;
  createDataDir();
  let rawData = JSON.stringify(data, null, '  ');
  fs.writeFileSync([config.dataDir, config.dataFile].join('/'), rawData, 'utf8');
  saved = true;
  process.nextTick(() => saved = false);
}

// create dir if not exist
function createDataDir() {
  if (data) return true;
  if (fs.existsSync(config.dataDir)) return true;
  fs.mkdirSync(config.dataDir);
}


process.on('beforeExit', exitHandler);
// do something when app is closing
process.on('exit', exitHandler);
// catches ctrl+c event
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);


// public methods:

exports.setConfig = function(opt, value) {
  config[opt] = value;
};

exports.get = function(key) {
  if (!data) readData();
  return data[key];
};

exports.set = function(key, value) {
  if (!data) readData();
  data[key] = value;
};

exports.del = function(key) {
  if (!data) readData();
  delete data[key];
}

exports.clean = function() {
  data = {};
}

exports.keys = function() {
  if (!data) readData();
  return Object.keys(data);
}
