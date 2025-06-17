const express = require('express');
const router = express.Router();
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

router.get('/stream', function(req, res) {
  const conffile = req.query.config || 'default.json';
  const row = parseInt(req.query.row, 10);
  const col = parseInt(req.query.col, 10);

  const confpath = '../config/' + conffile;
  let confobj = initiateDefaultConf();
  if (fs.existsSync(path.join(__dirname, confpath))) {
    confobj = JSON.parse(fs.readFileSync(path.join(__dirname, confpath), 'utf8'));
  }

  if (isNaN(row) || isNaN(col) || !confobj['row' + row] || !confobj['row' + row][col]) {
    res.status(404).send('Stream not found');
    return;
  }

  const stream = confobj['row' + row][col];
  res.render('stream', { title: stream.title, stream });
});

module.exports = router;
