import Table from "../models/Table";

test("haveTurn() is functioning well with no problems like js version",() => {
  let table = new Table("blackjack", "user");

  while (table.getGamePhase() !== "roundOver") {
    table.haveTurn();
  }

  console.log(table.getResultsLog());
});
