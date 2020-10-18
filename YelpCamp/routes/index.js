const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');



//LANDING PAGE
router.get("/", (req,res) => {
	res.render("landing")
});


// AUTH ROUTES
router.get('/register', (req, res) => {
	res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
	let newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash('error', err.message)
			console.log(err);
			return res.redirect('register')
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', "Welcome to YelpCamp " + user.username);
			res.redirect('/campgrounds');
		});
	});
});

//show login 
router.get('/login', (req, res) => {
	res.render('login');
})
//handlling login logic
router.post('/login', passport.authenticate('local', 
			{
				successRedirect: '/campgrounds', 
				failureRedirect: '/login'
			}), (req, res) => {
})

// logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('error', "Logged Out");
	res.redirect('/campgrounds');
})

module.exports = router