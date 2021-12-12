import Card from "./Card";
import Deck from "./Deck";
import User from "./User";
import AI from "./Ai";

import House from "./House";
import IPlayer from "../interfaces/IPlayer";
import ITable from "../interfaces/ITable";
import Table from "./Table";

// types
import type { TCard } from "../types/TCard";
import type { TPlayerStatus } from "../types/TPlayerStatus";
import type { TDeck } from "../types/TDeck";

export default class BuilderForBlackjack {
  constructor() {}

  // each build method
  public buildForCards(cards: TCard[]): Card[] {
    let newCards: Card[] = [];

    cards.forEach((card) => {
      newCards.push(this.buildForCardHelper(card));
    });
    return newCards;
  }

  public buildForDeck(deck: TDeck): Deck {
    const newDeck: Deck = new Deck(deck.gameType);
    const cards: Card[] = this.buildForCards(deck.cards);
    newDeck.setCards(cards);
    return newDeck;
  }

  public buildForPlayers(players: IPlayer[]): (User | AI | House)[] {
    let newPlayers: (User | AI | House)[] = [];
    players.forEach((player) => {
      newPlayers.push(this.buildForPlayerHelper(player));
    });
    return newPlayers;
  }

  public buildForTable(table: ITable): Table {
    let newTable: Table = new Table("blackjack", "init");

    newTable.setGameType(table.gameType);
    newTable.setBetDenominations(table.betDenominations);

    // deck
    let newDeck: Deck = this.buildForDeck(table.deck);
    newTable.setDeck(newDeck);

    // players
    let newPlayers: (User | AI | House)[] = this.buildForPlayers(table.players);
    newTable.setPlayers(newPlayers);

    // user
    let newUser: User = this.buildForPlayerHelper(table.user) as User;
    newTable.setUser(newUser);

    // house
    let newHouse: House = this.buildForPlayerHelper(table.house) as House;
    newTable.setHouse(newHouse);

    newTable.setPlayerNumber(Number(table.playerNumber));
    newTable.setGamePhase(table.gamePhase);

    newTable.setResultsLog(table.resultsLog);
    newTable.setTurnCounter(Number(table.turnCounter));

    return newTable;
  }

  // helper methods
  public buildForCardHelper(card: TCard): Card {
    return new Card(card.suit, card.rank);
  }

  public buildForPlayerHelper(player: IPlayer): User | AI | House {
    let newPlayer: User | AI | House;
    if (player.type === "ai") newPlayer = new AI(player.name, player.gameType);
    else if (player.type === "user")
      newPlayer = new User(player.name, player.gameType);
    else newPlayer = new House(player.name, player.gameType);

    // set hand
    const newCards: Card[] = this.buildForCards(player.hand);
    newPlayer.setHand(newCards);
    // set status
    newPlayer.setStatus(player.status as TPlayerStatus);
    // set action
    newPlayer.setAction(player.action);
    // set winAmount
    newPlayer.setWinAmount(player.winAmount);
    // set  bet
    newPlayer.setBet(player.bet);
    // set chip
    newPlayer.setChip(player.chip);
    return newPlayer;
  }
}
