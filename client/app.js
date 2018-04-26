Tickets = new Meteor.Collection("tickets");
Announcements = new Meteor.Collection("announcements");
Settings = new Meteor.Collection("settings");

Meteor.subscribe("userData");

Meteor.subscribe("activeTickets");

Meteor.subscribe("allAnnouncements");

Meteor.subscribe("tutorsOnline");

Meteor.subscribe("settings");
