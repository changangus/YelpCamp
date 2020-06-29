const express    = require('express'),
      router     = express.Router(),
      Campground = require('../models/campground'),
      middleware = require('../middleware')

// ==================
// CAMPGROUND ROUTES:
// ==================

// INDEX - shows all campgrounds
router.get('/', function(req, res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err)
    } else {
      // renders the campgrounds ejs file and sends campgrounds as defined as a argument in our function (the campgrounds DB)
      res.render('campgrounds/index', {campgrounds: campgrounds}); 
    }
  })
});

//  NEW - shows the form to create a new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('campgrounds/new')
})

//  CREATE - Adds the new campground
router.post('/', middleware.isLoggedIn, function(req, res){
  // get data from form add campground to array
  let name = req.body.name;
  let price =req.body.price;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {name: name, image: image, description: description, author: author, price: price};

  // Create newCampground to the DB 
  Campground.create(newCampground, function(err, newCampground){
    if(err){
      console.log(err)
    } else {
      console.log(newCampground)
      // redirect to campgrounds
      res.redirect('/campgrounds');
    }
  });
});

// SHOW - shows the info for a particular campground; id must come close to the end because and id can be any sort of letters/numbers including "new"
router.get('/:id', function(req, res){
  // find the campground with the provided ID
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err)
    } else {
      res.render('campgrounds/show', {campground: foundCampground})
    }
  });
});

// EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect('back')
      } else {
        res.render('campgrounds/edit', {campground: foundCampground})
      } 
    })
});

// UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){

  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
    if(err){
      res.redirect('/campgrounds')
    } else { 
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})
// DESTROY campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if(err){
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router;