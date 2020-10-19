var express 		= require("express"),
	app 			= express(),
	bodyParser  	= require("body-parser"),
	mongoose 		= require('mongoose'),
	Campground  	= require('./models/campground'),
	Comment 		= require('./models/comment'),
	seedDB 			= require('./seeds'),
	passport 		= require('passport'),
	LocalStrategy	= require('passport-local'),
	User 			= require('./models/user'),
	methodOverride 	= require('method-override'),
	flash			= require('connect-flash')

//requiring routes
const commentRoutes 	= require('./routes/comments'),
	  campgroundRoutes 	= require('./routes/campgrounds'),
	  indexRoutes 		= require('./routes/index')



mongoose.connect('mongodb+srv://Person:Person123@yelpcamp.xdu6b.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seed the database seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "I am the greatest pork belly pig in existence",
	resave: false,
	saveUninitialized: false
}));  

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
		res.locals.currentUser = req.user;
		res.locals.error = req.flash('error');
		res.locals.success = req.flash('success');
		next();
})

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes)


app.listen(3000, () => {
	console.log("server started")
});