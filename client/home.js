Template.userList.helpers({
  users: function () {
    var myid = Meteor.userId()
    var cantPlayAgainst = [myid]

    Games.find({
      inProgress: true,
    })
    .forEach(function (game) {
      cantPlayAgainst.push(game.currentTurn[game.currentTurn[0] === myid ? 1 : 0])
    })

    return Meteor.users.find({ _id: { $not: { $in: cantPlayAgainst}}})
  }
})

Template.blackCardList.helpers({
  blackdeck: function () {
    console.log(BlackDeck.find().fetch())
    return BlackDeck.find().fetch()
  }
})

Template.whiteCardList.helpers({
  whitedeck: function () {
    console.log(WhiteDeck.find().fetch())
    return WhiteDeck.find().fetch()
  }
})

Template.userItem.events({
  'click button': function (evt, template) {
    Meteor.call('createGame', template.data._id)
  }
})
