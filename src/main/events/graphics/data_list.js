const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { totalCalculation } = require("../../utils/total")
const { sortvalueObjectsForListArchive, sortvalueObjectsForList } = require("../../utils/sortvalue_bydate")

module.exports.getGraphDataList = () => {
    return async (event, args) => {
        try {
            const id = args.id
            const query = { ...args.query, type: args.type, finishDate: args.query.date2, startDate: args.query.date1 }

            let result = new Map()
            if (query.type === "current") {
                const dataListDocuments = await repositories().electObjectRepository().findOneAndDataList(id, query)
                if (dataListDocuments && ['meter', 'feeder'].includes(dataListDocuments.type) && dataListDocuments.parameters[0]) {
                    result = await sortvalueObjectsForList(dataListDocuments.parameters[0], dataListDocuments._id, query)
                }

                const totalData = totalCalculation(Object.fromEntries(result))
                const data = {}

                let count = 0
                for (const key in totalData) {
                    if (count == 150) break
                    data[key] = totalData[key]
                    count++
                }

                return { status: 200, args: data }
            } else {
                const dataListDocuments = await repositories().electObjectRepository().findOneAndDataListArchive(id, query)
                if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

                const data = totalCalculation(Object.fromEntries(result))
                return { status: 200, error: null, args: data }
            }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getGraphDataListCalculation = () => {
    return async (event, args) => {
        try {
            const id = args.id
            const query = { ...args.query, type: args.type, finishDate: args.query.date2, startDate: args.query.date1 }
            let result = new Map()
            if (query.type === "current") {
                return { status: 400, error: 'current for meter or feeder only', data: null }
            } else {
                const dataListDocuments = await repositories().calculationObjectRepository().findOneAndDataListArchive(id, query)
                if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

                const data = totalCalculation(Object.fromEntries(result))
                return { status: 200, error: null, args: data }
            }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getGraphDataListFull = () => {
    return async (event, args) => {
        try {
            const { id } = args
            const query = args.params

            let result = new Map()

            const dataListDocuments = await repositories().electObjectRepository().findOneAndDataListArchiveFull(id, query)
            if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

            const data = totalCalculation(Object.fromEntries(result))
            const location = await repositories().electObjectRepository().findLocation(id)

            return { status: 200, error: null, args: data, location }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getGraphDataListCalculationFull = () => {
    return async (event, args) => {
        try {
            const { id } = args.id
            const query = { ...args, type: args.type, limit: args.limit, finishDate: args.date2, startDate: args.date1 }

            let result = new Map()
            const dataListDocuments = await repositories().calculationObjectRepository().findOneAndDataListArchiveFull(id, query)
            if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

            const data = totalCalculation(Object.fromEntries(result))
            const location = await repositories().calculationObjectRepository().findLocation(id)

            return { status: 200, error: null, args: data, location }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}
