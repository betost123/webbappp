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
//Log out user
exports.logout = function(req,res){
  req.session.destroy(function(err) {
  res.redirect('/');
  });
}

//Calendar
exports.calendar = function(req, res){
	res.render('calendar');
}