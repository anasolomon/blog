const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const PORT = process.env.PORT || 3000;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutStartingContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactStartingContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-ana:test123@cluster0.anmrdwa.mongodb.net/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
  title: String,
  body: String
});
const Blog = mongoose.model("Blog", blogSchema);
const postArray = [];

app.get("/", function (req, res) {

  Blog.find({}, function (err, blogsFound) {
    if (!err) {
      res.render("home", { homeContent: homeStartingContent, htmlArray: blogsFound });
    }
  });

});


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutStartingContent });
});


app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactStartingContent });
});



app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const blogTitle = req.body.postTitle;
  const blogBody = req.body.postBody;

  const blog = new Blog({
    title: blogTitle,
    body: blogBody
  });
  blog.save();

  const post = {
    title: blogTitle,
    body: blogBody
  };

  postArray.push(post);
  res.redirect("/");
});


app.get("/posts/:postNameId", function (req, res) {
  const requestedBlogId = req.params.postNameId;
  Blog.findOne({ _id: requestedBlogId }, function (err, foundBlogName) {
    res.render("posts", { storedTitle: foundBlogName.title, storedBody: foundBlogName.body });
  });
});




app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});