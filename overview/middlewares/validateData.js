const Joi = require("joi");

const validateData = (req,res,next) =>{
    const schema = Joi.object({
        dengue: Joi.number().required(),
        aurti: Joi.number().required(),
        ad: Joi.number().required()
    });

    const validation = schema.validate(req.body, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({message: "Validation error", errors});
        return;
    }

    next();
};

module.exports = validateData;