[Process](#process)  
[Learned](#learned)  
[Screenshots](#screenshots)


### Process
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

### Screenshots

`localhost:3000`
![](https://media.discordapp.net/attachments/1039676646325764231/1133078944439079052/Screenshot_2023-07-24_at_11-49-12_Daily_Journal.png?width=1346&height=753) 
After we've composed a blog post in `localhost:3000/compose`
![](https://media.discordapp.net/attachments/1039676646325764231/1133078944191619103/Screenshot_2023-07-24_at_11-49-46_Daily_Journal.png?width=1346&height=753) 
We access that blog post in 
`localhost:3000/posts/Test`
![](https://media.discordapp.net/attachments/1039676646325764231/1133078944699129906/Screenshot_2023-07-24_at_11-49-56_Daily_Journal.png?width=1346&height=753) 
