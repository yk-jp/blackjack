import type { TGameType } from "./TGameType";
import type { TCard } from "./TCard";
export type TDeck = {
  gameType: TGameType;
  cards: TCard[];
};
