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

export const getUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    res.json(unit);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUnit = async (req, res) => {
  const { unitName, unitStatus, remarks } = req.body;

  try {
    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,  
      { unitName, unitStatus, remarks },
      { new: true }
    );
    res.json(updatedUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
