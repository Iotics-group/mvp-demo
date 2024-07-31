const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")

module.exports.getDashboardData = () => {
    return async (event, args) => {
        try {
            const id = args.id
            const query = { ...args.query }

            query.childObjects = query.childObjects && query.childObjects === false ? query.childObjects : true
            query.getParameters = query.getParameters && query.getParameters === false ? query.getParameters : true
            const data = await repositories().electObjectRepository().findOneAndDashboard(id, query)

            return { status: 200, args: data }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getDashboardDataCalculation = () => {
    return async (event, args) => {
        try {
            const id = args.id
            const query = { ...args.query }

            query.childObjects = query.childObjects && query.childObjects === false ? query.childObjects : true
            query.getParameters = query.getParameters && query.getParameters === false ? query.getParameters : true
            const data = await repositories().calculationObjectRepository().findOneAndDashboard(id, query)    

            return { status: 200, args: data }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getRealTime = () => {
    return async (event, args) => {
        try {
            const id = args.id

            const data = await repositories().electObjectRepository().realTime(id)
            return { status: 200, args: JSON.stringify(data) }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}

module.exports.getRealTimeReport = () => {
    return async (event, args) => {
        try {
            return { status: 400, error: 'current for meter or feeder only', data: null }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}
