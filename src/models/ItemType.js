import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ItemTypeSchema = new Schema({
  itemTypeName: { type: String, required: true },
  itemTypeShortName: { type: String, required: true },
  itemTypeActive: { type: String, enum: ['active', 'inactive']},
  itemTypeRemarks: { type: String }
});

export default model('ItemType', ItemTypeSchema);
