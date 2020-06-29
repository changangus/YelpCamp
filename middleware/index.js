const Campground = require('../models/campground'),
      Comment    = require('../models/comment');

middleware = {};

middleware.checkCampgroundOwnership = function(req, res, next){
  // check if user is logged in
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err || !foundCampground){
        console.log(err);
        req.flash('error', 'Sorry, that campground does not exist!');
        res.redirect('/campgrounds');
    } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
        req.campground = foundCampground;
        next();
    } else {
        req.flash('error', 'You don\'t have permission to do that!');
        res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
};

middleware.checkCommentOwnership = function(req, res, next){
  // check if user is logged in
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
          console.log(err);
          req.flash('error', 'Sorry, that comment does not exist!');
          res.redirect('/campgrounds');
      } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
           req.comment = foundComment;
           next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect(`/campgrounds/${req.params.id}`);
      }
   });
  };
};

middleware.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  req.flash('error', 'Login to continue.');
  res.redirect('/login');
};

module.exports = middleware;