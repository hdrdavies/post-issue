var http = require('http');
var https = require('https');
var querystring = require('querystring');
var env = require('env2')('./config.env');
var fs = require('fs');
var sessions = {};
var index = fs.readFileSync(__dirname + '/index.html');
/* need to grab input fields data in another way 
var uName = document.getElementById('uName').value;
var pWord = document.getElementById('pWord').value;
var iTitle = document.getElementById('iTitle').value;
var iContent = document.getElementById('iContent').value;
*/

function handler (req, res){
  if (req.url === '/'){
    res.end('<a href=https://github.com/login/oauth/authorize?client_id=8255bbd8fe27f33298d1>DANGER!!! RESTRICTED AREA AUTHORISED ACCESS ONLY, ENTER AT OWN RISK</a>');
  }else if (req.url.match('/submit')) {
    postIssue(req,res);
  }else if(req.url.match('/login')){
    loginHandler(req,res);
  }
}

function postIssue(req,res){
  var issueObj = querystring.stringify(
  {
    "title": iTitle,
    "body": iContent,
    "assignee": uName,
    "milestone": 1,
    "labels": [
      "Label1",
      "Label2"
    ]
  });
  https.request({
    hostname: 'github.com',
    path: '/repos/liberty-x/lxsearch/issues',
    method: 'POST'
  }, function(responseFromGithub){
      responseFromGithub.on('data', function(chunk){
        // TODO
      });
  });
}

function loginHandler(req,res){
  console.log('im in the loginhandler');
  var code = req.url.split('code=')[1];
  var postData = querystring.stringify({
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    code: code
  });
  https.request({
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST'
  }, function(responseFromGithub) {
    console.log('im in the github response:---->'+responseFromGithub);
    responseFromGithub.on('data', function(chunk) {
      var accessToken = chunk.toString().split('access_token=')[1].split('&')[0];
      console.log(accessToken);
      var cookie = Math.floor(Math.random() * 100000000);
      sessions[cookie] = accessToken;
      console.log(sessions);
      res.writeHead(200, { "Set-Cookie": 'access=' + cookie });
      res.end(index);
    });
  }).end(postData);
}

http.createServer(handler).listen(2000);
console.log('listening on 2000');
