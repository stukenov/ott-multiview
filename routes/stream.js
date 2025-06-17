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

  const rows = Object.keys(confobj).filter(k => k.match(/^row\d+$/)).sort((a, b) => {
    return parseInt(a.slice(3), 10) - parseInt(b.slice(3), 10);
  });
  const positions = [];
  rows.forEach((rk) => {
    const rIdx = parseInt(rk.slice(3), 10);
    const arr = confobj[rk];
    if (Array.isArray(arr)) {
      arr.forEach((_, cIdx) => {
        positions.push({ row: rIdx, col: cIdx });
      });
    }
  });
  positions.sort((a, b) => {
    if (a.row === b.row) {
      return a.col - b.col;
    }
    return a.row - b.row;
  });

  const idx = positions.findIndex(p => p.row === row && p.col === col);
  let prev, next;
  if (idx > 0) {
    prev = positions[idx - 1];
  }
  if (idx >= 0 && idx < positions.length - 1) {
    next = positions[idx + 1];
  }

  res.render('stream', {
    title: stream.title,
    stream,
    prev,
    next,
    config: conffile
  });
});

module.exports = router;
