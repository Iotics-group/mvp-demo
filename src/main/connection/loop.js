const repo = require("../repository");
const { manualRequest } = require("./manual_request");
const { connect, date, billing, archive, current, event, checkRequestTime } = require("./request_function");

// ======= Global Variable =======
const familyObject = {}
let manualRequestList = []
let queue = []
let step = []
let isWorking = false
let eventSocketSave
let manualRequestSocketSave

// ======= Start Loop =======
module.exports.startMiddleware = async (eventSocket = eventSocketSave, manualRequestSocket = manualRequestSocketSave) => {
    try {
        if (!isWorking) isWorking = true
        else return

        eventSocketSave = eventSocket
        manualRequestSocketSave = manualRequestSocket

        const meters = await repo.repositories().meterRepository().findAll({})

        meters.reduce((arr, e) => e.port ? Object.keys(familyObject).includes(key(e.ip_address, e.port)) ? (familyObject[key(e.ip_address, e.port)].push(e), arr) : (familyObject[key(e.ip_address, e.port)] = [e], arr.push(key(e.ip_address, e.port)), arr) : arr, []);
        meters.reduce((arr, e) => e.comport ? Object.keys(familyObject).includes(e.comport) ? (familyObject[e.comport].push(e), arr) : (familyObject[e.comport] = [e], arr.push(e.comport), arr) : arr, []);

        const values = Object.values(familyObject)
        const keys = Object.keys(familyObject)

        const callback = async (value, i) => {
            mainFor(value, keys[i], eventSocket, manualRequestSocket)
        }

        values.forEach(callback)
    } catch (error) {
        setTimeout(() => this.startMiddleware(eventSocket, manualRequestSocket), 10000);
    }
}

// ======= Main Loop =======
async function mainFor(meters, family_key, eventSocket, manualRequestSocket) {
    try {
        if (!meters.length) return
        meters = await checkQueueAndManual(family_key, { step: 0, meter: meters[0].name }, eventSocket, manualRequestSocket)

        for (const meter of meters) {
            try {
                const previous = await repo.repositories().previousObjectRepository().findOne(meter._id)
                const parameters = await repo.repositories().parameterRepository().findEnergyParameter(meter._id)

                await checkRequestTime(meter, family_key)
                    .then(async () => meters = await checkQueueAndManual(family_key, { step: 1, meter: meter.name }, eventSocket, manualRequestSocket))
                    .then(async () => await connect(meter))
                    .then(async () => meters = await checkQueueAndManual(family_key, { step: 1, meter: meter.name }, eventSocket, manualRequestSocket))
                    .then(async () => await date(meter))
                    .then(async () => meters = await checkQueueAndManual(family_key, { step: 2, meter: meter.name, date: previous.archive }, eventSocket, manualRequestSocket))
                    .then(async () => await billing(meter, previous, parameters))
                    .then(async () => meters = await checkQueueAndManual(family_key, { step: 3, meter: meter.name, date: previous.billing }, eventSocket, manualRequestSocket))
                    .then(async () => await archive(meter, previous, parameters))
                    .then(async () => meters = await checkQueueAndManual(family_key, { step: 4, meter: meter.name }, eventSocket, manualRequestSocket))
                    .then(async () => await current(meter))
                    .then(async () => meters = await checkQueueAndManual(family_key, { step: 5, meter: meter.name }, eventSocket, manualRequestSocket))
                    .then(async () => await event(meter, previous.event, eventSocket))

            } catch (error) {
                console.log(error, meter.meter_type, meter.connection_address, meter.port, meter.ip_address, 'Nimadur', meter._id)
            }
        }

        if (meters.length) setTimeout(() => mainFor(meters, family_key, eventSocket, manualRequestSocket), 5000);
    } catch (error) {
        console.log(error, 'songi catch')
        if (meters.length) setTimeout(async () => mainFor(meters, family_key, eventSocket, manualRequestSocket), 5000);
    }
}

