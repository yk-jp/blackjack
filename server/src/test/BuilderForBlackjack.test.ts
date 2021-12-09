// class
import Card from "../class/Card";
import Deck from "../class/Deck";
// builder
import BuilderForBlackjack from "../class/BuilderForBlackjack";
// mock object
import cardsObject from "./mock/cardsObject";
import deckObject from "./mock/deckObject";

describe("Test card class for converting json to class object.", () => {
  describe("convert json card object to card class by using helper method", () => {
    // instanciate BuilderForBlackjack
    const builderForBlacjack = new BuilderForBlackjack();

    test("function is working well after the conversion from json", () => {
      const cardObject: TCard = cardsObject[0];

      const convertedCard: Card =
        builderForBlacjack.buildForCardHelper(cardObject);
      expect(convertedCard.getRank()).toBe(cardObject.rank);
    });

    test("the number should be returned properly", () => {
      const cardObject: TCard = cardsObject[0];
      const convertedCard: Card =
        builderForBlacjack.buildForCardHelper(cardObject);
      expect(typeof convertedCard.getRankNumber()).toBe("number");
    });

    test("cards should be converted from json to class object each", () => {
      expect(builderForBlacjack.buildForCards(cardsObject)).toBeInstanceOf(
        Array
      );
      expect(builderForBlacjack.buildForCards(cardsObject)[0]).toBeInstanceOf(
        Card
      );
    });
  });
});

describe("Test Deck class for converting json to class object", () => {
  describe("convert json deck object to class object", () => {
    const builderForBlacjack = new BuilderForBlackjack();
    test("a function if it properly works", () => {
      const convertedDeck: Deck = builderForBlacjack.buildForDeck(deckObject);
      let originalLen: number = convertedDeck.getCards().length;
      convertedDeck.drawOne();
      let LenAfterDrawedOne: number = convertedDeck.getCards().length;
      expect(originalLen).not.toBe(LenAfterDrawedOne);
    });
  });
});

describe("Test Player class for converter between json and class object.", () => {
  test("", () => {});
});
