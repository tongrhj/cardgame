Games = new Meteor.Collection('games')
// Deck = new Meteor.Collection('deck')
BlackDeck = new Meteor.Collection('blackdeck')
WhiteDeck = new Meteor.Collection('whitedeck')

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

      if(BlackDeck.find().count() === 0){
        // console.log(cardJson.blackCards.pick)
          var decks = cardJson.blackCards
          for (var i = 0; i < decks.length; i++) {
            if (decks[i].pick > 1) {
              // do nothing
            } else {
            BlackDeck.insert(decks[i])
            }
          }
      }

      if(WhiteDeck.find().count() === 0){
          var playdecks = whiteCardJson.whiteCards
          // for (var i = 0; i < playdecks.length; i++) {
          //   console.log(playdecks[i])
          //   WhiteDeck.insert(playdecks[i])
          // }
          for (playdeck in playdecks) {
              WhiteDeck.insert(playdecks[playdeck])
          }
      }
  })

  Meteor.publish('games', function () {
    return Games.find({currentTurn: this.userId})
  })

  // Meteor.publish('deck', function () {
  //   return Deck.find()
  // })

  Meteor.publish('blackdeck', function () {
    return BlackDeck.find()
  })

  Meteor.publish('whitedeck', function () {
    return WhiteDeck.find()
  })

  Meteor.publish('users', function () {
    return Meteor.users.find()
  })
}

if (Meteor.isClient) {
  Meteor.subscribe('games')
  // Meteor.subscribe('deck')
  Meteor.subscribe('blackdeck')
  Meteor.subscribe('whitedeck')
  Meteor.subscribe('users')
}

Meteor.methods({
  createGame: function (otherPlayerId) {
    var game = GameFactory.createGame([Meteor.userId(), otherPlayerId])
    Games.insert(game)
  }
})
