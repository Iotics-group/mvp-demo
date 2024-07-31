const { currentModel } = require("../../models");
const { todayFormat } = require("../../connection/utils_functions");

module.exports.currentRepository = () => {
    return Object.freeze({
        insert,
        update,
        findFilter
    })

    async function insert(args) {
        try {
            await currentModel.create(args);
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function update(_id, args) {
        try {
            await currentModel.updateOne({ _id }, args);
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findFilter(meter_id, start, finish) {
        try {
            const startDate = todayFormat(new Date(start));
            const finishDate = todayFormat(new Date(finish));
            finishDate.setDate(finishDate.getDate()+1)

            return await currentModel.find({
                meter_id: meter_id,
                day: { $gte: startDate, $lte: finishDate } 
            });
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }
}
