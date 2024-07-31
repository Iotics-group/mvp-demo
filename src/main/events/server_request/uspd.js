const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")

module.exports.createUspdServer = () => {
    return async (event, args) => {
        try {
            const parameters = { name: args.name, connection_channel: args.connection_channel, number_uspd: args.number_uspd, port: args.port, ipAddress: args.ipAddress, timeDifference: args.timeDifference, login: args.login, password: args.password }
            const uspdDocument = await repositories().uspdObjectRepository().insert(parameters)
            let folderParameter = { name: uspdDocument.name, folder_type: "uspd", parent_id: args.parent_id, uspd: uspdDocument._id }
            await repositories().folderObjectRepository().insert(folderParameter)
            return { status: 200, result: "Successful added" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.updateUspdServer = () => {
    return async (event, args) => {
        try {
            const parameters = { name: args.name, port: args.port, ipAddress: args.ipAddress, timeDifference: args.timeDifference, login: args.login, password: args.password }
            const uspdDocument = await repositories().uspdObjectRepository().updateOne({ _id: id }, parameters)
            let folderParameter = { name: uspdDocument.name }
            await repositories().folderObjectRepository().updateOne({ uspd: id }, folderParameter)
            return { status: 200, result: "Successful updated" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}