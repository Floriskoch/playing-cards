// create local scope
{
  /* PLAYER */
  const Player = function(name) {
    this.name = name;
    this.cards = [];
  };

  Player.prototype.getCardsString = function() {
    const cardsString = [];
    for (let i = 0; i < this.cards.length; i++) {
      cardsString.push(`&${this.cards[i].suit};${this.cards[i].rank}`);
    }

    return cardsString.join(' ');
  };

  Player.prototype.takeCard = function(deck) {
    // Skip turn is deal pile is empty
    if (!deck.dealPile.length) {
      document.write(`Deal pile is empty, ${this.name} skips turn. <br>`);
      return;
    }
    // Take card from deal pile
    const card = deck.dealPile.shift();
    // Add card to players' cards
    this.cards.push(card);
    // Write out
    document.write(`${this.name} does not have a suitable card, takes &${card.suit};${card.rank} from deal pile. <br>`);
  };

  Player.prototype.playCard = function(deck) {
    const topCard = deck.discardPile[deck.discardPile.length - 1];
    // Loop through players' cards to find match
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].suit === topCard.suit || this.cards[i].rank === topCard.rank) {
        const card = this.cards.splice(i, 1)[0];
        // Move card to discard pile
        deck.discardPile.push(card);
        // Write out
        document.write(`${this.name} plays &${card.suit};${card.rank} <br>`);
        // Check if last card
        if (this.cards.length <= 0) {
          deck.hasWinner = true;
          document.write(`${this.name} wins the game! <br>`);
          return true;
        }
        // Break out of function
        return false;
      }
    }
    // If no match found take card.
    this.takeCard(deck);
  };


  /* CARD */
  const Card = function(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  };


  /* DECK */
  const Deck = function() {
    this.dealPile = [];
    this.discardPile = [];
    this.hasWinner = false;
  };

  Deck.prototype.createDeck = function() {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['hearts', 'diams', 'clubs', 'spades'];

    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        this.dealPile[i*ranks.length + j] = new Card(ranks[j], suits[i]);
      }
    }
  };

  Deck.prototype.shuffle = function() {
    let deckLength = this.dealPile.length;
    while (deckLength) {
      let i = Math.floor(Math.random() * deckLength--);
      let temp = this.dealPile[deckLength];
      this.dealPile[deckLength] = this.dealPile[i];
      this.dealPile[i] = temp;
    }
  };

  Deck.prototype.deal = function(players = []) {
    // Set amount of cards each players will be dealt
    const dealAmount = 7;
    // Move cards from deal pile to players
    for (let i = 0; i < players.length; i++) {
      for (let j = 0; j < dealAmount; j++) {
        players[i].cards.push(this.dealPile.shift());
      }
    // Write out
    document.write(`${players[i].name} has been dealt: ${players[i].getCardsString()}<br>`);
    }
  };

  Deck.prototype.playFirstCard = function() {
    const topCard = this.dealPile.shift();
    this.discardPile.push(topCard);
    document.write(`Top card is &${topCard.suit};${topCard.rank} <br>`);
  };


  /* RUN GAME */
  // Create players
  let players = ['Hans', 'Tom', 'Maarten', 'Kevin'];

  // Write out
  document.write(`Starting game with ${players.join(', ')}. <br>`);

  // Map names to player instances
  players = players.map((player) => new Player(player));

  // Create deck
  const deck = new Deck();
  deck.createDeck();

  // Shuffle the deck
  deck.shuffle();

  // Deal cards to the players
  deck.deal(players);

  // Play first card
  deck.playFirstCard();

  // Loop until a winner is found
  while (!deck.hasWinner) {
    for (let player of players) {
      const playedLastCard = player.playCard(deck);
      if (playedLastCard) break;
    };
  }
}

// Resources used:
// https://bost.ocks.org/mike/shuffle/
// http://stackoverflow.com/questions/26248001/

