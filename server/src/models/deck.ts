import mongoose from "mongoose";
import { cardSchema } from "./card";

const Schema = mongoose.Schema;

export const deckSchema = new Schema({
  gameType: {
    type: String,
    require: true,
  },
  cards: {
    type: [cardSchema],
    require: true,
  },
});
