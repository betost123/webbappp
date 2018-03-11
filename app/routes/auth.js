var authController = require('../controllers/authcontroller.js');
var models = require('../models');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

module.exports = function(app,passport){

app.get('/register', authController.register);
app.get('/signin', authController.signin);
app.post('/register', passport.authenticate('local-signup',  { successRedirect: '/home',failureRedirect: '/register'}));
app.get('/home', authController.home);
app.get('/logout',authController.logout);
app.post('/signin', passport.authenticate(
  'local-signin',  { successRedirect: '/home', failureRedirect: '/signin'}));
app.post('/deleteuser', deleteUser, authController.deleteuser);

app.get('/contactus', authController.contactus);
app.post('/contactus', contact, authController.contactus);

app.get('/ourimages', authController.ourimages);
//For Contact Us
app.get('/contactus', authController.contactus);
app.post('/contactus', contact, authController.contactus);

app.get('/settings', isLoggedIn, showUserInfo, authController.settings);

//For calendar
app.get('/calendar', isLoggedIn, authController.calendar);

//For checklist
app.get('/checklist', isLoggedIn, showNotes, authController.checklist);
app.get('/checklist/add', isLoggedIn, authController.add);
app.post('/checklist/add', isLoggedIn, addNote, authController.add);
app.get('/checklist/edit', isLoggedIn, getEditNote, authController.edit);
app.post('/checklist/edit', isLoggedIn, editNote, authController.edit);
app.get('/checklist/delete', isLoggedIn, getDeleteNote, authController.delete);
app.post('/checklist/delete', isLoggedIn, deleteNote, authController.delete);
app.get('/checklistsearched', isLoggedIn, showNotesSearched, authController.checklistsearched);

//Delete user
function deleteUser(req, res, next){
  console.log("Deleting user: " + [req.body.email]);
  models.user.destroy({
    where: {email: req.body.email}
  }).then(function() {
    console.log("You have now lost you account at BOPO");
  })
}

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

//Delete a note
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

//Show notes by category
function showNotesSearched(req, res, next) {
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
  console.log("Trying to add");
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

//Send email by contact form
function contact(req, res, next) {
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
    to: "najishahad96@gmail.com",   //Recipent of all emails
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
  console.log("This me bish: " + req.session.userpass);
    if (req.isAuthenticated())
        return next();

    res.redirect('/signin');
}

}
