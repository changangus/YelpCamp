const express           = require('express'),
      app               = express(),
      bodyParser        = require('body-parser'),
      mongoose          = require('mongoose'),
      flash             = require('connect-flash'),
      methodOveride     = require('method-override'),
      Campground        = require('./models/campground'),
      Comment           = require('./models/comment'),
      seedDB            = require('./seeds'),
      passport          = require('passport'),
      LocalStrategy     = require('passport-local'),
      User              = require('./models/users');
      // Requiring Routes:
const campgroundRoutes  = require('./routes/campgrounds'),
      commentRoutes     = require('./routes/comments'),
      indexRoutes       = require('./routes/index');

// seedDB();
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);      
mongoose.connect('mongodb://localhost/yelp_camp')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOveride('_method'));
app.use(flash());
// Passport config:
app.use(require('express-session')({
  secret:'Dexter is the cutest dog ever.',
  resave: false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Sends User info to every page
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
  console.log('Yelp Camp Server Started!')
});