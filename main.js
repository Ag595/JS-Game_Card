const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function Card(value, suit) {
  this.value = value;
  this.suit = suit;


  this.getScore = function() {
    if (this.value === 7) return 0;
    if (this.value === 'J') return -1;
    if (this.value === 'Q') return 12;
    if (this.value === 'K') return 13;
    return this.value; 
  };

 
  this.toString = function() {
    return `${this.value} of ${this.suit}`;
  };
}


function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  const deck = [];

  suits.forEach(function(suit) {
    values.forEach(function(value) {
      deck.push(new Card(value, suit));
    });
  });

  return deck;
}


function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}


function Player(name) {
  this.name = name;
  this.hand = [];


  this.addCard = function(card) {
    this.hand.push(card);
  };


  this.replaceCard = function(index, card) {
    const replacedCard = this.hand[index];
    this.hand[index] = card;
    return replacedCard;
  };


  this.getScore = function() {
    return this.hand.reduce(function(acc, card) {
      return acc + card.getScore();
    }, 0);
  };


  this.displayHand = function() {
    return this.hand.map(function(card) {
      return card.toString();
    }).join(', ');
  };
}


function startGame() {
  let deck = shuffleDeck(createDeck());
  const discardPile = [];

  const player1 = new Player('Player 1');
  const player2 = new Player('Player 2');
  const players = [player1, player2];


  for (let i = 0; i < 4; i++) {
    player1.addCard(deck.pop());
    player2.addCard(deck.pop());
  }

  discardPile.push(deck.pop());

  let currentPlayerIndex = 0;

  function takeTurn() {
    const currentPlayer = players[currentPlayerIndex];

    console.log(`\nIt's ${currentPlayer.name}'s turn.`);
    console.log(`${currentPlayer.name}'s hand: ${currentPlayer.displayHand()}`);
    console.log(`Top of discard pile: ${discardPile[discardPile.length - 1].toString()}`);

    rl.question('Draw from deck (D) or discard pile (P)? ', function(action) {
      let drawnCard;

      if (action.toLowerCase() === 'd') {
        drawnCard = deck.pop();
        console.log(`You drew: ${drawnCard.toString()}`);
      } else {
        drawnCard = discardPile.pop();
        console.log(`You took from discard pile: ${drawnCard.toString()}`);
      }

      rl.question('Replace which card (0-3)? ', function(index) {
        const replacedCard = currentPlayer.replaceCard(parseInt(index), drawnCard);
        discardPile.push(replacedCard);
        console.log(`Replaced ${replacedCard.toString()} with ${drawnCard.toString()}`);

        currentPlayerIndex = (currentPlayerIndex + 1) % 2;

        if (deck.length === 0 || players.some(function(player) {
          return player.hand.every(function(card) {
            return card;
          });
        })) {
          endGame();
        } else {
          takeTurn();
        }
      });
    });
  }

  function endGame() {
    rl.close();
    console.log('\nGame Over!');
    console.log(`${player1.name}'s score: ${player1.getScore()}`);
    console.log(`${player2.name}'s score: ${player2.getScore()}`);

    const winner = player1.getScore() < player2.getScore() ? player1 : player2;
    console.log(`${winner.name} wins!`);
  }

  takeTurn();
}

startGame();