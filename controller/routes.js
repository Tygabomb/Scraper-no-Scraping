const express = require('express');
const router = express.Router();
const db = require("../models");

const axios = require("axios");
const cheerio = require("cheerio");

router.get('/', (req, res) => {
    // res.redirect('/articles')
    res.render('index')
})

router.get("/scrape", (req, res) => {
    axios.get("http://www.npr.org/").then(response => {
        const $ = cheerio.load(response.data);

        $("div a h3").each((i, element) => {
            let result = {};
            result.title = $(element).text();
            result.summary = $(element).parent().next().children('p').text()
            result.link = $(element).parent().attr("href");

            db.Article.create(result)
                .then(dbArticle => {
                    // console.log(dbArticle);
                })
                .catch(err => {
                    console.log(`ERROR:: ${err}`);
                });
        });
        res.redirect('/articles');
    });
});

router.get("/articles", (req, res) => {
    db.Article.find({})
        .then(articles => {

            let comments = [{
                body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum culpa tempore, voluptates vitae. Deserunt numquam distinctio esse non quod dolorem excepturi tempore error perferendis adipisci, aspernatur dolores suscipit ipsam, maiores!',
                user: 'thisUser',
                time: 'July 4th, 1776'
            }]
            let dbArticles = {
                    articles: articles,
                    comments: comments,
                }
            res.render('articles', dbArticles);
        })
        .catch(err => {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    db.Article.findOne({
            _id: req.params.id
        })
        .populate("comment")
        .then(dbArticle => {
            console.log([dbArticle])
            res.render('articleComments', dbArticle)
            // res.json(dbArticle)
        })
        .catch(err => {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", (req, res) => {
    db.Comment.create(req.body)
        .then(dbComment => {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                comment: dbComment._id
            }, {
                new: true
            });
        })
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;




// +++++++++++++++++++++++++

// const cheerio = require('cheerio');
// const axios = require('axios');
// const db = require("../Models");


// var express = require("express");
// var router = express.Router();
// // Requiring our Comment and Article models
// var Comments = require("../Models/Comments");
// var Article = require("../models/articles.js");

//scraping library

// var request = require("request");

//html routes
//-----------------------------

// router.get("/",function(req,res){

//   Article.find({})
//   .populate("comments")
//   // now, execute our query
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the doc to the browser as a json object
//     else {
//       console.log("all articles with comments: "+ doc);
//       res.render("index",{Article: doc});
//     }
//   });



// });




// //api routes
// // A GET request to scrape the echojs website
// router.get("/scrape", (req, res) => {

//     // First, we grab the body of the html with request
//     axios.get("http://www.npr.org/sections/world/").then(error, response, html => {
        
        
//           var $ = cheerio.load(html);
        
//           // An empty array to save the data that we'll scrape
          
        
//           // Select each element in the HTML body from which you want information.
//           // NOTE: Cheerio selectors function similarly to jQuery's selectors,
//           // but be sure to visit the package's npm page to see how it works
//           $(".has-image").each(function(i, element) {
        
//             var result ={};
//             //console.log("has image, chilrend title link: "+ $(element).children(".item-info").children(".title").children().attr("href"));
//             result.link = $(element).children(".item-info").children(".title").children().attr("href");
      
//             result.title =$(element).children(".item-info").children(".title").children().text();
//             result.snipText=$(element).children(".item-info").children(".teaser").children("a").text();
//             result.imageLink = $(element).children(".item-image").children(".imagewrap").children("a").children("img").attr("src");
//             //console.log("image linke:" + $(element).children(".item-image").children(".imagewrap").children("a").children("img"));
            

//             Article.findOne({title:result.title},function(err,data){
//                 //console.log("find article "+data);
//                 if (!data)
//                 {
//                     var entry = new Article(result);
                    
//                           // Now, save that entry to the db
//                           entry.save(function(err, doc) {
//                             // Log any errors
//                             if (err) {
//                               console.log(err);
//                             }
//                             // Or log the doc
//                             else {
//                               console.log("saving article, title: "+ doc.title);
//                             }
//                           });

//                 }
//                 else
//                 {
//                     console.log("this aritcle is already in db: "+ data.title);
//                 }
//             });
        
//             // Save these results in an object that we'll push into the results array we defined earlier
//         //     results.push({
//         //       title: title,
//         //       link: link,
//         //       imageLink: imageLink
//         //     });
//         });
      
//           $(".no-image").each(function(i, element) {
            
//             var result ={};
//             //console.log("has image, teaser: "+ $(element).children(".item-info").children(".teaser").children("a").text());
//                result.link = $(element).children(".item-info").children(".title").children().attr("href");
          
//                 result.title =$(element).children(".item-info").children(".title").children("a").text();
//                 result.snipText=$(element).children(".item-info").children(".teaser").children().text();
//                 result.imageLink="no image";
//                // var imageLink = $(element).children(".item-image").children(".imagewrap").children("a").children("img").attr("src");
//                 //console.log("image linke:" + $(element).children(".item-image").children(".imagewrap").children("a").children("img"));
//                 //console.log("curr result: "+ JSON.stringify(result));

//                 Article.findOne({title:result.title},function(err,data){
//                     //console.log("find article "+data);
//                     if (!data)
//                     {
//                         var entry = new Article(result);
                        
//                               // Now, save that entry to the db
//                               entry.save(function(err, doc) {
//                                 // Log any errors
//                                 if (err) {
//                                   console.log(err);
//                                 }
//                                 // Or log the doc
//                                 else {
//                                   console.log("saving article, title: " + doc.title);
//                                 }
//                               });
    
//                     }
//                     else
//                     {
//                         console.log("this aritcle is already in db: "+ data.title);
//                     }
//                 });

//               });
      
//         // Log the results once you've looped through each of the elements found with cheerio
//        // console.log(results);
//         //console.log("num articles: " + results.length);
//         res.redirect("/articles");
//       });
//     // Tell the browser that we finished scraping the text
//     //res.send("Scrape Complete");
    
//   });
  
//   router.get("/articles/:id", function(req, res) {
//     db.Article.findOne({
//             _id: req.params.id
//         })
//         .populate("comment")
//         .then(dbArticle => {
//             console.log([dbArticle])
//             res.render('articleComments', dbArticle)
//             // res.json(dbArticle)
//         })
//         .catch(err => {
//             res.json(err);
//         });
// });

//   // router.get("/articles/:id", (req, res) => {
//   //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   //   db.Article.findOne({ "_id": req.params.id })
//   //   // ..and populate all of the notes associated with it
//   //   .populate("comments")
//   //   // now, execute our query
//   //   .exec(function(error, doc) {
//   //     // Log any errors
//   //     if (error) {
//   //       console.log(error);
//   //     }
//   //     // Otherwise, send the doc to the browser as a json object
//   //     else {
//   //       res.json(doc);
//   //     }
//   //   });
//   // });
  
//   router.get("/articles", (req, res) => {
//     // Grab every doc in the Article array
//     Article.find({}, (error, doc) => {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Or send the doc to the browser as a json object
//       else {
//         res.json(doc);
//       }
//     });
//   });

//   // Create a new comment 

//   router.post("/articles/:id", (req, res) => {
//     db.Comment.create(req.body)
//         .then(dbComment => {
//             return db.Article.findOneAndUpdate({
//                 _id: req.params.id
//             }, {
//                 comment: dbComment._id
//             }, {
//                 new: true
//             });
//         })
//         .then(dbArticle => {
//             res.json(dbArticle);
//         })
//         .catch(err => {
//             res.json(err);
//         });
// });

// // router.post("/articles/:id", function(req, res) {
// //     // Create a new note and pass the req.body to the entry
// //     var newComment = new Comments(req.body);
  
// //     // And save the new comment the db
// //     newComment.save(function(error, doc) {
// //         if (error) {
// //             console.log(error);
// //           }
// //           // Otherwise
// //           else {
// //             // Use the article id to find and update it's note
// //             Article.findOneAndUpdate({ "_id": req.params.id }, { $push:{"comments": doc._id }},{new:true},function(err,doc){
// //                 if (err)
// //                     {
// //                         console.log("add comment to article: "+ err);
// //                     }
// //                 else{
// //                     res.redirect("/");
// //                 }
            
// //             });
// //           }
      
// //     });
// //   });
  

//   module.exports = router;