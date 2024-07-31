const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { sortvalueObjectsForVectorDiagram } = require("../../utils/sortvalue_bydate")

module.exports.getVectorDiagramData = () => {
    return async (event, args) => {
        try {
            const id = args.id
            const query = { ...args }

            const digramDocuments = await repositories().electObjectRepository().findOneVectorDiagram(id, query)
            let result = new Map()
            if (digramDocuments && ['meter', 'feeder'].includes(digramDocuments.type) && digramDocuments.parameters[0]) {
                result = await sortvalueObjectsForVectorDiagram(digramDocuments.parameters, query, digramDocuments._id, digramDocuments.multiply)
            }
    
            let stringfiedResult = JSON.stringify(Object.fromEntries(result))
            return { status: 200, args: stringfiedResult }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}
