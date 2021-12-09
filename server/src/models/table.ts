import mongoose from "mongoose";
import { deckSchema } from "./deck";
import { playerSchema } from "./player";

const Schema = mongoose.Schema;

const tableSchema = new Schema({
  gameType: {
    type: String,
  },
  betDenominations: {
    type: [Number],
  },
  deck: {
    type: deckSchema,
    require: true,
  },
  players: {
    type: [playerSchema],
    require: true,
  },
  user: {
    type: playerSchema,
    require: true,
  },
  house: {
    type: playerSchema,
    require: true,
  },
  playerNumber: {
    type: Number,
    require: true,
  },
  gamePhase: {
    type: String,
    require: true,
  },
  resultsLog: {
    type: [String],
    require: true,
  },
  turnCounter: {
    type: Number,
    require: true,
  }
});

const Table_Mongo = mongoose.model('Table',tableSchema);

export default Table_Mongo;