Template.leaderboard.onCreated(function(){
  this.subscribe("ticketData");
  this.subscribe("allTutors");
  this.rows = new ReactiveVar();

  // TODO: Expand to more
  this.rows.set(10);
});

Template.leaderboard.helpers({
  topTutors: function(){
    // Return the top number of Tutors
    return topTutors(Template.instance().rows.get());
  }
});

// Ranking algorithm based on number of ratings and quality of ratings.
function topTutors(num){
  var Tutors = {};
  var tickets = Tickets.find({
    status: "COMPLETE"
  }).fetch().filter(function(t){return t.rating > 0});

  // Each Tutor has a set of ratings
  tickets.forEach(function(t){
    if (t.claimId){
      if (!Tutors[t.claimId]) {
        Tutors[t.claimId] = {
          ratings: []
        }
      }
      Tutors[t.claimId].ratings.push(t.rating);
    }
  });

  var ids = Object.keys(Tutors);
  return ids
      .filter(function(id){
        return Meteor.users.findOne({_id: id, 'profile.Tutor': true});
      })
      .map(function(id){
        return {
          profile: Meteor.users.findOne({_id: id}).profile,
          rating: laplaceSmooth(Tutors[id].ratings),
          numTickets: Tutors[id].ratings.length
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