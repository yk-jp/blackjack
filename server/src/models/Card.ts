class Card {
  public static SUIT: string[] = ["H", "D", "C", "S"];
  public static RANK: string[] = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  private suit: string;
  private rank: string;

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  /*
     return Number : integer score based on the rank of card
      return a number from 2 to 10 as it is. 
      return 10 when a rank is the one of 'J','Q' or 'K',
      return 10 as a tentative number when a rank is a 'A'. Beccause 'A' should be considered as 1 or 11 after judging from player's cards.  
  */

  public getRankNumber(): number {
    if ("JQK".indexOf(this.rank) !== -1) {
      return 10;
    } else if (this.rank === "A") {
      // give 11 as a temporary number (It could be 1. Take whichever makes a better hand)
      return 11;
    }
    return parseInt(this.rank);
  }

  // getter 
  public getRank():string { 
    return this.rank;
  }

  public getSuit():string { 
    return this.suit;
  }

}

export default Card;
