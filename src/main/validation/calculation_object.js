const Joi = require("joi")
const { calculationType } = require("../global/enum")

module.exports.creatCalculationFolder = (args) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.valid(...calculationType).required(),
        parent_object: Joi.string(),
    }).required()

    return schema.validate(args);
}

module.exports.updateCalculationFolder = (args) => {
    const schema = Joi.object().keys({
        name: Joi.string().required()
    }).required()
    
    return schema.validate(args);
}