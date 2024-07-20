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

export const updateFormula = async (req, res) => {
    const { name, composition } = req.body;
    const updatedFields = {
        name,
        composition
    };

    try {
        const updatedFormula = await Formula.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        res.status(200).json(updatedFormula);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getFormula = async (req, res) => {
    try {
        const formula = await Formula.findById(req.params.id);
        res.json(formula);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}