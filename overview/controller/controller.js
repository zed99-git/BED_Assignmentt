const DRS = require("../models/models");

const getAllDRS = async (req, res) =>{
    try{
        const drs = await DRS.getAllDRS();
        res.json(drs);
    } catch(err){
        console.error("Error retrieving DRS",err);
        res.status(500).send("Error retrieving data");
    }
};

const getDRSByWeekly = async (req,res) =>{
    const drsWeekly = parseInt(req.params.weekly,10)
    try{
        const drs = await DRS.getDRSByWeekly(drsWeekly);
        if(!drs){
            return res.status(404).send("Data not found")
        }
        res.json(drs);
    }catch(error){
        console.error(error);
        res.status(500).send("Error retrieving data");
    }
};
const createDRS = async (req,res) =>{
    const newData = req.body;
    try{
        const createdData = await DRS.createDRS(newData);
        if(!createdData){
            return res.status(404).send("Data field is required");
        }
        res.status(201).json(createdData);
    }catch(error){
        console.error(error)
        res.status(500).send("Error creating Data");
    }
}
const updateDRS = async (req,res) =>{
    const dataWeekly = parseInt(req.params.weekly);
    const newDRSData = req.body;
    try{
        const updatedDRS = await DRS.updateDRS(dataWeekly,newDRSData)
        if(!updatedDRS){
            return res.status(404).send("Data not found")
        }
        res.json(updatedDRS)
    }catch(error){
        console.error(error)
        res.status(500).send("Error updating Data")
    }
}
const deleteDRS = async(req,res) =>{
    const dataWeekly = parseInt(req.params.weekly,10);
    try{
        const success = await DRS.deleteDRS(dataWeekly);
        if(!success){
            return res.status(404).send("Data not found");
        }
        return res.status(204).send("Delete successful")
    }catch(error){
        console.error(error);
        res.status(500).send("Error deleting Data")
    }
}

module.exports = {
    getAllDRS,
    getDRSByWeekly,
    createDRS,
    updateDRS,
    deleteDRS,
    searchData
};