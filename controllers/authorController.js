var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');

// Display list of all Authors
exports.author_list = function(req, res, next) {
    Author.find()
    	.sort([['family_name', 'ascending']])
    	.exec(function(err, list_authors) {
    		if (err) { return next(err); }
    		res.render('author_list', { title: 'Author List', authors: list_authors});
    	});
};

// Display detail page for a specific Author
exports.author_detail = function(req, res, next) {
    async.parallel({
            author: function(callback) {
                Author.findById(req.params.id)
                    .exec(callback);
            },
            books: function(callback) {
                Book.find({'author': req.params.id}, 'title summary')
                    .exec(callback);
            }
        },
        function(err, results) {
            if (err) { return next(err); }
            res.render('author_detail', { title: 'Author Detail', author: results.author, books: results.books });
        })
};

// Display Author create form on GET
exports.author_create_get = function(req, res, next) {
    res.render('author_form', { title: 'Create Author'} );
};

// Handle Author create on POST
exports.author_create_post = function(req, res, next) {
    req.checkBody('first_name', 'First name required').notEmpty();
    req.checkBody('family_name', 'Family name required').notEmpty();
    req.checkBody('family_name', 'First name needs to be alphanumeric').isAlpha();

    req.checkBody('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true}).isDate();
    req.checkBody('date_of_death', 'Invalid date of death').optional({ checkFalsy: true}).isDate();

    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();
    req.sanitize('date_of_birth').toDate();
    req.sanitize('date_of_death').toDate();

    var errors = req.validationErrors();

    var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
    });

    if (errors) {
        res.render('author_form', { title: 'Create Author', errors: errors, author: author});
        return;
    } else {
        author.save(function(err) {
            if (err) { return next(err); }
            res.redirect(author.url);
        });
    }

};

// Display Author delete form on GET
exports.author_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author delete GET' );
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author delete POST' );
};

// Display Author update form on GET
exports.author_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author update GET' );
};

// Handle Author update on POST
exports.author_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author update POST' );
};
