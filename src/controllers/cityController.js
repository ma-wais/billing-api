import City from "../models/City.js";

export const getCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCity = async (req, res) => {
  const { name } = req.body;

  const newCity = new City({
    name
  });

  try {
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    res.json(city);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const updateCity = async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(updatedCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteCity = async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    res.json(deletedCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}