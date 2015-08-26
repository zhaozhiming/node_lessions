var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('你好世界');
});

app.listen(2999, function() {
  console.log('app is listening at port 2999');
});
