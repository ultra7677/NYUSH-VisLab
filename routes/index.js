var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('vislab.db');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var AuthForm = mongoose.model('AuthForm');

router.get('/', function (req, res) {
    res.render('index', { title: 'The index page!' })
});

router.get('/calendar.html', function (req, res) {
    res.render('calendar', { title: 'The calendar page!' })
});


router.post('/auth/login',function(req,res,next){
    //var authForm = new AuthForm(req.query);
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    db.serialize(function () {
        // find the user
        db.all("SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'" , function (err,rows) {
            console.log(rows);
            if(rows.length > 0){
                var data = {};
                data.status = 0;
                res.json(data);
            }else{
                var data = {};
                data.status = -1;
                res.json(data);
            }
        });
    });
   // console.log(authForm);
   // console.log(authForm.username);
});


router.post('/auth/register',function(req,res,next){
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    db.serialize(function () {
        // check same username
        db.all("SELECT * FROM user WHERE username = '" + username + "'" , function (err,rows) {
            console.log(rows);
            if(rows.length > 0){
                var data = {};
                data.status = -1;
                res.json(data);
            }else{
                // insert into database
                var stmt = db.prepare("INSERT into user(username,password) VALUES(?,?)");
                stmt.run(username,password);
                stmt.finalize();
                var data = {};
                data.status = 0;
                res.json(data);
            }
        });
    });
});

/*
router.get('/posts', function(req,res,next){
  Post.find(function(err,posts){
    if (err) { return next(err);}
    res.json(posts);
  });
});

router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

router.post('/posts',function(req,res,next){
  var post = new Post(req.body);

  post.save(function(err,post){
    if(err){ return next(err);}
    res.json(post);
  });

});

router.param('post',function (req,res,next,id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

router.put('/posts/:post/upvote', function(req, res, next) {
    req.post.upvote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});

router.post('/posts/:post/comments', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
});
*/
module.exports = router;