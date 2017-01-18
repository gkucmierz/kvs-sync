const fs = require('fs');

const config = {
  dataDir: './data',
  dataFile: 'store.json',
  // keep store file in user-friendly format
  prettyPrint: false,
  // save file on every update
  instantSave: false
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

function saveData(force = false) {
  if (!data) return false;
  if (saved && !force) return false;
  createDataDir();
  let rawData = config.prettyPrint ? JSON.stringify(data, null, '  ') : JSON.stringify(data);
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
  if (config.instantSave) saveData(true);
};

exports.del = function(key) {
  if (!data) readData();
  delete data[key];
  if (config.instantSave) saveData(true);
}

exports.clean = function() {
  data = {};
  if (config.instantSave) saveData(true);
}

exports.keys = function() {
  if (!data) readData();
  return Object.keys(data);
}
