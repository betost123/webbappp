var authController = require('../controllers/authcontroller.js');
var models = require('../models');

module.exports = function(app,passport){

app.get('/register', authController.register);
app.get('/signin', authController.signin);
app.post('/register', passport.authenticate('local-signup',  { successRedirect: '/home',failureRedirect: '/register'}));
app.get('/home',isLoggedIn, authController.home);
app.get('/logout',authController.logout);
app.post('/signin', passport.authenticate(
  'local-signin',  { successRedirect: '/home', failureRedirect: '/signin'}));

//For checklist
app.get('/checklist', isLoggedIn, showNotes, authController.checklist);
app.get('/checklist/add', isLoggedIn, authController.add);
app.post('/checklist/add', addNote, authController.add);
app.get('/checklist/edit', getEditNote, authController.edit);
app.post('/checklist/edit', editNote, authController.edit);
app.get('/checklist/delete', getDeleteNote, authController.delete);
app.post('/checklist/delete', deleteNote, authController.delete);
//Edit a note
function getEditNote(req, res, next) {
  console.log("We gonna edit this note: " + req.query.id);
  models.note.findById(req.query.id).then(function(note) {
    res.render('edit', {
      note: note
    })
  })
}
function editNote(req, res, next) {
  models.note.findById(req.body.id).then(function(note) {
    return note.updateAttributes({text: req.body.text});
  }).then(function() {
    res.redirect("/checklist");
  })
}

function getDeleteNote(req, res, next) {
  console.log("we gonna delete thid" + req.query.id);
  models.note.findById(req.query.id).then(function(note){
    res.render('delete', {
      note: note
    })
  })
}
function deleteNote(req, res, next){
  models.note.findById(req.body.id).then(function(note){
    return note.destroy();
  }).then(function() {
    res.redirect("/checklist");
  })
}

//Show all notes
function showNotes(req, res, next) {
  models.note.findAll().then(function(notes) {
    res.render('checklist', {
      homechecklist: notes
    })
  })
}
//Add a note
function addNote(req, res, next) {
  console.log("Trying to add");
  models.note
  .build({
    userid: 'Petina',
    text: req.body.text,
    done: 'f'
  }).save().then(function() {
    res.redirect("/checklist");
  }).catch(function(error) {
    console.log(error);
  })
}
//Give access to person using website
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signin');
}





}
