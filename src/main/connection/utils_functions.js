const { portErrors } = require("../models/server_request/port_errors");
const repo = require("../repository");

module.exports.timeFormat = function (date, resendTime = 30) {
    const roundedDate = new Date(date);
    roundedDate.setMinutes(roundedDate.getMinutes() - roundedDate.getMinutes() % Number(resendTime));
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    return roundedDate;
}

module.exports.dateFormat9 = function (date1) {
    const date2 = new Date(date1)
    date2.setDate(date1.getDate() + 9)
    return date2
}

module.exports.todayFormat = function (date1) {
    const date2 = new Date(date1)
    date2.setHours(0, 0, 0, 0)
    return date2
}

module.exports.currentTimeFormat = function (date1) {
    const date2 = new Date(date1)
    date2.setMinutes(0)
    date2.setSeconds(0)
    date2.setMilliseconds(0)
    date2.setHours(date2.getHours() - date2.getHours() % 3)
    return date2
}

module.exports.errorHandle = function (data, journalId) {
    return new Promise(async (resolve, reject) => {
        if (data.error && data.message) {
            console.log(data)
            await repo.repositories().journalRepository().updateBody({ _id: journalId, message: data.message, body: data.body })
            return reject(data)
        }
        resolve('ok')
    })
}

module.exports.listenerError = (port) => {
    return new Promise((resolve, reject) => {
        port.removeAllListeners('error')
        port.on('error', async (err) => {
            await portErrors.create({ message: err.message })
            port.removeAllListeners('error')

            console.log(err.message)
            if (err.message === "read ECONNRESET") {
                console.log('if')
                return resolve('remove')
            } else {
                console.log('else')
                return resolve('')
            }
        })
    })
}

module.exports.dateFormatArchive = function (date) {
    const [day, month, year, hours, minutes] = date.split(/[^\d]+/);
    return new Date(`20${year}`, month - 1, day, hours, minutes)
}

module.exports.key = function (a, b) {
    if (b) return `${a},${b}`
}

module.exports.responseCheckFn = res => {
    return new Promise((resolve, reject) => {
        if (typeof res === 'object') {
            if (res.msg === 'next' && res.send) resolve(res)
            else reject(res)
        } else {
            if (res === 'next') resolve(res)
            else reject(res)
        }
    })
}

module.exports.eventDateFormat = (dataValue, startDate) => {
    const year = dataValue.date.split(' ')[0].split('.').reverse()
    const time = dataValue.date.split(' ')[1]
    year[0] = "" + "20" + year[0]

    const date = new Date(year.concat(time))
    if (startDate - date < 0) return { date: new Date(year.concat(time)), status: dataValue.status }
    return
}
