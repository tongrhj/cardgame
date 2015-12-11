GameFactory = {}
// if (Meteor.isServer) {
// myjson = {}
// myjson = JSON.parse(Assets.getText("cards.json"))
// theBlackArray = myjson.blackCards
// theWhiteArray = myjson.whiteCards
// }
// Meteor.call('getData', function(err, res){
//   console.log(res.content)
// })

GameFactory.createGame = function (playerIds) {
  var blackDeck = createBlackDeck()
  // var whiteDeck = createWhiteDeck()
  var players = createPlayers(playerIds)

  // GameFactory.dealPlayers(players, deck)
  var tableBlack = dealBlack(blackDeck)
  // var tableWhite = dealWhite(whiteDeck)

  return {
    blackDeck: blackDeck,
    players: players,
    tableBlack: tableBlack,
    currentTurn: playerIds,
    inProgress: true,
    started: new Date()
  }
}

// GameFactory.dealPlayers(players, deck){
//
// }

function dealBlack(blackDeck){
  var c = blackDeck.shift.bind(blackDeck)
  return [c()]
}

function createPlayers (ids) {
  var o = {}

  ids.forEach(function (id) {
    o[id] = {
      vote: 0,
      score: 0
    }
  })

  return o
}

function createBlackDeck () {
  var cards = []

  for (var i = 0; i < theBlackArray.length; i++) {
    if (theBlackArray[i].pick > 1) {
      // do nothing
    } else {
      cards.push(theBlackArray[i])
      console.log(theBlackArray[i])
      // var randomTopic = theBlack[randBlackNum].text
      // console.log(randomTopic)
    }
  }

  return _.shuffle(cards)
  console.log(cards);
}

// function createWhiteDeck () {
//
// }
