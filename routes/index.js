// Copyright 2016 Eyevinn Technology. All rights reserved
// Use of this source code is governed by a MIT License
// license that can be found in the LICENSE file.
// Author: Jonas Birme (Eyevinn Technology)
var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

function initiateDefaultConf() {
  return {
    "row0": [],
    "row1": [],
    "row2": [],
    "row3": []
  };
}

/* GET home page. */
router.get('/', function(req, res) {
  let conf = req.query.config || 'default.json';
  let confobj = initiateDefaultConf();

  const confpath = '../config/' + conf;
  console.log('Loading config ' + confpath);
  if (fs.existsSync(path.join(__dirname, confpath))) {
    confobj = JSON.parse(fs.readFileSync(path.join(__dirname, confpath), 'utf8'));
  }

  res.render('index', { title: 'Eyevinn Technology OTT Multiview', conf: JSON.stringify(confobj) });
});

module.exports = router;
