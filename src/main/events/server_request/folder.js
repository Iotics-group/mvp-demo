const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { adminRepository } = require("../../repository/admin")
const { tokenChecking } = require("../../utils/token_check")

module.exports.getFoldersList = () => {
    return async (event, args) => {
        try {
            const data = await tokenChecking(args)

            const user = await adminRepository().findById(data.admin)
            if (!user) return { status: 400, message: "Token invalid with id" }

            const folderDocuments = await repositories().folderObjectRepository().findAll(args.query, user.open_folders)
            return { status: 200, result: JSON.stringify(folderDocuments) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getSingleFolder = () => {
    return async (event, args) => {
        try {
            const id = args.id
            const folderDocument = await repositories().folderObjectRepository().findOne(id)
            if (!folderDocument) { return { status: 404, error: "Folder not found", data: null } }

            return { status: 200, result: JSON.stringify(folderDocument) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getParentFolder = () => {
    return async (event, args) => {
        try {
            const folderDocument = await repositories().folderObjectRepository().findParentList()

            return { status: 200, result: JSON.stringify(folderDocument) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.createFolder = () => {
    return async (event, args) => {
        try {
            const parameters = { name: args.name, folder_type: "folder", parent_id: args.parent_id ? args.parent_id : null }
            const newFolder = await repositories().folderObjectRepository().insert(parameters)

            await repositories().logRepository().create(await tokenChecking(args), newFolder._id, 'Folder create')
            return { status: 200, result: "Successful Created" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.updateFolder = () => {
    return async (event, args) => {
        try {
            const { name } = args
            const { id } = args

            const find = await repositories().folderObjectRepository().findById(id)
            if (!find) return { status: 404, result: "Folder Not Found" }

            await repositories().folderObjectRepository().updateOne(id, { name: name || find.name })
            await repositories().logRepository().create(await tokenChecking(args), id, 'Folder update')

            return { status: 200, result: "Successful Updated" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.folderStatus = () => {
    return async (event, args) => {
        try {
            const { id } = args
            const meters = []
            const succeed = []
            const failed = []
            const result = []

            const callback = async (id) => {
                const items = await repositories().folderObjectRepository().findWithParend(id)
                for (const item of items) {
                    if (item.folder_type == 'meter') meters.push(item)
                    else await callback(item._id)
                }
            }
            await callback(id)

            for (const value of meters) {
                if (value && value.lastJournalData) {
                    if (value.lastJournalData[0] &&
                        value.lastJournalData[0].current == 'succeed' &&
                        value.lastJournalData[0].current == 'succeed'
                    ) succeed.push(1)
                    else failed.push(1)

                    result.push(value.lastJournalData[0])
                }
            }
            const data = {
                meters: meters.length,
                succeed: succeed.length,
                failed: failed.length,
                result: result
            }

            return { status: 201, error: null, data: JSON.stringify(data) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}
