var exports = module.exports = {}


exports.register = function(req,res){
	res.render('register');
}

exports.signin = function(req,res){
	res.render('signin');
}

exports.dashboard = function(req,res){
	res.render('dashboard');
}

exports.checklist = function(req, res) {
	res.render('checklist');
}

exports.home = function(req, res) {
	res.render('home');
}


exports.add = function(req, res) {
	res.render('add');
}

exports.edit = function(req, res) {
	res.redner('edit');
}

exports.delete = function(req, res){
	res.render('delete');
}

exports.logout = function(req,res){
  req.session.destroy(function(err) {
  res.redirect('/');
  });

}
