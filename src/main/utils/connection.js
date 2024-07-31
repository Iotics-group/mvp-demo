const mongoose = require("mongoose");
const { DB_ADDRESS } = require("../module/config");
const { repositories } = require("../repository");
const meters = require('../../../data/meters')
const parameters = require('../../../data/parameters')
const previous = require('../../../data/previous')
const models = require('../models/index')

module.exports = async function x() {
    return new Promise(async (resolve, reject) => {
        if (mongoose.connection.readyState !== 1) {
            let timeout = ''
            await mongoose.connect(DB_ADDRESS).then(async () => {
                clearTimeout(timeout)
                console.log("DB is successfully connected");
                await repositories().lastJoinRepository().updateLastFailed()

                const obj = { 'meters': "meterModel", 'parameters': "parameterModel", 'previous': "previousModel" }

                for (const link in obj) {
                    if (!(await models[obj[link]].find()).length) {
                        if (link == 'meters') {
                            await models[obj[link]].insertMany(meters)
                        } else if (link == 'parameters') {
                            await models[obj[link]].insertMany(parameters)
                        } else if (link == 'previous') {
                            await models[obj[link]].insertMany(previous)
                        }
                    }
                }

                resolve('oki')
            }).catch((err) => {
                console.error("DB connection error:", err);
                timeout = setTimeout(async () => {
                    clearTimeout(timeout)
                    await x().then(() => resolve('oki'))
                }, 10000);
            });
        }
    })
};

// parameterModel,
// currentModel,
// archiveModel,
// adminModel,
// electObjectModel,
// eventModel,
// calculationObjectModel,
// folderModel,
// uspdModel,
// journalModel,
// billingModel,
// previousModel,
// authModel,
// feederModel,
// lastCurrentModel,
// lastJoinModel,
// logModel
