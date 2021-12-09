import IPlayer from "./IPlayer";

export default interface ITable {
  gameType: TGameType;
  betDenominations: number[];
  deck: TDeck;
  players: IPlayer[];
  user: IPlayer;
  house: IPlayer;
  playerNumber: number;
  gamePhase: string;
  resultsLog: string[];
  turnCounter: number;
}
