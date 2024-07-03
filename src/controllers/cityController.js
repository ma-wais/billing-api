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