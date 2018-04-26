Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('splash');
  } else {
    this.next();
  }
});

Router.route('/', function(){
  this.layout('bannerLayout');
  this.render('home');
});

Router.route('/profile', function(){
  this.layout('bannerLayout');
  this.render('profile');
});

Router.route('/tutor', function(){
  this.layout('bannerLayout');
  if (authorized.tutor()){
    this.render('tutor');
  } else {
    this.render('error', { data: { msg: "You're not a tutor!" }});
  }
});

Router.route('/admin', function(){
  this.layout('bannerLayout');
  if (authorized.admin()){
    this.render('admin');
  } else {
    this.render('error', { data: { msg: "You're not an admin!" }});
  }
});