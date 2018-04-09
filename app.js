var express = require('express');
var app = express();
var expressSanitizer = require("express-sanitizer");
var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
// app config

mongoose.connect("mongodb://localhost/rest_app");
app.set('view engine','ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer())
app.use(methodOverride('_method'));

//mongoose config

var blogSchema = mongoose.Schema({
     
     name : String,
     image : String,
     body : String,
     created:{
          type : Date,
          default :Date.now()
     }
     
     
})

var blog = mongoose.model('blog',blogSchema)


//restful routes

//home route

app.get("/",function(req,res){
     res.redirect("/blogs")
})

//index route
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
         if(!err){
              res.render("index",{blogData:blogs})
         }
    });
     
})

//new route
app.get("/blogs/new",function(req,res){
     res.render("new")
})

//create blog

app.post("/blogs",function(req,res){
     
     req.body.blog.body = req.sanitize(req.body.blog.body);
     blog.create(req.body.blog,function(err,blog){
          if(err){
               res.render("new")
          }
          else{
               res.redirect("/blogs")
          }
     })
})

// SHOW PAGE

app.get("/blogs/:id",function(req,res){
     blog.findById(req.params.id,function(err,data){
          if(!err){
               res.render("show",{blog:data})
          }
     })
})


//edit blog 

app.get("/blogs/:id/edit",function(req,res){
     blog.findById(req.params.id,function(err,data){
          if(!err){
               res.render("edit",{blog:data})
          }
     })
})


//put request

app.put("/blogs/:id",function(req,res){
     req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
         if(!err){
              
              res.redirect("/blogs/"+req.params.id);
         }
    })
});

//delete route


app.delete("/blogs/:id",function(req,res){
     blog.findByIdAndRemove(req.params.id,function(err,deleted){
          if(!err){
               
               
               res.redirect("/blogs")
               
          }
     })
})
app.listen(process.env.PORT,process.env.IP,function(){
     console.log("server started");
})

