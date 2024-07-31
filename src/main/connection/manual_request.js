// const repo = require("../repository")
// const { conntrollerCommands } = require("../server/configs/meter_controllers")
// const { previousForArchive, previousForBilling, checkParametersForCurrent, connectPort, serialPortOpen, serialPortOpenManualRequest } = require("./check_functions")
// const { findProtokol, checkDate, eventData } = require("./request_functions")
// const { requestOpenClose } = require("./request_string")
// const { responseCheckFn } = require("./utils_functions")

// const stopQueue = {}

module.exports.manualRequest = (find, meters, SOCKET, eventSocket, checkSocket, manualRequestSocket) => {
    return new Promise(async (resolve, reject) => {
        // try {
        //     console.log('Ruchnoy apros boshlandi______________________________________')
        //     const meter = await repo.repositories().meterRepository().findOne(find.id)
        //     const family_key = find.key

        //     manualRequestSocket('sent', 'connect')
        //     if (typeof checkSocket != "object") {
        //         checkSocket = await connectPort(meter, family_key, meters, SOCKET, checkSocket)
        //     }
        //     if (family_key.startsWith('COM')) {
        //         SOCKET = await serialPortOpenManualRequest(meter, SOCKET)
        //     }

        //     if (checkSocket === 'next' || typeof checkSocket == 'object') {
        //         await responseCheckFnForManualRequest(find.id, 'next', manualRequestSocket, 'connect', 'date')

        //         if (typeof checkSocket == 'object') SOCKET = checkSocket
        //         const previous = await repo.repositories().previousObjectRepository().findOne(meter._id)
        //         const parameters = await repo.repositories().parameterRepository().findEnergyParameter(meter._id)

        //         await findProtokol(meter, meters, SOCKET)
        //             .then(async (res) => { meters = res.meters; return res })
        //             .then(responseCheckFn)
        //             .then(async () => await conntrollerCommands(SOCKET, requestOpenClose(meter), "open"))
        //             .then(responseCheckFn)
        //             .then(async () => await checkDate(meter, SOCKET, true))
        //             .then((res) => responseCheckFnForManualRequest(find.id, res, manualRequestSocket, 'date', 'archive'))
        //             .then(async () => await previousForArchive(meter, previous, parameters, SOCKET, true))
        //             .then((res) => responseCheckFnForManualRequest(find.id, res, manualRequestSocket, 'archive', 'billing'))
        //             .then(async () => await previousForBilling(meter, previous, parameters, SOCKET, true))
        //             .then((res) => responseCheckFnForManualRequest(find.id, res, manualRequestSocket, 'billing', 'current'))
        //             .then(async () => await checkParametersForCurrent(meter, parameters, previous, SOCKET))
        //             .then((res) => responseCheckFnForManualRequest(find.id, res, manualRequestSocket, 'current', 'event'))
        //             .then(async () => await eventData(meter, previous.event, SOCKET, eventSocket, true))
        //             .then((res) => responseCheckFnForManualRequest(find.id, res, manualRequestSocket, 'event'))
        //             .then(async () => await conntrollerCommands(SOCKET, requestOpenClose(meter), "close"))

        //         manualRequestSocket('end', "full")
        //         resolve('next')
        //     } else {
        //         manualRequestSocket('failed', 'full')
        //         resolve('no connection')
        //     }
        // } catch (error) {
        //     console.log("Ruchnoy aprosda chiqayotgan hatolik ", error)
        //     manualRequestSocket('failed', 'full')
        //     resolve('next')
        // }
    })
}

module.exports.stopManualRequest = () => {
    return async (event, args) => {
        try {
            const id = args
            stopQueue[id] = true
            return { message: "Ok", error: false, data: "Ok" }
        } catch (error) {
            console.log(error)
            return { message: "Bad Request in catch", error: true, data: null }
        }
    }
}

// function responseCheckFnForManualRequest(id, response, manualRequestSocket, where, next) {
//     return new Promise((resolve, reject) => {
//         if (!stopQueue[id]) {
//             if (typeof response == 'object') {
//                 if (response.msg === "step_next" && response.send) {
//                     manualRequestSocket('next', where)
//                     if (next) manualRequestSocket('sent', next)
//                     resolve(response)
//                 } else if (response.msg === 'next' && response.send) {
//                     manualRequestSocket('succeed', where)
//                     if (next) manualRequestSocket('sent', next)
//                     resolve(response)
//                 } else {
//                     manualRequestSocket('failed', where)
//                     if (next) manualRequestSocket('sent', next)
//                     reject(response)
//                 }
//             } else {
//                 if (response === "step_next") {
//                     manualRequestSocket('next', where)
//                     if (next) manualRequestSocket('sent', next)
//                     resolve(response)
//                 } else if (response === 'next') {
//                     manualRequestSocket('succeed', where)
//                     if (next) manualRequestSocket('sent', next)
//                     resolve(response)
//                 } else {
//                     manualRequestSocket('failed', where)
//                     if (next) manualRequestSocket('sent', next)
//                     reject(response)
//                 }
//             }
//         } else {
//             delete stopQueue[id]
//             reject('O`chirish tugmasi bosildi')
//         }
//     })
// }