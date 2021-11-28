class GameDecision {
  /*
     String action : bet, hit、stand, double, surrender
     Number bet : bets  if action is not a 'bet' and player is a house, bet is set as -1 (to handle error)
  */
  private action: string;
  private bet: number;

  constructor(action: string, bet: number = -1) {
    this.action = action;
    this.bet = bet;
  }

  // getter
  public getAction(): string {
    return this.action;
  }
  public getBet(): number {
    return this.bet;
  }
}

export default GameDecision;
