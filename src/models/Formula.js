import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const FormulaSchema = new Schema({
    name: { type: String, required: true },
    composition: { type: String, required: true },
});

export default model('Formula', FormulaSchema)