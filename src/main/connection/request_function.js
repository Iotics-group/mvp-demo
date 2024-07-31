const { energyarchive } = require("../global/variable")
const { currentModel } = require("../models")
const { repositories } = require("../repository")
const { currentTimeFormat } = require("./utils_functions")

module.exports.checkRequestTime = (meter, SOCKET, family_key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const date = new Date()
            let timeout

            if (meter.period_type == 'monthly') {
                if (meter.days_of_month.includes(date.getDate())) {
                    const hour = meter.hours_of_day.find(e => e.hour == date.getHours())

                    if (hour && hour.minutes.includes(date.getMinutes())) {
                        clearTimeout(timeout)
                        timeout = ''
                        return resolve('next')
                    }
                }
            } else {
                if (meter.days_of_week.includes(date.getDay())) {
                    const hour = meter.hours_of_day.find(e => e.hour == date.getHours())
                    if (hour && hour.minutes.includes(date.getMinutes())) {
                        clearTimeout(timeout)
                        timeout = ''
                        return resolve('next')
                    }
                }
            }

            resolve('Apros vaqti togri kelmadi')
        } catch (error) {
            console.log(error)
            setTimeout(() => resolve(error), 5000);
        }
    })
}

module.exports.connect = (meter) => {
    return new Promise(async (resolve, reject) => {
        let journalId
        try {
            console.log('Connecting...')
            const journalParameter = { meter: meter._id, request_type: "connect", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)
            let journalId = newJournalDocument._id

            await new Promise(resolve => {
                const timeout = setTimeout(() => {
                    clearTimeout(timeout)
                    resolve('ok')
                }, 10000);
            })

            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "connect", status: "succeed" })
            return resolve('ok')
        } catch (error) {
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "connect", status: "failed" })
            return reject(error)
        }
    })
}

module.exports.date = (meter) => {
    return new Promise(async (resolve, reject) => {
        let journalId
        try {
            console.log('date...')
            const journalParameter = { meter: meter._id, request_type: "date", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)
            journalId = newJournalDocument._id

            await new Promise(resolve => {
                const timeout = setTimeout(() => {
                    clearTimeout(timeout)
                    resolve('ok')
                }, 100);
            })

            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "date", status: "succeed" })
            return resolve('ok')
        } catch (error) {
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "date", status: "failed" })
            return reject(error)
        }
    })
}

module.exports.billing = (meter, previous, parameters) => {
    return new Promise(async (resolve, reject) => {
        let journalId
        try {
            console.log('billing...')
            const journalParameter = { meter: meter._id, request_type: "billing", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)
            journalId = newJournalDocument._id

            const prev = new Date(previous.billing)
            const dateCount = new Date() - prev
            const days = Math.ceil(dateCount / (1000 * 3600 * 24));

            if (days) {
                for (let i = 0; i < days; i++) {
                    prev.setDate(prev.getDate() + 1)
                    const obj = { meter_id: meter._id, date: prev }
                    if (parameters.includes('1.0.0')) {
                        obj.summa_A1 = 1200
                        obj.tarif1_A1 = 1200
                        obj.tarif2_A1 = 1200
                        obj.tarif3_A1 = 1200
                        obj.tarif4_A1 = 1200
                    }
                    if (parameters.includes('1.1.0')) {
                        obj.summa_A0 = 1200
                        obj.tarif1_A0 = 1200
                        obj.tarif2_A0 = 1200
                        obj.tarif3_A0 = 1200
                        obj.tarif4_A0 = 1200
                    }
                    if (parameters.includes('1.2.0')) {
                        obj.summa_R1 = 1200
                        obj.tarif1_R1 = 1200
                        obj.tarif2_R1 = 1200
                        obj.tarif3_R1 = 1200
                        obj.tarif4_R1 = 1200
                    }
                    if (parameters.includes('1.3.0')) {
                        obj.summa_R0 = 1200
                        obj.tarif1_R0 = 1200
                        obj.tarif2_R0 = 1200
                        obj.tarif3_R0 = 1200
                        obj.tarif4_R0 = 1200
                    }
                    await repositories().billingRepository().insert(obj)
                }
                await repositories().previousObjectRepository().update(meter._id, '', prev)
            }

            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "billing", status: "succeed" })
            return resolve('ok')
        } catch (error) {
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "billing", status: "failed" })
            return reject(error)
        }
    })
}

