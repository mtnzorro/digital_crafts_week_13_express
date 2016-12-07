var express = require('express');
var app = express();
var marked = require('marked');
var fs = require('fs');
var bodyParser = require('body-parser');
var pg = require('pg');
var config = {
  // user: 'foo', //env var: PGUSER
  database: 'express', //env var: PGDATABASE
  // password: 'secret', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  // max: 10, // max number of clients in the pool
  // idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var Client = require('pg').Client;
var client = new Client(config);

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  client.connect();
client.query('SELECT * from foo', function(err, res) {
  console.log(res.rows);
  client.end();
});
res.send("You are here!!");
});

app.post('/age', function(req, res) {
  var name = req.body.name || "DUDE!";
  var age = req.body.age || 'REALLY OLD MAN!';
  var year = 2016 - age;
//   res.send("You are "+ age + " and were born in " + year);
// });
  res.render('hello.hbs', {
    title: 'Hey Man!',
    name : name,
    age : age,
    year : year

  });
});

app.put('/documents/:filepath', function(req, res){
  var filepath = './public/data/' + req.params.filepath;
  var contents = req.body.contents;
  fs.writeFile(filepath, contents, function(err){
    if (err){
      res.status(500);
      res.json({message: 'Couldn\'t save file because of this crap: ' + err.message});
    } else {
      res.json({message: 'File ' + filepath + ' saved.'});
    }
  });
});

app.get('/documents/:filepath/display', function(req, res){
  var filepath = './public/data/' + req.params.filepath;
  fs.readFile(filepath, function(err, buffer){
    if(err){
      res.json({message: 'Couldn\'t save file because of this crap: ' + err.message});
    }else {
      var content = marked(buffer.toString());
      res.render('markdown.hbs', {
        title: 'Hey Man!',
        content : content
      });

    }
  });
});

app.get('/documents/:filepath', function(req, res){
  var filepath = './public/data/' + req.params.filepath;
  fs.readFile(filepath, function(err, buffer){
    if(err){
      res.json({message: 'Couldn\'t save file because of this crap: ' + err.message});
    }else {
      var content = buffer.toString();
      res.json({
        "filepath": filepath,
        "contents" : content
      });

    }
  });
});

app.get('/documents', function(req,res){
  fs.readdir('./public/data', function(err, files){
    if(err){
      res.json({message: 'Couldn\'t save file because of this crap: ' + err.message});
    }else{
      res.send(files);
      console.log("Printed the shiz");
    }
  });
});

app.delete('/documents/:filepath', function(req, res){
  var filepath = './public/data/' + req.params.filepath;
  fs.unlink(filepath, function(err){
    if(err){
      res.json({message: 'Couldn\'t save file because of this crap: ' + err.message});
    }else{
    console.log("Deleted file");
    res.send("File is deleted");
  }
});
});

// app.get('/name/:name/age/:age', function(req, res) {
//   var age = req.params.age || 'REALLY OLD MAN!';
//   var year = 2016 - age;
//   var name = req.params.name;
//   res.send("Hello "+ name + "You are "+ age + " and were born in " + year);
// });

app.listen(3000, function(){
  console.log('Hello World app listening on port 3000!  Pour a beer!!!');
});
