//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://michel92:zidane92@cluster0.bcbek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/diaryDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const diarySchema = new mongoose.Schema({
  title: String,
  description: String
});

const Diary = mongoose.model("Diary", diarySchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get('/', function(req, res) {
  Diary.find({}, function(err, posts) {
    res.render('home', {StartingContent: homeStartingContent, posts: posts,listTitle:"Today" });
  });
});

app.get('/about', function(req, res) {
  res.render('about', {StartingContent: aboutContent});
});

app.get('/contact', function(req, res) {
  res.render('contact', {StartingContent: contactContent});
});

app.get('/compose', function(req, res) {
  res.render('compose');
});

app.post('/compose', function(req, res) {
  const titleName = req.body.postTitle;
  const descriptionName = req.body.postBody;
  const diary = new Diary({
    title: titleName,
    description: descriptionName
  });
  diary.save();
  res.redirect("/");
});

app.get('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;
  
  Diary.findOne({_id: requestedPostId}, function(err, post){ 
    res.render("post", {
      title: post.title,
      description: post.description
    });
  });
});


app.post("/delete", function(req, res) {
  const checkedItemBody = req.body.checkBox;
  const listName = req.body.listName;

  if(listName === "Today") {
      Diary.findByIdAndRemove(checkedItemBody, function(err) {
          if (!err) {
              console.log("Successfully deleted checked item");
              setTimeout(function() {
                  res.redirect('/');
              }, 2000); 
          }
      });
  }
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
