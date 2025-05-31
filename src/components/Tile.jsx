// src/models/Tile.js
import mongoose from 'mongoose';

const tileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:   { type: String, required: true },
  title:  { type: String },
  content:{ type: String },
  bgImage:{ type: String },
  x:      { type: Number },
  y:      { type: Number },
  w:      { type: Number },
  h:      { type: Number },
}, { timestamps: true });

const Tile = mongoose.model('Tile', tileSchema);

export default Tile;
