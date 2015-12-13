scoreGame = function (game) {
  game.players[game.lastScorer].pile.push.apply(game.players[game.lastScorer].pile, game.table)
  game.table = []
  game.inProgress = false
  game.finished = new Date()

  // top scoring player and points
  var score = ['x', -1]

  Object.keys(game.players).forEach(function (id) {
    var cardCount = game.players[id].pile.length
    if (cardCount > score[1]) {
      score = [id, cardCount]
    } else if (cardCount === score[1]) {
      score = false
    }
  })
}
