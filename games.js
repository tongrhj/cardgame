Games = new Meteor.Collection('games')

if (Meteor.isServer) {
  Meteor.publish('games', function () {
    return Games.find({currentTurn: this.userId})
  })

  Meteor.publish('users', function () {
    return Meteor.users.find()
  })
}

if (Meteor.isClient) {
  Meteor.subscribe('games')
  Meteor.subscribe('users')
}

Meteor.methods({
  createGame: function (otherPlayerId) {
    var game = GameFactory.createGame([Meteor.userId(), otherPlayerId])
    Games.insert(game)
  },
  takeTurn: function (gameId, id, card) {
    var game = Games.findOne(gameId)
    var choices = game.players[id].choices

    console.log('current round: ', game.round)
    console.log('current players id: ', game.players[id])
    console.log('current turn is: ', game.currentTurn);

    // if (game.currentTurn[0] === id && Turns.inHand(hand, card))
    // if not the current user's turn OR if the player has no moves left for the round
    // if (game.currentTurn[0] !== id || !move > 0) return
    if (game.currentTurn[0] !== id && choices.length > 2) return

    // var match = Turns.getMatch(card, game.table)
    if (game.moves > 1){
      choices.push(card.name)
      game.moves = game.moves - 1

    } else if (game.moves > 0){
      choices.push(card.name)
      game.moves = game.moves - 1
      game.currentTurn.unshift(game.currentTurn.pop())
      game.moves = 2 // reset no of moves

      if (game.round % 2 === 0) {
        // tally the score
        var mePlayer = game.players[game.currentTurn[0]]
        var otherPlayer = game.players[game.currentTurn[1]]

        function resetChoices() {
          mePlayer.choices = []
          otherPlayer.choices = []
        }

        function resetCards(){
          game.table.shift(game.deck[0])
          game.table.push(game.deck[Math.floor(Math.random() * game.deck.length)])
          game.whitetable.splice(0, 3
            , game.whitedeck[Math.floor(Math.random() * game.whitedeck.length)]
            , game.whitedeck[Math.floor(Math.random() * game.whitedeck.length)]
            , game.whitedeck[Math.floor(Math.random() * game.whitedeck.length)]
          )
        }

        function scoringRound () {
          if (mePlayer.choices[1] == otherPlayer.choices[0]) {
            mePlayer.score += 1
            console.log('I scored: ' + mePlayer.score);
          } else {
            mePlayer.score += 0
            console.log('I didnt score: ' + mePlayer.score);
          }

          if (otherPlayer.choices[1] == mePlayer.choices[0]) {
            otherPlayer.score += 1
            console.log('Opponent scored: ' + otherPlayer.score);
          } else {
            otherPlayer.score += 0
            console.log('Opponent didnt score: ' + otherPlayer.score);
          }
        }
        scoringRound()
        resetChoices()
        resetCards()
      } else {
        // not 2 rounds yet, no scoring will be done
      }
      game.round = game.round + 1
    } else {
      console.log('if game.moves == 0', game.moves);
      return
    }

    if (game.round >= 20) {
      scoreGame(game) // score the game
    }
    Games.update(gameId, game)
  }
})
