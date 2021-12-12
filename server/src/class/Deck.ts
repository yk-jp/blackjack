import Card from "./Card";
// types
import type {TGameType} from '../types/TGameType';

class Deck {
  private gameType: TGameType;
  private cards: Card[];

  constructor(gameType: TGameType | null = null) {
    this.gameType = gameType as TGameType;
    this.cards = [];
    // reset deck depending on gametype. currently only blackjack
    this.resetDeck(this.gameType);
  }

  public shuffle(): void {
    // Math.random() * (max - min) + min min <= x < max
    for (let i = 0; i < this.cards.length; i++) {
      let randomNum = Math.floor(Math.random() * (this.cards.length - i));
      let temp = this.cards[i];
      this.cards[i] = this.cards[randomNum];
      this.cards[randomNum] = temp;
    }
  }

  public resetDeck(gameType: string | null = null): void {
    this.cards = [];
    for (let i = 0; i < Card.SUIT.length; i++) {
      for (let j = 0; j < Card.RANK.length; j++) {
        this.cards.push(new Card(Card.SUIT[i], Card.RANK[j]));
      }
    }
    this.shuffle();
  }

  public drawOne(): Card {
    return this.cards.pop() as Card;
  }

  // setter

  public setCards(cards:Card[]):void { 
    this.cards = cards;
  }

  // getter
  public getCards():Card[] { 
    return this.cards;
  }
}

export default Deck;
