// Admin have all rights
window.authorized = {
  user: function(){
    return Meteor.userId() ? true : false;
  },
  admin: function(){
    return Meteor.user() && Meteor.user().profile.admin;
  },
  Tutor: function(){
    return Meteor.user() && Meteor.user().profile.Tutor;
  }
};
