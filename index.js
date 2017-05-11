#!/usr/bin/env node

const Registry = require("winreg");
const isAdmin = require("is-admin");
const fs = require("fs");

isAdmin().then(admin => {
  // "Note: For writing to this hive your program has to run with admin privileges" - winreg docs
  if (!admin) console.warn("Not running as administrator!");

  // addProgram(
  //   "Telegram",
  //   "C:\\Users\\Rade\\AppData\\Roaming\\Telegram Desktop\\Telegram.exe",
  //   listCurrentKeys
  // );
  // removeProgram("Telegram", listCurrentKeys);
});

function getCurrentKeys(callback) {
  var key = Registry({
    hive: Registry.HKCR,
    key: "\\Directory\\Background\\shell"
  });
  key.keys((err, items) => {
    if (err) console.error("ERROR: " + err);
    else if (callback) callback(items);
  });
}

function listCurrentKeys() {
  getCurrentKeys(items => items.map(item => console.log(item.key)));
}

function getChildKey(name) {
  return Registry({
    hive: Registry.HKCR,
    key: `\\Directory\\Background\\shell\\${name}`
  });
}

function addKey(name, callback) {
  var key = getChildKey(name);
  key.create(err => {
    if (err) console.error(err);
    else if (callback) callback(key);
  });
}

function removeKey(name, callback) {
  var key = getChildKey(name);
  key.destroy(err => {
    if (err) console.error(err);
    else if (callback) callback();
  });
}

function addProgram(name, path, callback) {
  // Example execution:
  // addProgram(
  //   "Telegram",
  //   "C:\\Users\\Rade\\AppData\\Roaming\\Telegram Desktop\\Telegram.exe",
  //   listCurrentKeys
  // );
  addKey(name, key => {
    // Add icon value
    key.set("Icon", "REG_SZ", path, err => {
      if (err) {
        console.error(err);
      } else {
        // Create command key
        var commandKey = Registry({
          hive: Registry.HKCR,
          key: `\\Directory\\Background\\shell\\${name}\\command`
        });
        commandKey.create(() => {
          // Set executable path
          commandKey.set(Registry.DEFAULT_VALUE, "REG_SZ", path, err => {
            if (err) console.error(err);
            else if (callback) callback();
          });
        });
      }
    });
  });
}

var removeProgram = removeKey;
