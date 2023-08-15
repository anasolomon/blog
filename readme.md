[Process](#Process)  
 - [Connecting to a Database](#connecting-to-a-database)    

[Learned](#Learned)  
[Screenshots](#screenshots)


# Process
I've added the modules :
```js
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
```
will be using *express* for this app.js server and touch user input from a form with *bodyParser* and apply tiny scriptlets into the html with *ejs*  

I've created the app.get for the root route, about, contact and lastly compose which has an `app.post` because inside of compose I have created a form:
```html
<form action="/compose" method="POST">
    <div class="form-group">
        <label for="">Title</label>
        <input type="text" class="form-control" name="postTitle"style="width:100%;" placeholder="Enter Title" autocomplete="off">
        <label for="">Post</label>
        <textarea name="postBody" class="form-control" style="width:100%;" rows="5" cols="30" placeholder="Enter Text"></textarea>
    </div>
    <button type="submit" class="btn btn-primary" name="button">Publish</button>
</form>
```

I'm storing the data from "`postTitle`" and "`postBody`" inside of an **object** called '*post*' which is inside of an *array* called '*postArray*':
```js
const postArray = [];
app.post("/compose", function(req,res){
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody
  };

  postArray.push(post);
  res.redirect("/");
});
```
The two items from the object post get pushed into the array 'postArray' everytime. Now I want to display both of these key values (title and body) into my root route page by using some EJS:
```html
<% for (let i = 0; i < htmlArray.length; i++) { %>
   <% const currentPost = htmlArray[i]; %>
         <h1><%= currentPost.title %></h1>
         <p><%= currentPost.body %></p>
 <% } %>
 ```
This will display the title inside of a h1 and the body in a paragraph.

I made a new 'posts' ejs **file** inside of the views folder and will use it as my *parameter pathing* that ends with the name of the newly created title
```js
app.get("/posts/:postName", function(req, res){
  for (let i = 0; i < postArray.length; i++) {
  if(req.params.postName == postArray[i].title){
    res.render("posts", {storedTitle: postArray[i].title, storedBody: postArray[i].body});
   };
 };
});
```
eg if I composed a new blog with title "Test" then I can access it in this pathing : `http://localhost:3000/posts/Test`  

Inside of the posts file I will use EJS to display the blog's title in the pathing and message (body). Or if user click on the 'Read More' anchor that I've added at the end of each blog posts it will redirect them automatically to that new blog. 
```html
<% for (let i = 0; i < htmlArray.length; i++) { %>
   <% const currentPost = htmlArray[i]; %>
         <h1><%= currentPost.title %></h1>
         <p class="truncate"><%= currentPost.body.substring(0, 100) + "..." %>
         <a class="test" href='/posts/<%=currentPost.title%>'>Read More</a>
      </p>
 <% } %>
```

## Connecting to a Database

Declaring a Schema and model for the Table where I will store the blog posts. 
```js
const blogSchema = new mongoose.Schema({
  title: String,
  body: String
});
const Blog = mongoose.model("Blog", blogSchema);
```

Whenever the user goes to the /compose url page and clicks the Submit button then this code will execute and save all data entered in the form inputs into the new table as Documents :
```js
app.post("/compose", function(req,res){
  const blogTitle = req.body.postTitle;
  const blogBody = req.body.postBody;

  const blog = new Blog({
    title: blogTitle,
    body: blogBody
  });
  blog.save();
});
```

To display that data in the home page I've added this block of code to the root route app.get : 
```js
app.get("/", function (req, res) {

  Blog.find({}, function (err, blogsFound) {
    if (!err) {
      res.render("home", { homeContent: homeStartingContent, htmlArray: blogsFound });
    }
  });

});
```
In the code above whenever the user is redirected or goes to the root route then the code will :
 - Execute the `find()` function which basically displays all of the Documents inside of the "Blog" table by passing them as an object to the `blogsFound` variable
 - If no errors found then *home.ejs* will get rendered and `blogsFound` will be displayed in the html page as `htmlArray`

For the dynamic route to also work I updated the old code :
```js
app.get("/posts/:postNameId", function (req, res) {
  const requestedBlogId = req.params.postNameId;
  Blog.findOne({ _id: requestedBlogId }, function (err, foundBlogName) {
    res.render("posts", { storedTitle: foundBlogName.title, storedBody: foundBlogName.body });
  });
});
```
In the code above :
 - We take from the home.ejs form `<a class="test" href='/posts/<%=currentPost._id%>'>Read More</a>` the id of a document use clicked "read more" on and we paste it at end of URL. This request can happened because we have an app.get that accepts dynamic routes.
 - We are checking if the request for dynamic route from user corrisponds to an existing document's id. If yes then we render the posts.ejs page with storedTitle = document.title and storedBody = document.body



 ### Learned
 You can use `rs` inside of nodemon to reset all the values in your app.js server.  

 Using parameters in express you can let the user create a page on the go
 ```js
 app.get("/posts/:topic", function(req, res){
  console.log(req.params.topic);
});
```
This will log the name we enter after "localhost:3000/post/name". Here is the documentation https://expressjs.com/en/guide/routing.html  

You can truncate long pieces of text in your html page with the webkit-box:
```css
.truncate{
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Number of lines to show */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
```
If you wish to be more precise and only show the first 100charcters of your text:
```css
.truncate{
    width: 100ch; /* Set the width to your desired value */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
```
(Credit for this one to ChatGPT)

If you are using EJS to display a text then you can integrate a little bit of Javascript to truncate your text:
```html
<% for (let i = 0; i < htmlArray.length; i++) { %>
   <% const currentPost = htmlArray[i]; %>
         <h1><%= currentPost.title %></h1>
         <p class="truncate"><%= currentPost.body.substring(0, 100) + "..." %></p>
 <% } %>
```

You can pass in a dynamic route not just manually by writting it in the URL by hand but also by redirecting towards it with a href and a dynamic value as the link `app.get("/posts/:postNameId",` `<a class="test" href='/posts/<%=currentPost._id%>'>Read More</a>`

### Screenshots

Main page
![](https://media.discordapp.net/attachments/1141016274160328756/1141113779984269392/Screenshot_2023-08-15_at_15-57-51_Daily_Journal.png?width=1360&height=676) 
Composing a blog post in `/compose`
![](https://media.discordapp.net/attachments/1141016274160328756/1141113779380301885/Screenshot_2023-08-15_at_15-58-12_Daily_Journal.png?width=1360&height=676) 