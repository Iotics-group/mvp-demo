const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")

module.exports.getBillingListFn = () => {
    return async (event, args) => {
        try {
            const data = await repositories().billingRepository().findList(args.id, args.date1, args.date2)

            return { status: 200, error: null, data }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}

module.exports.getBillingListTableFn = () => {
    return async (event, args) => {
        try {
            const data = await repositories().billingRepository().list(args.id, args.query.date1, args.query.date2)
            return { status: 200, error: null, data: JSON.stringify(data) }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}
