import IPlayer from "./IPlayer";
import type { TGameType } from "../types/TGameType";
import type { TDeck } from "../types/TDeck";

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
