Template.tutorStatus.onCreated(function(){
  this.subscribe('tutorsOnline');
  this.subscribe('ticketData');
  this.subscribe('activeTickets');
});

Template.tutorStatus.helpers({
  tutorsAvailable: function(){
    return tutorsOnline().length;
  },
  tutorsText: function(){
    return tutorsOnline().length == 1 ? "tutor" : "tutors";
  },
  estimatedWait: function(){
    return formatTime(estimatedWait());
  }
});

function formatTime(ms){
  var s = (ms / 1000).toFixed(0);
  if (s < 60){
    return s + " seconds";
  }
  if (s >= 60 && s < 3600){
    var minutes = Math.floor(s / 60);
    return minutes + (minutes == 1 ? " minute" : " minutes");
  }
  if (s >= 3600){
    return "1 hour or more";
  }

  return "uncertain";
}

function completedTickets(){
  return Tickets.find({
    status: 'COMPLETE'
  }).fetch();
}

function activeTickets(){
  return Tickets.find({
    'status': {
      $in: ['OPEN', 'CLAIMED']
    }
  }, {
    $sort: {timestamp: 1}
  }).fetch();
}

function tutorsOnline(){
  return Meteor.users.find({
    'profile.tutor': true
  }, {
    'status.online': true
  }).fetch();
}

/**
 * Calculate wait time based off of a combination of:
 * - number of currently open/claimed tickets
 * - tutors online
 * - average wait time
 * - Otherwise, "Uncertain"
 *
 * Based on the hypothetical scenario:
 * If I were to put a ticket in now, how long should I expect
 * before my ticket is claimed?
 *
 * A few cases:
 * No tickets in the queue:
 * All tickets are claimed:
 * All tickets are open:
 * Combination of open and claimed tickets:
 *
 * With the number of tutors available, simulate the amount of time to completion.
 */
function estimatedWait(){

  // Get a list of the tutors who are online
  var tutors = tutorsOnline();

  // Get the currently active tickets
  var tickets = activeTickets();

  // Get the currently claimed tickets
  var openTickets = tickets.filter(function(t){return t.status === "OPEN"});
  var claimedTickets = tickets.filter(function(t){return t.status === "CLAIMED"});

  var claimtutors = claimedtutors(claimedTickets);

  var unclaimedOnline = tutors.filter(function(m){
    return !claimtutors[m._id];
  });

  // Median completion time
  // We use median completion time here because
  // it is more accurate than the mean in practice.
  var completeTickets = completedTickets();
  var estCompletion = stats.median(completeTickets.map(function(t){return t.completeTime - t.claimTime}));
  var estResponse = stats.median(completeTickets.map(function(t){return t.claimTime - t.timestamp}));

  if (tutors.length > 0 && openTickets.length >=0){
    if (openTickets.length < unclaimedOnline.length){
      return estResponse;
    } else {
      // There are more open tickets than there are tutors
      // tutors have to either complete the current tickets
      // or finish up on the tickets they've claimed
      var now = Date.now();

      // Find the latest ticket that hasn't been claimed yet.
      var latestOpen = stats.max(openTickets.map(function(t){return t.timestamp})) || now;

      if (claimedTickets.length > 0){
        // Find the earliest ticket that was claimed (soonest to completion)
        var earliestClaimed = stats.min(claimedTickets.map(function(t){return t.claimTime})) || now;

        // Take the min of the two options (a ticket is claimed and completed vs completed)
        // We use the latest open ticket as an earlier ticket has a higher probability of being
        // chosen soon.
        return Math.min(now - latestOpen + estResponse + estCompletion, now - earliestClaimed + estCompletion + estResponse);
      } else {
        return now - latestOpen + estResponse;
      }

    }

  }

}

/**
 * Get the tutors who have claimed tickets, and the ticket
 * @param tickets: a ticket
 *
 * @returns: [{ tutorId: ticketId }]
 */
function claimedtutors(tickets){
  var tutors = {};
  tickets.forEach(function(t){
    if (t.claimId){
      tutors[t.claimId] = t._id;
    }
  });
  return tutors;
}