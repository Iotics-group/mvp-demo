const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { sortvalueObjectsForGraphObjectArchive, sortvalueObjectsForGraphObjectCurrent } = require("../../utils/sortvalue_bydate")
const { totalCalculation } = require("../../utils/total")

module.exports.getGraphsAndObjectDataArchive = () => {
    return async (event, args) => {
        try {
            const documentId = args.id
            const archiveQuery = args.query && args.query.archive ? { ...args.query.archive, startDate: args.query.archive.date1, finishDate: args.query.archive.date2 } : null
            let resultArchive = new Map()
            if (archiveQuery) {
                const graphDocumentsArchive = await repositories().electObjectRepository().findOneGraphAndObjectArchive(documentId, archiveQuery)
                if (graphDocumentsArchive) {
                    resultArchive = await sortvalueObjectsForGraphObjectArchive(graphDocumentsArchive.parameters, graphDocumentsArchive._id, archiveQuery)
                }
            }

            const data = totalCalculation(Object.fromEntries(resultArchive))
            const resultArchiveJSON = JSON.stringify(data)
            return { status: 200, args: { archiveResult: resultArchiveJSON } }

        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getGraphsAndObjectCurrent = () => {
    return async (event, args) => {
        try {
            const documentId = args.id
            const currentQuery = args.query && args.query.current ? { ...args.query.current, startDate: args.query.current.date1, finishDate: args.query.current.date2 } : null
            let resultCurrent = new Map()

            if (currentQuery) {
                const graphDocumentsCurrent = await repositories().electObjectRepository().findOneGraphAndObjectCurrent(documentId, currentQuery)
                if (graphDocumentsCurrent) resultCurrent = await sortvalueObjectsForGraphObjectCurrent(graphDocumentsCurrent.parameters, graphDocumentsCurrent._id)
            }

            const data = totalCalculation(Object.fromEntries(resultCurrent))
            const resultCurrentJSON = JSON.stringify(data)
            return { status: 200, args: { currentResult: resultCurrentJSON } }

        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getGraphsAndObjectDataCalculationArchive = () => {
    return async (event, args) => {
        try {
            const documentId = args.id
            const archiveQuery = args.query && args.query.archive ? { ...args.query.archive, startDate: args.query.archive.date1, finishDate: args.query.archive.date2 } : null
            let resultArchive = new Map()
            if (archiveQuery) {
                const graphDocumentsArchive = await repositories().calculationObjectRepository().findOneGraphAndObjectArchive(documentId, archiveQuery)
                if (graphDocumentsArchive) resultArchive = await sortvalueObjectsForGraphObjectArchive(graphDocumentsArchive.parameters, graphDocumentsArchive._id, archiveQuery)
            }

            const data = totalCalculation(Object.fromEntries(resultArchive))
            const resultArchiveJson = JSON.stringify(data)
            return { status: 200, args: { archiveResult: resultArchiveJson } }

        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getGraphsAndObjectDataCalculationCurrent = () => {
    return async (event, args) => {
        try {
            return { status: 400, args: 'current for meter or feeder only' }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}