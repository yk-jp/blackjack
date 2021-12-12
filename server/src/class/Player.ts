import Card from "./Card";
import GameDecision from "./GameDecision";
// types
import type {TPlayerStatus} from '../types/TPlayerStatus';
import type {TPlayerType} from '../types/TPlayerType';
abstract class Player {
  /*
      String name : player name
      String gameType : current type of games are only blackjack. If this game were extended, players would be initialized depending on what type of games uesrs pick up.
      boolean judgeByRatio(ratio) : High possibilities　 →　true　 Low possibilities　→　false　　(e.g 7:3 →　posibility(7,3) →　true : false)
  */
  public static STATUSFORBLACKJACK: { [key: string]: TPlayerStatus } = {
    bet: "playing",
    playing: "bet",
    broke: "broke",
  };

  protected name: string;
  protected gameType: string;
  protected hand: Card[];
  protected status: TPlayerStatus;
  protected action: string;
  protected winAmount: number;
  protected type: TPlayerType;
  protected bet: number;
  protected chip: number;
  constructor(name: string, gameType: string) {
    // player name
    this.name = name;
    // current game
    this.gameType = gameType;
    // playr's cards
    this.hand = [];
    // crurrent player's status
    this.status = "bet";
    // player's action
    this.action = "bet";

    this.winAmount = 0;
    this.type = "ai";
    this.bet = 0;
    this.chip = 400;
  }

  // abstract method
  public abstract prompt(userData: null): void | GameDecision;
  // update status
  public abstract switchStatus(gameType: string): void;

  /*
     return Number : Toal score of player's hand
     If the total score went over 21, subtract 10 from it until it reaches 21.
  */
  public getHandScore(): number {
    let totalScore: number = 0;
    this.hand.forEach((card) => {
      totalScore += card.getRankNumber();
    });

    // A is calculated as 1 until the score becomes less than 21
    if (totalScore > 21) {
      let i: number = 0;
      while (totalScore > 21 && i < this.hand.length) {
        // A: 11→1  total-11+1 = total-10
        if (this.hand[i].getRank() === "A") totalScore -= 10;
        i++;
      }
    }
    return totalScore;
  }

  // boolean: judging if it's blackjack or not.
  public blackjack(): boolean {
    return this.getHandScore() == 21;
  }

  // boolean: "A"を持つblackjackか判定
  public blackjackAndHasAce(): boolean {
    let scoreIsBlackJack: boolean = this.blackjack();
    if (scoreIsBlackJack) {
      this.hand.forEach((card) => {
        if (card.getRank() === "A") return true;
      });
    }
    return false;
  }

  // used for possibility
  public judgeByRatio(ratio: number): boolean {
    const random = Math.floor(Math.random() * 10) + 1; //1～10
    return random <= ratio;
  }

  public resetHand(): void {
    this.hand = [];
  }

  public addCard(card: Card): void {
    this.hand.push(card);
  }

  // setter
  public setAction(action: string): void {
    this.action = action;
  }

  public setHand(cards: Card[]): void {
    this.hand = cards;
  }

  public setBet(bet: number): void {
    this.bet = bet;
  }

  public setStatus(status: TPlayerStatus): void {
    this.status = status;
  }

  public setChip(chip: number): void {
    this.chip = chip;
  }

  public setWinAmount(money: number): void {
    this.winAmount = money;
  }

  // getter
  public getName(): string {
    return this.name;
  }

  public getAction(): string {
    return this.action;
  }

  public getHand(): Card[] {
    return this.hand;
  }

  public getBet(): number {
    return this.bet;
  }

  public getChip(): number {
    return this.chip;
  }

  public getWinAmount(): number {
    return this.winAmount;
  }

  public getStatus(): string {
    return this.status;
  }
}

export default Player;
