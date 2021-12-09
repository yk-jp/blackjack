import Player from "./Player";
import GameDecision from "./GameDecision";

/* House class
    bet : -1
  house necessary variables functions
    status : {waiting,playing}
    } 
    playerAction : current player's action →　{waiting,stand,hit}  
*/

/* prompt()の処理
     1.waiting for players to bet
     2.playing　※house has to keep on drawing cards til total scores reach to 17.
*/

class House extends Player {
  public static STATUSFORBLACKJACK: { [key: string]: TPlayerStatus } = {
    waiting: "playing",
    playing: "waiting",
  };

  constructor(name: string, gameType: string) {
    super(name, gameType);
    this.status = "waiting";
    this.action = "waiting";
    this.type = "house";
    this.chip = -1;
    this.bet = -1;
    this.winAmount = -1;
  }

  /* return GameDecision class (action,bet)
     status=waiting -> return (action("waiting"))
     status=playing -> return (action)
  */

  public prompt(): GameDecision | void {
    if (this.status === "waiting") return new GameDecision("playing");
    else if (this.status  ==="playing") {
      let promptAction: null | string = null;
      let handScore = this.getHandScore();
      if (handScore < 17) promptAction = "hit";
      else if (handScore === 17)
        promptAction = this.judgeByRatio(7) ? "stand" : "hit";
      else if (18 <= handScore && handScore <= 20)
        promptAction = this.judgeByRatio(9) ? "stand" : "hit";
      else if (handScore === 21) promptAction = "stand";
      else if (handScore > 21) promptAction = "bust";

      return new GameDecision(promptAction as string);
    }
  }

  public switchStatus(gameType: string): void {
    if (gameType === "blackjack")
      this.status = House.STATUSFORBLACKJACK[this.status];
  }
}

export default House;
