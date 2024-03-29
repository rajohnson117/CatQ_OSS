// ---------------------------------------
// Publish Data
// ---------------------------------------

Meteor.publish("userData", getUserData);
Meteor.publish("allUsers", getAllUsers);
Meteor.publish("allTutors", getAllTutors);
Meteor.publish("TutorsOnline", getTutorsOnline);

Meteor.publish("activeTickets", getActiveTickets);
Meteor.publish("allTickets", getAllTickets);
Meteor.publish("ticketData", getTicketData);
Meteor.publish("userTickets", getUserTickets);

Meteor.publish("allAnnouncements", getAllAnnouncements);

Meteor.publish("settings", getSettings);

// Get user data on yourself
function getUserData(){
  if (authorized.user(this.userId)) {
    return Meteor.users.find({_id: this.userId},
        {
          fields: {
            'services': 1,
            'profile': 1
          }
        });
  } else {
    this.ready();
  }
}

// Get all users
function getAllUsers(){
  if (authorized.admin(this.userId)) {
    return Meteor.users.find({},
        {
          fields: {
            'createdAt': 1,
            'username': 1,
            'services': 1,
            'profile': 1
          }
        });
  }
}

// Tutors are able to see each other.
function getAllTutors(){
  if (authorized.Tutor(this.userId)){
    return Meteor.users.find({
      'profile.Tutor': true
    },{
      fields: {
        'profile.name': 1,
        'profile.Tutor': 1,
        'profile.company': 1,
        'profile.skills': 1,
        'services.facebook.id': 1
      }
    });
  }
}

// All users can see any Tutor that is currently online
function getTutorsOnline(){
  if (authorized.user(this.userId)) {
    return Meteor.users.find({
      'profile.Tutor': true,
      'status.online': true
    }, {
      fields: {
        'profile.name': 1,
        'profile.email': 1,
        'profile.phone': 1,
        'profile.admin': 1,
        'profile.Tutor': 1,
        'profile.skills': 1,
        'status.idle': 1,
        'status.online': 1
      }
    });
  }
}

// Get all of the active tickets
function getActiveTickets(){
  if (authorized.user(this.userId)) {
    return Tickets.find(
        {
          status: {
            $in: ["OPEN", "CLAIMED"]
          }
        }, {
          sort: {
            timestamp: 1
          }
        });
  } else {
    this.ready();
  }
}

function getTicketData(){
  if (authorized.user(this.userId)){
    return Tickets.find({},
        {
          fields: {
            timestamp: 1,
            claimId: 1,
            claimTime: 1,
            completeTime: 1,
            status: 1,
            rating: 1
          }
        });
  }
}

// Get all of the tickets
function getAllTickets(){
  if (authorized.admin(this.userId)){
    return Tickets.find({});
  } else {
    // If not admin, have limited fields
    if (authorized.user(this.userId)){
      return Tickets.find({},
          {
            fields: {
              timestamp: 1,
              claimId: 1,
              claimTime: 1,
              completeTime: 1,
              status: 1,
              rating: 1
            }
          });
    }
  }
}

// Get the tickets for the current user
function getUserTickets(){
  if (authorized.user(this.userId)){
    return Tickets.find({
      userId: this.userId
    });
  }
}

// Get all of the announcements
function getAllAnnouncements(){
  if (authorized.user(this.userId)){
    return Announcements.find({});
  }
}

function getSettings(){
  if (authorized.user(this.userId)){
    return Settings.find({});
  }
}