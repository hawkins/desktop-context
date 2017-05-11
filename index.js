#!/usr/bin/env node

const Registry = require("winreg");
const isAdmin = require("is-admin");

isAdmin().then(admin => {
  // "Note: For writing to this hive your program has to run with admin privileges" - winreg docs
  if (!admin) console.warn("Not running as administrator!");

  listCurrentKeys(items => items.map(item => console.log(item.key)));
});

function listCurrentKeys(callback) {
  var regKey = Registry({
    hive: Registry.HKCR,
    key: "\\Directory\\Background\\shell"
  });

  regKey.keys((err, items) => {
    if (err) console.error("ERROR: " + err);
    else callback(items);
  });
}
