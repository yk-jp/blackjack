import Player from "./Player";
import GameDecision from "./GameDecision";

/* overview
  extension
    name : player name 
    gameType(blackjack)
    hand : player's cards
    void getHandScore() : Number →　return current player's score
    bet :　how much players bet in each round.
  neccessary variables, functions
    chip(default = 400)　:　current balance
    winAmount : the amout of money when players win the game
    status : current player's status　→ {bet,playing,broke}
    } 
    action : 現在のplayerのaction  →　{bet,stand,hit,double,surrender,broke}
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須 　　※player classの更新はしない(tableクラス　evaluateMove()で更新)
*/

/* prompt()の処理
    以下の2点
     1.bet
     2.playing(betした後の処理)
*/

class User extends Player {
  constructor(name: string, gameType: string) {
    super(name, gameType);
    this.action = "bet";
    this.type = "user";
  }

  /* return GameDecision class (action,bet)
     status=bet → return (action("bet"),bet)
     status=playing →　return (action,null)
     satatus = broke →　return (bust)
  */
  public prompt(userData: null | string | number): GameDecision {
    if (this.status == "bet")
      return new GameDecision("bet", userData as number);
    else if (this.status == "playing") {
      let promptAction: string = userData as string;
      let handScore = this.getHandScore();
      if (handScore > 21) promptAction = "bust";
      return new GameDecision(promptAction, this.bet);
    }
    return new GameDecision("broke", 0);
  }

  public switchStatus(gameType: string): void {
    if (gameType == "blackjack") {
      if (this.chip <= 0) this.status = User.STATUSFORBLACKJACK["broke"];
      else this.status = User.STATUSFORBLACKJACK[this.status];
    }
  }
}

export default User;
