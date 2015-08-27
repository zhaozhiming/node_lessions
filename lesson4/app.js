var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl).end(function (err, res) {
  if (err) return console.error(err);

  var $ = cheerio.load(res.text);
  var topicUrls = [];
  $('#topic_list .topic_title').each(function (idx, element) {
    var $element = $(element);
    topicUrls.push(url.resolve(cnodeUrl, $element.attr('href')));
  });

  console.log("topicUrls: " + topicUrls.length);
  console.log(topicUrls);

  var ep = new eventproxy();
  ep.after('topic_html', topicUrls.length, function (topics) {
    topics = topics.map(function (topicPair) {
      var topicUrl = topicPair[0];
      var topicHtml = topicPair[1];
      var $topic = cheerio.load(topicHtml);
      var comment_author = $topic ('.user_info .reply_author').eq(0);
      return ({
        title: $topic ('.topic_full_title').text().trim(),
        href: topicUrl,
        comment1: $topic ('.reply_content').eq(0).text().trim(),
        author1: comment_author.text().trim()
      });
    });

    console.log('topics length:' + topics.length);
    console.log(topics);
  });

  topicUrls.forEach(function (topicUrl) {
    superagent.get(topicUrl).end(function (err, res) {
      console.log('fetch' + topicUrl + ' success');
      ep.emit('topic_html', [topicUrl, res.text]);
    });
  });

});

