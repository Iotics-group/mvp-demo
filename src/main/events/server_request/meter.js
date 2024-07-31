const { SerialPort } = require('serialport')
const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { createMeterJoi, updateMeterJoi, createMeterCOMJoi, updateMeterCOMJoi } = require("../../validation/meter")
const { meterListReadFile } = require("../../global/meter-list")
const { paramsReadFile, formatParamsList } = require("../../global/file-path")
const { changeQueue } = require('../../connection/loop')
const { tokenChecking } = require('../../utils/token_check')

module.exports.createMeterFunction = () => {
    return async (event, args) => {
        try {
            createMeterJoi(args.meter_type)
            const checkFind = await repositories().meterRepository().findWithNumber(args.number_meter)
            if (checkFind) {
                await reActivateMeter(args, checkFind, true)
                return { status: 201, error: null, data: "Succesfull saved" }
            }
            if (args.meter_form === "meter") {
                let meter_param = {
                    name: args.name,
                    meter_type: args.meter_type,
                    number_meter: args.number_meter,
                    meter_form: args.meter_form,
                    connection_address: args.connection_address,
                    password: args.password,
                    connection_channel: args.connection_channel == "4" ? "3" : args.connection_channel,
                    ip_address: args.ip_address,
                    port: args.port,
                    waiting_time: args.waiting_time,
                    interval_time: args.interval_time,
                    pause_time: args.pause_time,
                    package_size: args.package_size,
                    com_port: args.com_port,
                    init_line: args.init_line,
                    phone_number: args.phone_number,
                    data_polling_length: args.data_polling_length,
                    data_refresh_length: args.data_refresh_length,
                    period_type: args.period_type,
                    days_of_month: args.days_of_month,
                    days_of_week: args.days_of_week,
                    hours_of_day: args.hours_of_day,
                    time_difference: args.time_difference
                }

                const newMeterDocument = await repositories().meterRepository().insert(meter_param)
                let folderParameter = {
                    name: newMeterDocument.name,
                    folder_type: "meter",
                    parent_id: args.id,
                    meter: newMeterDocument._id,
                }
                await repositories().folderObjectRepository().insert(folderParameter)
                await repositories().parameterRepository().insert(args.parameters, newMeterDocument)
                await repositories().previousObjectRepository().insert(newMeterDocument)
                await repositories().logRepository().create(await tokenChecking(args), newMeterDocument._id, "Meter create")

                changeQueue(newMeterDocument, 'C')
            } else if (args.meter_form === "uspd") {
                let meter_param = {
                    name: args.name,
                    meter_type: args.meter_type,
                    number_meter: args.number_meter,
                    meter_form: args.meter_form,
                    data_polling_length: args.data_polling_length,
                    data_refresh_length: args.data_refresh_length,
                    period_type: args.period_type,
                    days_of_month: args.days_of_month,
                    days_of_week: args.days_of_week,
                    hours_of_day: args.hours_of_day
                }
                const newMeterDocument = await repositories().meterRepository().insert(meter_param)
                let folderParameter = {
                    name: newMeterDocument.name,
                    folder_type: "meter",
                    parent_id: args.parent_id,
                    meter: newMeterDocument._id
                }
                await repositories().folderObjectRepository().insert(folderParameter)
                await repositories().parameterRepository().insert(args.parameters, newMeterDocument)
                await repositories().previousObjectRepository().insert(newMeterDocument)
            } else {
                console.log('ERROR')
                throw new CustomError(400, "undefined type")
            }

            return { status: 200, result: "Succesfull saved" }
        } catch (err) {
            console.log(err, 'sheydan halik chiqdi')
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.createComMeterFunction = () => {
    return async (event, args) => {
        try {
            createMeterCOMJoi(args.meter_type)
            const checkFind = await repositories().meterRepository().findWithNumber(args.number_meter)
            if (checkFind) {
                await reActivateMeter(args, checkFind, true)
                return { status: 201, error: null, data: "Succesfull saved" }
            }
            if (args.meter_form === "meter") {
                let meter_param = {
                    name: args.name,
                    meter_type: args.meter_type,
                    number_meter: args.number_meter,
                    meter_form: args.meter_form,
                    connection_address: args.connection_address,
                    password: args.password,
                    connection_channel: args.connection_channel == "4" ? "3" : args.connection_channel,
                    baud_rate: args.baud_rate,
                    comport: args.comport,
                    parity: args.parity,
                    stop_bit: args.stop_bit,
                    data_bit: args.data_bit,
                    modem_command: args.modem_command,
                    modem_phone: args.modem_phone,
                    waiting_time: args.waiting_time,
                    interval_time: args.interval_time,
                    pause_time: args.pause_time,
                    package_size: args.package_size,
                    com_port: args.com_port,
                    init_line: args.init_line,
                    phone_number: args.phone_number,
                    data_polling_length: args.data_polling_length,
                    data_refresh_length: args.data_refresh_length,
                    period_type: args.period_type,
                    days_of_month: args.days_of_month,
                    days_of_week: args.days_of_week,
                    hours_of_day: args.hours_of_day,
                    time_difference: args.time_difference
                }

                const newMeterDocument = await repositories().meterRepository().insert(meter_param)
                let folderParameter = {
                    name: newMeterDocument.name,
                    folder_type: "meter",
                    parent_id: args.id,
                    meter: newMeterDocument._id,
                }
                await repositories().folderObjectRepository().insert(folderParameter)
                await repositories().parameterRepository().insert(args.parameters, newMeterDocument)
                await repositories().previousObjectRepository().insert(newMeterDocument)
                await repositories().logRepository().create(await tokenChecking(args), newMeterDocument._id, "Meter create")

                changeQueue(newMeterDocument, 'C')
            } else if (args.meter_form === "uspd") {
                let meter_param = {
                    name: args.name,
                    meter_type: args.meter_type,
                    number_meter: args.number_meter,
                    meter_form: args.meter_form,
                    data_polling_length: args.data_polling_length,
                    data_refresh_length: args.data_refresh_length,
                    period_type: args.period_type,
                    days_of_month: args.days_of_month,
                    days_of_week: args.days_of_week,
                    hours_of_day: args.hours_of_day
                }
                const newMeterDocument = await repositories().meterRepository().insert(meter_param)
                let folderParameter = {
                    name: newMeterDocument.name,
                    folder_type: "meter",
                    parent_id: args.parent_id,
                    meter: newMeterDocument._id
                }
                await repositories().folderObjectRepository().insert(folderParameter)
                await repositories().parameterRepository().insert(args.parameters, newMeterDocument)
                await repositories().previousObjectRepository().insert(newMeterDocument)
            } else {
                console.log('ERROR')
                throw new CustomError(400, "undefined type")
            }

            return { status: 200, result: "Succesfull saved" }
        } catch (err) {
            console.log(err)
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getListOfMetersFunction = () => {
    return async (event, args) => {
        try {
            const meterList = await repositories().meterRepository().findAll({})
            return { status: 200, args: JSON.stringify(meterList) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getSingleMeterFunction = () => {
    return async (event, args) => {
        try {
            const meterDocument = await repositories().meterRepository().findOne(args.id)
            return { status: 200, args: JSON.stringify(meterDocument) }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.paramsList = () => {
    return async (event, args) => {
        try {
            const { type } = args

            const allParams = Object.values(paramsReadFile(type))
            const formatParams = formatParamsList()
            const data = { indicators: [], indicators_block: [] }

            data.indicators = formatParams.indicators.filter(e => allParams.includes(e.channel_full_id) || e.channel_full_id == '4.8')
            const map = data.indicators.map(e => e.channel_full_id.split('.').slice(0, 2).join('.'))
            data.indicators_block = formatParams.indicators_block.filter(e => map.includes(e.channel_full_id) || e.channel_full_id == '4.8')

            return { status: 200, error: null, data }
        } catch (err) {
            console.log(err)
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.meterList = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, data: meterListReadFile() }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.portListFN = () => {
    return async (event, args) => {
        try {
            const list = await SerialPort.list()
            return { status: 200, error: null, data: list }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.editMeterFunction = () => {
    return async (event, args) => {
        try {
            const data = args
            const id = args.id

            const find = await repositories().meterRepository().findOne(id)
            if (!find) return { status: 404, error: "Meter not found", data: null }


            if (data.meter_form === "meter") {
                updateMeterJoi(data.meter_type)
                await repositories().meterRepository().updateOne(id, data)
                await repositories().logRepository().create(await tokenChecking(args), id, 'Meter update')

                if (data.name) await repositories().folderObjectRepository().updateOne(id, { name: data.name })
                if (data.parameters) await repositories().parameterRepository().updateMany(id, data.meter_form, data.parameters)
            } else if (data.meter_form === "uspd") {
                await repositories().meterRepository().updateUSPD(id, data)
                if (data.name) await repositories().folderObjectRepository().updateOne(id, { name: data.name })
                if (data.parameters) await repositories().parameterRepository().updateMany(data.parameters)
            } else {
                throw new CustomError(400, "undefined type")
            }

            if (find.ip_address && (data.ip_address != find.ip_address || data.port != find.port)) {
                changeQueue(find, 'U_F')
            } else {
                changeQueue(find, 'U')
            }

            return { status: 200, result: "Succesfull saved" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.editComMeterFunction = () => {
    return async (event, args) => {
        try {
            const data = args
            const id = args.id

            const find = await repositories().meterRepository().findOne(id)
            if (!find) return { status: 404, error: "Meter not found", data: null }

            if (data.meter_form === "meter") {
                updateMeterCOMJoi(data.meter_type)
                await repositories().meterRepository().updateCOMOne(id, data)
                await repositories().logRepository().create(await tokenChecking(args), id, 'Meter update')

                if (data.name) await repositories().folderObjectRepository().updateOne(id, { name: data.name })
                if (data.parameters) await repositories().parameterRepository().updateMany(id, data.meter_form, data.parameters)
            } else if (data.meter_form === "uspd") {
                await repositories().meterRepository().updateUSPD(id, data)
                if (data.name) await repositories().folderObjectRepository().updateOne(id, { name: data.name })
                if (data.parameters) await repositories().parameterRepository().updateMany(data.parameters)
            } else {
                throw new CustomError(400, "undefined type")
            }

            if (find.comport && find.comport != data.comport) {
                changeQueue(find, 'U_F')
            } else {
                changeQueue(find, 'U')
            }

            return { status: 200, result: "Succesfull saved" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.removeMeter = () => {
    return async (event, args) => {
        try {
            const id = args.id

            if (await removeMeter(id)) return { status: 404, error: "Meter not found", data: null }
            await repositories().logRepository().create(await tokenChecking(args), id, 'Meter delete')
            return { status: 204 }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.removeFolder = () => {
    return async (event, args) => {
        try {
            const id = args.id

            const list = await repositories().folderObjectRepository().findIdList(id)
            if (!list.meters.length && !list.folders.length) return { status: 404, error: "Folder not found", data: null }

            for (const meter_id of list.meters) {
                await removeMeter(meter_id)
            }

            for (const folder_id of list.folders) {
                await repositories().folderObjectRepository().removeFolder(folder_id)
            }

            await repositories().logRepository().create(await tokenChecking(args), id, 'Folder delete')
            return { status: 200, result: "Succesfull saved" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

async function removeMeter(id) {
    const find = await repositories().meterRepository().findOne(id)
    if (!find) return 404

    await repositories().meterRepository().removeMeter(id)
    await repositories().folderObjectRepository().removeMeter(id)
    await repositories().electObjectRepository().removeWithMeter(id)

    changeQueue(find, 'D')
}

async function reActivateMeter(args, meter, tcp) {
    let folderParameter = {
        name: args.name,
        folder_type: "meter",
        parent_id: args.id,
        meter: meter._id,
    }
    await repositories().folderObjectRepository().insert(folderParameter)
    await repositories().parameterRepository().updateMany(meter._id, args.meter_form, args.parameters)
    await repositories().meterRepository().reActivateMeter(meter._id)
    if (tcp) await repositories().meterRepository().updateOne(meter._id, args)
    else await repositories().meterRepository().updateCOMOne(meter._id, args)

    changeQueue(meter, 'U_F')
}