import Unit from '../models/Unit.js';

export const getUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUnit = async (req, res) => {
  const { unitName, unitStatus, remarks } = req.body;

  const newUnit = new Unit({
    unitName,
    unitStatus,
    remarks
  });

  try {
    const savedUnit = await newUnit.save();
    res.status(201).json(savedUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
