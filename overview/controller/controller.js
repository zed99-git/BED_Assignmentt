const DRS = require("../models/models");

const getAllDRS = async (req, res) =>{
    try{
        const drs = await DRS.getAllDRS();
        res.json(drs);
    } catch(error){
        console.error(error);
        res.status(500).send("Error retrieving data");
    }
};

const getDRSByWeekly = async (req,res) =>{
    const drsWeekly = parseInt(req.params.weekly)
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

module.exports = {
    getAllDRS,
    getDRSByWeekly,
};