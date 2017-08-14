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

Router.route('/Tutor', function(){
  this.layout('bannerLayout');
  if (authorized.Tutor()){
    this.render('Tutor');
  } else {
    this.render('error', { data: { msg: "Sorry, this page isn't available to you, please hit the home icon in the rop left corner!" }});
  }
});

Router.route('/admin', function(){
  this.layout('bannerLayout');
  if (authorized.admin()){
    this.render('admin');
  } else {
    this.render('error', { data: { msg: "Sorry, this page isn't available to you, please hit the home icon in the rop left corner!" }});
  }
});