// ======= Check Queue and Manual requests =======
async function checkQueueAndManual(family_key, stepData, eventSocket, manualRequestSocket) {
    try {
        // step[family_key] = stepData
        // const findManualRequest = manualRequestList.find(e => e.key === family_key)
        // const findQueue = queue.find(e => e.key === family_key)

        // if (findManualRequest) {
        //     console.log('Ruchnoy apros olishni boshladi')
        //     await manualRequest(findManualRequest, familyObject[findManualRequest.key], eventSocket, manualRequestSocket)
        //     manualRequestList = manualRequestList.filter(e => e.key != family_key)
        // }

        // if (findQueue) {
        //     queue = queue.filter(e => e.key != family_key)
        //     if (findQueue.status == 'C') {

        //         // == CREATE ==
        //         const newMeter = await repo.repositories().meterRepository().findOne(findQueue.id)
        //         familyObject[family_key].push(newMeter)
        //         return familyObject[family_key]
        //     } else if (findQueue.status == 'U') {

        //         // == UPDATE ==
        //         const updateMeter = await repo.repositories().meterRepository().findOne(findQueue.id)
        //         familyObject[family_key] = familyObject[family_key].map(e => String(e._id) == String(updateMeter._id) ? updateMeter : e)
        //         return familyObject[family_key]
        //     } else if (findQueue.status == 'D') {

        //         // == DELETE ==
        //         familyObject[family_key] = familyObject[family_key].filter(e => String(e._id) != String(findQueue.id))
        //         return familyObject[family_key]
        //     }
        // }

        return familyObject[family_key]
    } catch (error) {
        console.log(error)
    }
}

// ======= Manual Request start Function =======
module.exports.manualRequestFn = () => {
    return async (event, args) => {
        try {
            // const meter = await repo.repositories().meterRepository().findOne(args.id)
            // if (meter) {
            //     const family_key = meter.port ? key(meter.ip_address, meter.port) : meter.comport
            //     const obj = {
            //         id: String(meter._id),
            //         key: family_key
            //     }
            //     const date = new Date()

            //     if (meter.period_type == 'monthly') {
            //         if (meter.days_of_month.includes(date.getDate())) {
            //             const hour = meter.hours_of_day.find(e => e.hour == date.getHours())

            //             if (hour && hour.minutes.includes(date.getMinutes())) {
            //                 return { message: "Meter date in period time! Please wait and try again later", error: true, data: null }
            //             }
            //         }
            //     } else {
            //         if (meter.days_of_week.includes(date.getDay())) {
            //             const hour = meter.hours_of_day.find(e => e.hour == date.getHours())
            //             if (hour && hour.minutes.includes(date.getMinutes())) {
            //                 return { message: "Meter date in period time! Please wait and try again later", error: true, data: null }
            //             }
            //         }
            //     }
            //     console.log('Ruchnoy aprosga tushdi')
            //     manualRequestList.push(obj)

            //     return { meter_name: step[family_key].meter, step: step[family_key].step + 1, time: step[family_key].date }
            // } else {
            //     return { message: "Meter Not Found", error: true, data: null }
            // }
        } catch (error) {
            return { message: "Bad Request in catch", error: true, data: null }
        }
    }
}

// ======= Queue change with element (CUD) =======
module.exports.changeQueue = async (meter, status) => {
    try {
        // if (status == 'C') {
        //     console.log('Qo`shilish uchun Navbatga qo`shildi')

        //     const family_key = meter.port ? key(meter.ip_address, meter.port) : meter.comport
        //     if (familyObject[family_key]) {
        //         queue.push({ key: family_key, status, id: meter._id })
        //     } else {
        //         const newMeter = await repo.repositories().meterRepository().findOne(meter._id)

        //         familyObject[family_key] = [newMeter]
        //         mainFor([newMeter], family_key, eventSocketSave, manualRequestSocketSave)
        //     }
        // } else if (status == "U") {
        //     console.log('O`zgarish uchun Navbatga qo`shildi')

        //     const family_key = meter.port ? key(meter.ip_address, meter.port) : meter.comport
        //     if (familyObject[family_key]) {
        //         queue.push({ key: family_key, status, id: meter._id })
        //     }
        // } else if (status == "U_F") {
        //     console.log('FAMILY O`zgarish uchun Navbatga qo`shildi')

        //     const family_key = meter.port ? key(meter.ip_address, meter.port) : meter.comport
        //     if (familyObject[family_key]) {
        //         queue.push({ key: family_key, status: "D", id: meter._id })
        //     }

        //     const updateMeter = await repo.repositories().meterRepository().findOne(meter._id)
        //     const new_family_key = updateMeter.port ? key(updateMeter.ip_address, updateMeter.port) : updateMeter.comport

        //     if (familyObject[new_family_key]) {
        //         queue.push({ key: new_family_key, status: "C", id: updateMeter._id })
        //     } else {
        //         familyObject[new_family_key] = [updateMeter]
        //         mainFor([updateMeter], new_family_key, eventSocketSave, manualRequestSocketSave)
        //     }
        // } else if (status == "D") {
        //     console.log('O`chish uchun Navbatga qo`shildi')

        //     const family_key = meter.port ? key(meter.ip_address, meter.port) : meter.comport
        //     if (familyObject[family_key]) {
        //         queue.push({ key: family_key, status, id: meter._id })
        //     }
        // }
    } catch (error) {
        console.log(error)
    }
}

function key (a, b) {
    if (b) return `${a},${b}`
}