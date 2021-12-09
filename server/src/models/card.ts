import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const cardSchema = new Schema({
  suit: { 
    type:String,
    require:true
  },
  rank: { 
    type:String,
    require:true
  }
}); 
