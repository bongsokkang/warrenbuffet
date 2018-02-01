var express = require('express');
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// scrapes ign website for article title, links, and summary
router.get('/scrape', function (req, res) {
    var url = 'https://techcrunch.com/mobile/';
    axios.get(url).then(function (response) {

        var $ = cheerio.load(response.data);

        $('div .block-content').each(function (i, element) {
            var result = {};
            
            result.title = $(this).children().eq(1).children().text();
            result.link = $(this).children().children().attr('href');
            result.summary = $(this).children().eq(3).text();

            db.Article
            .create(result)
            .then(function () {
                res.end();
            })
            .catch(function (error) {
                res.json(error);
            });

        });
    })
});

router.get('/', function (req, res) {
    db.Article
    .find({})
    .then(function(dbArticle) {
        res.render('home', {dbArticle});
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.get('/comment/:id', function (req, res) {
    db.Article
    .findOne({ _id: req.params.id })
    .populate("comment")
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (error) {
        res.json(error);
    })
})

router.put('/updatecomment/:id', function (req, res) {
    db.Comment
    .create(req.body)
    .then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (error) {
        res.json(error);
    })
})

router.delete('/delcomment/:id', function (req, res) {
    db.Comment
    .findOneAndRemove({_id: req.params.id})
    .then(function (dbComment) {
        res.json(dbComment)
    })
    .catch(function (error) {
        res.json(error);
    })
})

module.exports = router;