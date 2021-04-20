var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
const assert = require('assert');

var app = express();
var users;
var testMode = false;// test true

app.use(express.static('front'));
app.use(bodyParser.json());
app.listen(3000);


const url = 'mongodb://127.0.0.1:27017/db'

if(testMode){
  console.log("Test to server");
 mongodb.MongoClient.connect("mongodb://localhost:27017/test", function(err, database) {
  users = database.collection("users");
 });
}else{
 mongodb.MongoClient.connect(url, function(err, database) {
   assert.equal(null,err);
   console.log("Connected successfully to server");
   users = database.collection("users");
 });
}
// 一覧取得
app.get("/api/users", function(req, res) {
  users.find().toArray(function(err, items) {
    res.send(items);
  });
});

// 個人取得
app.get("/api/users/:_id", function(req, res) {
  users.findOne({_id: mongodb.ObjectID(req.params._id)}, function(err, item) {
    res.send(item);
  });
});

// 追加・更新
app.post("/api/users", function(req, res) {
  var user = req.body;
  if (user._id) user._id = mongodb.ObjectID(user._id);
  users.save(user, function() {
    res.send("insert or update");
  });
});

// 削除
app.delete("/api/users/:_id", function(req, res) {
  users.remove({_id: mongodb.ObjectID(req.params._id)}, function() {
    res.send("delete");
  });
});