module.exports.archive = (meter, previous, parameters) => {
    return new Promise(async (resolve, reject) => {
        let journalId
        try {
            console.log('archive...')
            const journalParameter = { meter: meter._id, request_type: "archive", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)
            journalId = newJournalDocument._id

            const prev = new Date(previous.archive)
            const dateCount = new Date() - prev
            const minute30 = Math.floor(dateCount / (1000 * 60 * 30));

            const activePowerPlus = meter.parameters.find(e => e.param_short_name === energyarchive[0])
            const activePowerMinus = meter.parameters.find(e => e.param_short_name === energyarchive[1])
            const reactivePowerPlus = meter.parameters.find(e => e.param_short_name === energyarchive[2])
            const reactivePowerMinus = meter.parameters.find(e => e.param_short_name === energyarchive[3])

            if (minute30) {
                for (let i = 0; i < minute30; i++) {
                    prev.setDate(prev.getDate() + 1)

                    const arr = []
                    if (parameters.includes('1.0.0') && activePowerPlus) {
                        arr.push({
                            value: 1100,
                            date: prev,
                            parameter: activePowerPlus._id
                        })
                    }
                    if (parameters.includes('1.1.0') && activePowerMinus) {
                        arr.push({
                            value: 1100,
                            date: prev,
                            parameter: activePowerMinus._id
                        })
                    }
                    if (parameters.includes('1.2.0') && reactivePowerPlus) {
                        arr.push({
                            value: 1100,
                            date: prev,
                            parameter: reactivePowerPlus._id
                        })
                    }
                    if (parameters.includes('1.3.0') && reactivePowerMinus) {
                        arr.push({
                            value: 1100,
                            date: prev,
                            parameter: reactivePowerMinus._id
                        })
                    }
                    await repositories().archiveRepository().insert(arr)
                }
                await repositories().previousObjectRepository().update(meter._id, prev)
            }

            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "archive", status: "succeed" })
            return resolve('ok')
        } catch (error) {
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "archive", status: "failed" })
            return reject(error)
        }
    })
}

module.exports.current = (meter) => {
    return new Promise(async (resolve, reject) => {
        let journalId
        try {
            console.log('current...')
            const journalParameter = { meter: meter._id, request_type: "current", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)
            journalId = newJournalDocument._id

            const obj = meter.parameters.map(e => ({ [e.channel_full_id]: e.param_short_name }))
            const paramObject = obj.reduce((obj, item) => ({ ...obj, ...item }), {})
            const list = Object.keys(paramObject)

            const data = {
                "1.0.0": 1200
            }
            const date = new Date()
            const today = currentTimeFormat(new Date())
            const parameters = []

            const findToday = await currentModel.aggregate([
                { $match: { meter_id: meter._id } },
                { $match: { day: today } },
                { $project: { data: 0 } }
            ])
            const values = {}

            list.map(e => {
                const value = data[e]
                if (Number(value) || Number(value) == 0) parameters.push({ param_short_name: paramObject[e], value, date })
                values[paramObject[e]] = Number(value) || Number(value) == 0 ? value : "Empty"
            })

            if (findToday[0]) {
                await repositories().currentRepository().update(findToday[0]._id, { $push: { data: { date, values } } })
            } else {
                const newData = { meter_id: meter._id, day: today, data: [{ date, values }] }
                await repositories().currentRepository().insert(newData)
            }

            await repositories().lastCurrentRepository().updateSucceed({ meter_id: meter._id, parameters })
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "current", status: "succeed" })
            return resolve('ok')
        } catch (error) {
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "current", status: "failed" })
            return reject(error)
        }
    })
}

module.exports.event = (meter) => {
    return new Promise(async (resolve, reject) => {
        let journalId
        try {
            console.log('event...')
            const journalParameter = { meter: meter._id, request_type: "event", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)
            journalId = newJournalDocument._id

            for (const key of ['open_close', 'on_off', 'phase_volt']) {
                const data = [{ date: new Date(), status: "0004" }]

                for (const value of data) {
                    const date = value.date
                    await repositories().eventRepository().create({ event: value.status, date, meter_name: meter.name, meter_id: meter._id })
                }

                await repositories().previousObjectRepository().update(meter._id, '', '', { [key]: new Date() })
            }

            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "event", status: "succeed" })
            return resolve('ok')
        } catch (error) {
            await repositories().journalRepository().update({ _id: journalId, meter: meter._id, request_type: "event", status: "failed" })
            return reject(error)
        }
    })
}