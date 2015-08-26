var express = require('express');
var utility = require('utility');

var app = express();

app.get('/', function (req, res) {
  var q = req.query.q;
  if (q) return res.end(utility.md5(q));

  return res.end('error query q');
});

app.listen(2999, function (req, res) {
  console.log('app is running at port 2999');
});
