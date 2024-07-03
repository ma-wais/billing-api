import Formula from "../models/Formula.js";

export const getFormulas = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};
    
        if (name) {
            query = { name: new RegExp(name, 'i') };
        }

        const formulas = await Formula.find(query);
        res.status(200).json(formulas);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createFormula = async (req, res) => {
    const { name, composition } = req.body;
    const newFormula = new Formula({
        name,
        composition
    });
    try {
        await newFormula.save();
        res.status(201).json(newFormula);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}