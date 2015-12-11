Games = new Meteor.Collection('games')
Deck = new Meteor.Collection('deck')

/*
game = {
currentTurn = [player a, player b]
deck: [], -> white cards?
table: [] -> black cards?
players:{
  player a:{
  hand: [] -> vote?
  score: {}
  }
  player b:{
  hand: [] -> vote?
  score: {}
  }
}
inprogress: true or false
started: date
finished: date
winner: player id
}
*/

if (Meteor.isServer) {
  Meteor.startup(function () {
      if(Deck.find().count() === 0){
          var decks = cardJson
          for (deck in decks) {
              Deck.insert(decks[deck])
          }
      }
  })


  Meteor.publish('games', function () {
    return Games.find({currentTurn: this.userId})
  })

  Meteor.publish('deck', function () {
    return Deck.find()
  })

  Meteor.publish('users', function () {
    return Meteor.users.find()
  })
}

if (Meteor.isClient) {
  Meteor.subscribe('games')
  Meteor.subscribe('deck')
  Meteor.subscribe('users')
}

Meteor.methods({
  createGame: function (otherPlayerId) {
    var game = GameFactory.createGame([Meteor.userId(), otherPlayerId])
    Games.insert(game)
  }

  // getData: function (data) {
  //   return Meteor.http.call('GET', 'cards.json')
  // }
})
