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
    // console.log(id, card)
    var game = Games.findOne(gameId)
    var choices = game.players[id].choices
    //var hand = game.players[id].hand

console.log(game.round)
console.log(game.players[id])

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

      if (game.moves % 2 === 0) {
        // tally the score
        var mePlayer = game.players[game.currentTurn[0]]
        var otherPlayer = game.players[game.currentTurn[1]]

        // console.log(mePlayer.choices);
        // console.log(otherPlayer.choices);

        function scoringRound () {
          if (mePlayer.choices[1] == otherPlayer.choices[0]) {
            mePlayer.score += 1
            console.log('current player', mePlayer.score);
          } else {
            mePlayer.score += 0
            console.log('current player', mePlayer.score);
          }

          if (otherPlayer.choices[1] == mePlayer.choices[0]) {
            otherPlayer.score += 1
            console.log('opponent', otherPlayer.score);

          } else {
            otherPlayer.score += 0
            console.log('opponent', otherPlayer.score);
          }
        }

        function resetChoices() {
          mePlayer.choices = []
          otherPlayer.choices = []
        }

        scoringRound()
        // function scoreTheRound(options, callback) {
        //   callback()
        // }
        //
        // scoreTheRound(scoringRound, resetChoices){
        //   console.log('before callback me', mePlayer.choices);
        //   console.log('before callback opponent', otherPlayer.choices);
        //
        //   // resetChoices()
        //
        //   console.log('after callback me', mePlayer.choices);
        //   console.log('after callback opponent', otherPlayer.choices);
        // })

      } else {
        // not 2 rounds yet, no scoring done
        return
      }

      game.round = game.round + 1

    } else {
      console.log('if game.moves == 0', game.moves);
      return
    }

    // card.counter = card.counter + 1
    // card.voted.push(game.players[id])
    // game.currentTurn.unshift(game.currentTurn.pop())

    if (game.round >= 20) {
      console.log('yay!')
      // scoreGame(game) // score the game
    }
    Games.update(gameId, game)
  }
})
