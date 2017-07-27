// ----------------------------------------
// Basic Roles, Client side auth
// ----------------------------------------

// Admin have all rights
authorized = {
  user: function(id){
    var user = _getUser(id);
    return user ? true : false;
  },
  admin: function(id){
    var user = _getUser(id);
    return user.profile.admin
  },
  Tutor: function(id){
    var user = _getUser(id);
    return user.profile.admin || user.profile.Tutor
  }
};