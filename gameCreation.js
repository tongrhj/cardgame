GameFactory = {}
// if (Meteor.isServer) {
// myjson = {}
// myjson = JSON.parse(Assets.getText("cards.json"))
// theBlackArray = myjson.blackCards
// theWhiteArray = myjson.whiteCards
// }
theBlackArray = cardJson.blackCards
theWhiteArray = whiteCardJson.whiteCards

GameFactory.createGame = function (playerIds) {
  var deck = createDeck()
  var whitedeck = createWhiteDeck()
  var players = createPlayers(playerIds)

  // GameFactory.dealPlayers(players, deck)
  var table = dealTable(deck)
  var whitetable = dealWhiteTable(whitedeck)

  return {
    deck: deck,
    whitedeck: whitedeck,
    players: players,
    table: table,
    whitetable: whitetable,
    currentTurn: playerIds,
    inProgress: true,
    started: new Date()
  }
}

function dealTable(deck){
  var c = deck.shift.bind(deck)
  return [c()]
}

function dealWhiteTable(whitedeck){
  var c = whitedeck.shift.bind(whitedeck)
  return [c(), c(), c(), c(), c()]
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

function createDeck () {
  var cards = []
  for (var i = 0; i < theBlackArray.length; i++) {
    if (theBlackArray[i].pick > 1) {
      // do nothing
    } else {
      cards.push({
        name: theBlackArray[i].text
      })
    }
  }
  return _.shuffle(cards)
}

function createWhiteDeck () {
  var cards = []
  for (var i = 0; i < theWhiteArray.length; i++) {
    cards.push({
      name: theWhiteArray[i].text,
      counter: 0
    })
  }
  return _.shuffle(cards)
}
