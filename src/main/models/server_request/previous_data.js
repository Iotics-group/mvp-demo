const mongoose = require("mongoose")

const previousSchema = new mongoose.Schema({
    meter_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    billing: { type: Date, required: true },
    archive: { type: Date, required: true },
    event: { 
        open_close: Date, 
        on_off: Date,
        phase_current: Date,
        phase_volt: Date
    },
    archiveTime: Number
})

module.exports.previousModel = mongoose.model("previous", previousSchema)
