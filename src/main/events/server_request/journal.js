const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")

module.exports.getLastInsertedJournal = () => {
    return async (event, args) => {
        try {
            const lastInsertedDocument = await repositories().journalRepository().findLastInserted({ meter_id: args.meter_id })
            
            return { status: 200, result: JSON.stringify(lastInsertedDocument) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getLastSuccessfullyInsertedJournal = () => {
    return async (event, args) => {
        try {
            const lastInsertedDocument = await repositories().journalRepository().findLastSuccesfullyInserted({ meter_id: args.meter_id })

            return { status: 200, result: JSON.stringify(lastInsertedDocument) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getJournalList = () => {
    return async (event, args) => {
        try {
            const documentsOfJournal = await repositories().journalRepository().findAll({ meter_id: args.meter_id })

            return { status: 200, result: JSON.stringify(documentsOfJournal) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}


