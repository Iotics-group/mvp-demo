const Joi = require("joi")

const type_folder_enum = ["factory", "substation", "tire_section", "feeder"]
const type_meter_enum = ["meter"]

module.exports.createElectFolder = (args) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid(...type_folder_enum).required(),
        parent_object: Joi.string().optional()
    }).required();

    return schema.validate(args);
}

module.exports.getQuery = Joi.object().keys({
    type: Joi.string().required(),
}).required()

module.exports.createElectMeter = (args) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.valid(...type_meter_enum).required(),
        parent_object: Joi.string().required(),
        meter_id: Joi.string().required(),
        vt: Joi.object().keys({
            dividend: Joi.number().required(),
            divisor: Joi.number().required()
        }).required(),
        ct: Joi.object().keys({
            dividend: Joi.number().required(),
            divisor: Joi.number().required()
        }).required(),
        date: Joi.date().required(),
        multiply: Joi.array().items(Joi.number()).required(),
    }).required()

    return schema.validate(args);
}

module.exports.updateElectFolder = (args) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        id: Joi.string().required(),
    }).required()

    return schema.validate(args);
}

module.exports.updateElectMeter = (args) => {
    const schema = Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string(),
        vt: Joi.object().keys({
            dividend: Joi.number(),
            divisor: Joi.number()
        }),
        ct: Joi.object().keys({
            dividend: Joi.number(),
            divisor: Joi.number()
        }),
        date: Joi.date(),
        multiply: Joi.array().items(Joi.number()),
    }).required()

    return schema.validate(args);
}

module.exports.attachParamsElectJoi = (args) => {
    const schema = Joi.object().keys({
        id: Joi.string().required(),
        parameters: Joi.array().items(
            Joi.object().keys({
                meter: Joi.string().required(),
                from: Joi.string().required(),
                type: Joi.string().required(),
                multiply: Joi.array().items(Joi.number()).required(),
                params_meter: Joi.object(),
                params_feeder: Joi.object(),
                activate: Joi.array()
            }).required()
        ).required()
    }).required()

    return schema.validate(args);
}
