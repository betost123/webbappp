var controller = require('../controllers/controller.js');
var models = require('../models');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

module.exports = function(app,passport){

app.get('/home', controller.home);
app.get('/register', controller.register);
app.post('/register', passport.authenticate('local-signup',  { successRedirect: '/home',failureRedirect: '/register'}));

app.get('/signin', controller.signin);
app.post('/signin', passport.authenticate(
  'local-signin',  { successRedirect: '/home', failureRedirect: '/signin'}));

//Settings
app.get('/settings', isLoggedIn, showUserInfo, controller.settings);
app.get('/logout',controller.logout);
app.post('/deleteuser', deleteUser, controller.deleteuser);

app.get('/ourimages', controller.ourimages);

//For Contact Us
app.get('/contactus', controller.contactus);
app.post('/contactus', contact, controller.contactus);

//For calendar
app.get('/calendar', isLoggedIn, controller.calendar);

//For checklist
app.get('/checklist', isLoggedIn, showNotes, controller.checklist);
app.get('/checklist/add', isLoggedIn, controller.add);
app.post('/checklist/add', isLoggedIn, addNote, controller.add);
app.get('/checklist/edit', isLoggedIn, getEditNote, controller.edit);
app.post('/checklist/edit', isLoggedIn, editNote, controller.edit);
app.get('/checklist/delete', isLoggedIn, getDeleteNote, controller.delete);
app.post('/checklist/delete', isLoggedIn, deleteNote, controller.delete);
app.get('/checklistsearched', isLoggedIn, showNotesSearched, controller.checklistsearched);

//Delete user
function deleteUser(req, res, next){
  console.log("Deleting user: " + [req.body.email]);
  models.user.destroy({
    where: {email: req.body.email}
  }).then(function() {
    console.log("You have now lost your account at BOPO");
  })
}

//Edit a note
function getEditNote(req, res, next) {
  console.log("We are gonna edit this note: " + req.query.id);
  models.note.findById(req.query.id).then(function(note) {
    res.render('edit', {
      note: note
    })
  })
}
function editNote(req, res, next) {
  console.log("edited to:" + req.body.text);
  models.note.findById(req.body.id).then(function(note) {
    return note.updateAttributes({text: req.body.text});
  }).then(function() {
    res.redirect("/checklist");
  })
}

//Delete a note
function getDeleteNote(req, res, next) {
  console.log("we are gonna delete this" + req.query.id);
  models.note.findById(req.query.id).then(function(note){
    res.render('delete', {
      note: note
    })
  })
}
function deleteNote(req, res, next){
  console.log("deleting:" + req.body.note);
  models.note.findById(req.body.id).then(function(note){
    return note.destroy();
  }).then(function() {
    res.redirect("/checklist");
  })
}

//Show notes by category
function showNotesSearched(req, res, next) {
  console.log("showing you notes by specified category");
  models.note.findAll({ where:
    {category: req.query.category}})
  .then(function(notes) {
    res.render('checklistsearched', {
      homechecklist: notes
    })
  })
}

//Show all notes
function showNotes(req, res, next) {
  console.log("showing you all notes");
  models.note.findAll()
  .then(function(notes) {
    res.render('checklist', {
      homechecklist: notes
    })
  })
}

//Show all notes
function showUserInfo(req, res, next) {
  models.user.findOne()
  .then(function(users) {
    res.render('settings', {
      userinfo: users
    })
  })
}

//Find user email
function getMail() {
    models.user.findAll({
      where: {status: 'active'},
      attributes: ['email']
    })
    .then(function(user) {
      console.log("This him: " + user);
      return user;
    })
}

//Add a note
function addNote(req, res, next) {
  console.log("Trying to add note");
  models.note
  .build({
    userid: req.body.userid,
    text: req.body.text,
    category: req.body.category,
    done: 'f'
  })
  .save().then(function() {
    res.redirect("/checklist");
  }).catch(function(error) {
    console.log(error);
  })
}

//Send emails by 'contact us' form
function contact(req, res, next) {
  console.log("sending this message: " + req.body.message);
  var mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport( {
    service : 'Gmail',
    auth: { //Mails are sent from this email
      user: "testwebbapp63@gmail.com",
      pass: "Rootroot"
    }
  });
  console.log('created' + smtpTrans);
  mailOpts = {
    from: req.body.name + req.body.email,
    to: "testwebbapp63@gmail.com",   //Recipent of all emails
    subject: req.body.email + '--message from contactus form',
    text: "Name:" + req.body.name + "Email:" + req.body.email
    + "Contact Number:" + req.body.contactnumber + "QUERY:" + req.body.message,
  };
    console.log('got the receiver' + mailOpts);
  smtpTrans.sendMail(mailOpts, function(error, response) {
    //Alert on event of message sent succeed or fail.
    if(error) {
      res.render('contactus', {msg: 'Error occured, message not sent.', err : true});
    } else{
      res.render('contactus', {msg: 'Message sent! Thank you', err : false});
    }
    smtpTrans.close();
  });
}

//Give access to person using website
function isLoggedIn(req, res, next) {
  console.log("User: " + req.session.userpass);
    if (req.isAuthenticated())
        return next();

    res.redirect('/signin');
}

}
