const CustomError = require("../../utils/custom_error")
const { paramsIndex3ForClient } = require("../../global/file-path")
const { eventRepository } = require("../../repository/server_request/event")

module.exports.getTypeEventList = () => {
    return async (event, args) => {
        try {
            const { type } = args

            return { status: 200, error: null, data: Object.keys(paramsIndex3ForClient(type)) }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}

module.exports.getLast20 = () => {
    return async (event, args) => {
        try {
            const { id } = args
            const data = await eventRepository().findLast20(id)

            return { status: 200, error: null, data: JSON.stringify(data) }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}

module.exports.getEvents = () => {
    return async (event, args) => {
        try {
            const { id } = args
            const { date1, date2, filter, limit } = args.query
            const pageLimit = limit || 150
            const eventList = JSON.parse(filter)

            const findCriteria = {
                meter_id: id,
                date: {
                    $gte: new Date(date1),
                    $lt: new Date(date2)
                }
            };

            if (eventList.length > 0) {
                findCriteria.event = { $in: eventList };
            }

            const baza = (await eventRepository().find(findCriteria, pageLimit)).reverse().sort((a, b) => b.date - a.date);

            const arr = {}
            baza.forEach(e => arr[e.date + e.event] ? '' : arr[e.date + e.event] = e._doc)

            const data = Object.values(arr)
            return { status: 200, error: null, data: JSON.stringify(data) }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}

module.exports.getListForReport = () => {
    return async (event, args) => {
        try {
            const { id } = args
            const { date1, date2, filter } = args.query
            const eventList = JSON.parse(filter)

            const findCriteria = {
                meter_id: id,
                date: {
                    $gte: new Date(date1),
                    $lt: new Date(date2)
                }
            };

            if (eventList.length > 0) {
                findCriteria.event = { $in: eventList };
            }
            const data = (await eventRepository().findList(findCriteria)).map(e => e._doc).reverse().sort((a, b) => b.date - a.date);

            return { status: 200, error: null, data }
        } catch (error) {
            return new CustomError(error.status, error.message)
        }
    }
}