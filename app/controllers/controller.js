var exports = module.exports = {}

//Register user
exports.register = function(req,res){
	res.render('register');
}
//Sign in user
exports.signin = function(req,res){
	res.render('signin');
}
//Checklist
exports.checklist = function(req, res) {
	res.render('checklist');
}
//A searched checklist
exports.checklistsearched = function(req, res) {
	res.render('checklistsearched');
}
//Home page
exports.home = function(req, res) {
	res.render('home');
}
//Add to checklist
exports.add = function(req, res) {
	res.render('add');
}
//Edit checklist
exports.edit = function(req, res) {
	res.render('edit');
}
//Delete from checklist
exports.delete = function(req, res){
	res.render('delete');
}
//Contact us
exports.contactus = function(req, res){
	res.render('contactus');
}
//settings
exports.settings = function(req, res){
	res.render('settings');
}
//upload
exports.upload = function(req, res) {
	res.render('upload');
}
//delete users
exports.deleteuser = function(req, res) {
	res.render('/');
}
// image folder..
exports.ourimages = function(req, res) {
	res.render('ourimages');
}
//Log out user
exports.logout = function(req,res){
  req.session.destroy(function(err) {
		console.log("you are now logged out!");
  res.redirect('/');
  });
}

//Calendar
exports.calendar = function(req, res){
	res.render('calendar');
}
