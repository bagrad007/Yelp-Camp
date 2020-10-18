const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware')





//INDEX - show all campgrounds
router.get("/", (req, res) => {
	
	Campground.find({}, (err, allCampgrounds) => {
		if (err){
			console.log(err);
		} else {
		res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		};
	});
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req,res) =>{
	//get data from form and add to camp array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	const price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author, price: price};
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log('err');
		} else {
			res.redirect('/campgrounds')
		}
 });
});



//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req,res) => {
	res.render("campgrounds/new.ejs");
});

// SHOW - shows info form more than one campground
router.get("/:id", (req,res) =>{
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec ((err, foundCampground) => {
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		};
	});
});

//EDIT CAMPGROUND
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});
		
// UPDATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			res.redirect('/campgrounds')
		}else {
			// redirect back to page
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	})
})

	
module.exports = router;	