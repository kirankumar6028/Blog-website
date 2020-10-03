//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "This is the Blog website,here you can post your blogs.";
const aboutContent = "This website made by the team of web developers.who works as the freelancer.If you want this type of websites feel free to contact us.contact details will be on contact page.Thank you";
const contactContent = "www.webdevelopers.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true ,  useUnifiedTopology: true});




const postSchema = {
  title : "String",
  content : "String"

};

const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){
    Post.find({}, function(err, posts){

       res.render("home", {
         startingContent: homeStartingContent,
         posts: posts
         });

   });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

   post.save(function(err){
       if (!err){
         res.redirect("/");
       }
    });
});



app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, function(err, post){
       res.render("post", {
         title: post.title,
         content: post.content,
         id : requestedPostId
       });
   });

});

app.post("/delete/:id", function(req,res){

  const id = req.params.id;

  Post.deleteOne({ _id: id }, function (err) {
    if(err){
      console.log(err);
    }else{
      console.log("Succesfully Deleted");
      res.redirect("/");
    }
  });

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
