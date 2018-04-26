Template.leaderboard.onCreated(function(){
  this.subscribe("ticketData");
  this.subscribe("alltutors");
  this.rows = new ReactiveVar();

  // TODO: Expand to more
  this.rows.set(10);
});

Template.leaderboard.helpers({
  toptutors: function(){
    // Return the top number of tutors
    return toptutors(Template.instance().rows.get());
  }
});

// Ranking algorithm based on number of ratings and quality of ratings.
function toptutors(num){
  var tutors = {};
  var tickets = Tickets.find({
    status: "COMPLETE"
  }).fetch().filter(function(t){return t.rating > 0});

  // Each tutor has a set of ratings
  tickets.forEach(function(t){
    if (t.claimId){
      if (!tutors[t.claimId]) {
        tutors[t.claimId] = {
          ratings: []
        }
      }
      tutors[t.claimId].ratings.push(t.rating);
    }
  });

  var ids = Object.keys(tutors);
  return ids
      .filter(function(id){
        return Meteor.users.findOne({_id: id, 'profile.tutor': true});
      })
      .map(function(id){
        return {
          profile: Meteor.users.findOne({_id: id}).profile,
          rating: laplaceSmooth(tutors[id].ratings),
          numTickets: tutors[id].ratings.length
        }
      })
      .sort(function(a, b){
        return b.rating - a.rating;
      })
      .slice(0, num);

}

function laplaceSmooth(x){
  var alpha = 6,
      beta  = 2,
      sum  = stats.sum(x);
  return ((sum + alpha)/(x.length + beta)).toFixed(1);
}