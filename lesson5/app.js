var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

var topicUrls = [];
superagent.get(cnodeUrl).end(function (err, res) {
  if (err) return console.error(err);

  var $ = cheerio.load(res.text);
  $('#topic_list .topic_title').each(function (idx, element) {
    var $element = $(element);
    topicUrls.push(url.resolve(cnodeUrl, $element.attr('href')));
  });

  console.log("topicUrls: " + topicUrls.length);
  console.log(topicUrls);

  var fetchUrl = function (url, callback) {
    superagent.get(url).end(function (err, res) {
      var $topic = cheerio.load(res.text);
      var comment_author = $topic('.user_info .reply_author').eq(0);
      callback(null, {
        title: $topic ('.topic_full_title').text().trim(),
        href: url,
        comment1: $topic ('.reply_content').eq(0).text().trim(),
        author1: comment_author.text().trim()
      });
    });
  };

  async.map(topicUrls, fetchUrl, function(err, results) {
    console.log('final');
    console.log(results);
  });
});

