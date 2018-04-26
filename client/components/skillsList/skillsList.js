Template.skillsList.onCreated(function(){
  this.subscribe("alltutors");
});

Template.skillsList.helpers({
  skills: function(){
    var skills = {};
    Meteor.users.find({ 'profile.tutor': true})
        .fetch()
        .forEach(function(tutor){
          if (tutor.profile.skills){
            tutor.profile.skills.forEach(function(skill){
              var s = skill.toLowerCase();
              if (skills[s]){
                skills[s]++;
              } else {
                skills[s] = 1;
              }
            })
          }
        });
    var keys = Object.keys(skills);
    var count = [];
    keys.forEach(function(k){
      count.push({
        skill: k,
        count: skills[k]
      })
    });
    return count
        .sort(function(a, b){return b.count - a.count})
        .slice(0, 15);
  }
});