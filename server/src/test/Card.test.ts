import Card from "../models/Card";

describe("rankNumber", () => {
  describe("Convert rank to proper number", () => {
    it("should return 10", () => {
      const faceCard = new Card("H", "Q");
      expect(faceCard.getRankNumber()).toBe(10);
    });

    it("should return 11", () => {
      let aceCard = new Card("H", "A");
      expect(aceCard.getRankNumber()).toBe(11);
    });

    it("should return number same as the rank", () => {
      let cardRank2 = new Card("H", "2");
      let cardRank10 = new Card("H", "10");

      expect(cardRank2.getRankNumber()).toBe(parseInt(cardRank2.getRank()));
      expect(cardRank10.getRankNumber()).toBe(parseInt(cardRank10.getRank()));
    });
  });
});
