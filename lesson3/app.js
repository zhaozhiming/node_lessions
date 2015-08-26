var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function (req, res, next) {
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }

      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .cell').each(function (idx, element) {
        var user_element = $(element).find('.user_avatar');
        var content_element = $(element).find('.topic_title');
        items.push({
          title: content_element.attr('title'),
          href: content_element.attr('href'),
          author: user_element.attr('href').substring(6)
        });

      });
      res.send(items);
    });
});

app.listen(2999, function (req, res) {
  console.log('app is running at port 2999');
});
