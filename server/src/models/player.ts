import mongoose from "mongoose";
import { cardSchema } from "./card";
const Schema = mongoose.Schema;

export const playerSchema = new Schema({
  name: {
    type: String,
    require: true,
  },

  gameType: {
    type: String,
    require: true,
  },
  hand: {
    type: [cardSchema],
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  action: {
    type: String,
    require: true,
  },
  winAmount: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  bet: {
    type: Number,
    require: true,
  },
  chip: {
    type: Number,
    require: true,
  },
});
