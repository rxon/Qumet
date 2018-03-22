'use strict';
const fs = require('fs');
const Twit = require('twit');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const mustache = require('mustache');
const sanitize = require('validator').escape;

const app = express();
app.engine('mustache', (filePath, options, callback) => {
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      return callback(new Error(err));
    }
    const rendered = mustache.render(content, options);
    return callback(null, rendered);
  });
});
app.set('view engine', 'mustache');
app.set('views', __dirname);
app.use('/public', express.static('public'));
app.use(morgan('dev'));
app.use(helmet());
app.use(
  require('body-parser').urlencoded({
    extended: true
  })
);

app.get('/', function(req, res) {
  res.render('template', {
    title: 'Qumet - 匿名質問メンションサービス',
    url: 'qumet.now.sh',
    description: '全く新しいミニマムな匿名質問メンションサービス',
    fbimg: './public/icon2.png',
    twimg: './public/icon2.png',
    twaccount: '@qumet',
    icon: './public/icon.png'
  });
});

app.post('/', function(req, res) {
  require('dotenv').config();
  const twit = new Twit({
    consumer_key: process.env.consumerKey,
    consumer_secret: process.env.consumerSecret,
    access_token: process.env.accessToken,
    access_token_secret: process.env.accessTokenSecret,
    timeout_ms: 60 * 1000
  });

  const reqId = sanitize(req.body.id);
  const reqQuestion = sanitize(req.body.question);
  const qumet = `@${reqId} Q:${reqQuestion}`;

  const checkLength = 140 >= qumet.length && qumet.length > 0;
  const checkRequire = reqId && reqQuestion;
  const checkPattern = reqId.match(/^[0-9a-zA-Z_]{1,15}/);
  if (checkLength && checkRequire && checkPattern) {
    twit.post(
      'statuses/update',
      {
        status: qumet
      },
      function(err, data, response) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.redirect('https://twitter.com/Qumet/status/' + data.id_str);
      }
    );
  }
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on http://localhost:3000');
}
