const Campground = require('../models/campground')
const Comment = require('../models/comment')
// all middleware used in project
const middlewareObj = {};


middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		//is user logged in
			Campground.findById(req.params.id, (err, foundCampground) => {
				if(err) {
					req.flash('error', "Campground not found");
					res.redirect('back')
				} else {
					//does user own campground?
					if(foundCampground.author.id.equals(req.user._id))  {
						next();
					} else {
						req.flash('error', "You don't have permission do to that")
						res.send("GOTTA HAVE PERMISSION")
					}
				}
			});
		} else {
			res.redirect('back');
		}
}
middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		//is user logged in
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if(err) {
					res.redirect('back')
				} else {
					//does user own comment?
					if(foundComment.author.id.equals(req.user._id))  {
						next();
					} else {
						req.flash('error', "You don't have permission to do that")
						res.send("GOTTA HAVE PERMISSION")
					}
				}
			});
		} else {
			req.flash('error', 'You need to be logged in to do that')
			res.redirect('back');
		}
}


middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You need to be logged in to do that')
	res.redirect('/login');
}


module.exports = middlewareObj