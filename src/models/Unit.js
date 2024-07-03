import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UnitSchema = new Schema({
  unitName: { type: String, required: true },
  unitStatus: { type: String, required: true },
  remarks: { type: String }
});

export default model('Unit', UnitSchema);
