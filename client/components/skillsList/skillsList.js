Template.skillsList.onCreated(function(){
  this.subscribe("allTutors");
});

Template.skillsList.helpers({
  skills: function(){
    var skills = {};
    Meteor.users.find({ 'profile.Tutor': true})
        .fetch()
        .forEach(function(Tutor){
          if (Tutor.profile.skills){
            Tutor.profile.skills.forEach(function(skill){
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