const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { createElectFolder, createElectMeter, updateElectFolder, updateElectMeter, attachParamsElectJoi } = require("../../validation/elect_object")
const { formatParamsList } = require("../../global/file-path")
const { sortvalueObjectsForFirstReport, sortvalueObjectsForSecondReport } = require("../../utils/sortvalue_bydate")
const { tokenChecking } = require("../../utils/token_check")
const { adminRepository } = require("../../repository/admin")
const { energytotal, currentFindArchive, energyarchive } = require("../../global/variable")
const { electType } = require("../../global/enum")
const { uniqueShortNames, obisFilter } = require("../../utils/unique_short-names")

module.exports.getElectricityObjects = () => {
   return async (event, args) => {
      try {
         const token = await tokenChecking(args)
         const findAdmin = await adminRepository().findById(token.admin)
         if (!findAdmin) return { status: 404, message: "Admin not found" }

         const objectDocuments = await repositories().electObjectRepository().findAll({ type: "factory", list: findAdmin.open_factory })

         return { status: 200, args: JSON.stringify(objectDocuments) }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getSingleElectricityObject = () => {
   return async (event, args) => {
      try {
         const id = args.id

         const objectDocument = await repositories().electObjectRepository().findOne(id, args)
         if (!objectDocument) return { status: 200, error: null, data: {} }
         const formatParams = formatParamsList()

         let obisList = {}
         formatParams.indicators.map(e => uniqueShortNames(objectDocument.parameters, objectDocument.type).includes(e.param_short_name) ? obisList[e.param_short_name] = obisFilter(e.channel_full_id) : "").filter(e => e)

         const block = formatParams.indicators_block.filter(e => Object.values(obisList).includes(e.channel_full_id))
         objectDocument.params = uniqueShortNames(objectDocument.parameters, objectDocument.type)
         objectDocument.block = block
         objectDocument.obis = obisList

         const location = await repositories().electObjectRepository().findLocation(id)
         return { status: 200, args: JSON.stringify(objectDocument), location }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.factories = () => {
   return async (event, args) => {
      try {
         const data = await repositories().electObjectRepository().factory()

         return { status: 200, data: JSON.stringify(data) }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.getFirstTemplateFN = () => {
   return async (event, args) => {
      try {
         const { date1, date2, step, id } = args

         const find = await repositories().electObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Elect not found")

         const pages = await repositories().electObjectRepository().firstTemplateReport(id, date1, date2, step)
         let reportData = {}
         if (pages) reportData = await sortvalueObjectsForFirstReport(pages, find._id, step, date1, date2)

         const data = {
            data: reportData,
            location: await repositories().electObjectRepository().findLocation(id)
         }

         return { status: 200, result: pages ? JSON.stringify(data) : {} }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getSecondTemplateFN = () => {
   return async (event, args) => {
      try {
         const { id, date1, date2 } = args

         const find = await repositories().electObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Elect not found")

         const date1Format = new Date(date1)
         const dateFormat = new Date(date2)
         date1Format.setDate(date1Format.getDate() - 1)
         dateFormat.setDate(dateFormat.getDate() + 1)

         const pages = await repositories().electObjectRepository().secondTemplateReport(id, date1Format, dateFormat)
         let reportData = {}
         if (pages) reportData = await sortvalueObjectsForSecondReport(pages.parameters, find._id, date1, date2)

         const data = {
            data: reportData,
            location: await repositories().electObjectRepository().findLocation(id)
         }

         return { status: 200, error: null, data }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getThirdTemplateFN = () => {
   return async (event, args) => {
      try {
         const { id, date1, date2 } = args

         const find = await repositories().electObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Elect not found")
         if (["meter", 'feeder'].includes(find.type)) throw new CustomError(400, "achot for feeder and meter does not work")

         const data = await repositories().electObjectRepository().thirdTemplateReport(id, date1, date2)
         const location = await repositories().electObjectRepository().findLocation(id)

         return { status: 200, error: null, data, location }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getThirdTemplateReportFN = () => {
   return async (event, args) => {
      try {
         const { date1, date2, id } = args

         const find = await repositories().calculationObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Calculation not found")

         const data = await repositories().calculationObjectRepository().thirdTemplateReport(id, date1, date2)
         const location = await repositories().calculationObjectRepository().findLocation(id)

         return { status: 200, error: null, data, location }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getFourthTemplateFN = () => {
   return async (event, args) => {
      try {
         const { id, date1, date2 } = args

         const find = await repositories().electObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Elect not found")
         if (["meter", 'feeder'].includes(find.type)) throw new CustomError(400, "achot for feeder and meter does not work")

         const data = await repositories().electObjectRepository().fourthTemplateReport(id, date1, date2)
         const location = await repositories().electObjectRepository().findLocation(id)

         return { status: 200, error: null, data, location }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.listUseMeterElectFn = () => {
   return async (event, args) => {
      try {
         const data = await repositories().electObjectRepository().listUse()
         return { status: 200, data }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.insertPapka = () => {
   return async (event, args) => {
      try {
         createElectFolder(args)
         if (args.parent_object) {
            const parentObject = await repositories().electObjectRepository().findById(args.parent_object)
            if (!parentObject) return new CustomError(404, 'Parent Not Found')

            const obj = {
               substation: [0, 1],
               tire_section: [0, 1, 2],
               feeder: [0, 1, 2],
            }

            const index = electType.findIndex((e) => e === parentObject.type)
            if (!obj[args.type] || !obj[args.type].includes(index)) return new CustomError(400, 'Parent Bad Request')
         }

         const newObj = await repositories().electObjectRepository().insert(args)
         await repositories().logRepository().create(await tokenChecking(args), newObj._id, "Electricity create")
         return { status: 200, message: "Created" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.insertMeter = () => {
   return async (event, args) => {
      try {
         createElectMeter(args)
         const parentObject = await repositories().electObjectRepository().findById(args.parent_object)
         if (!parentObject || parentObject.type != "feeder")
            return new CustomError(404, 'Parent Not Found Or Parent type != feeder')
         if (await repositories().electObjectRepository().findParentMeter(args.parent_object))
            return new CustomError(400, 'Parent Feeder already use meter')
         if (await repositories().electObjectRepository().findMeter(args.meter_id))
            return new CustomError(400, 'Meter already use')

         const paramerts_list = await repositories().parameterRepository().findMeter({ meter: args.meter_id })
         const parametersFeeder = {}
         const parametersMeter = {}

         paramerts_list.map(e => {
            if (e.status == 'active' || e.parameter_type === 'archive') {
               parametersFeeder[e.param_short_name] = true
               parametersMeter[e.param_short_name] = true
            }
         })

         const newFeederParams = {
            meter: args.meter_id,
            params_meter: {},
            params_feeder: parametersFeeder,
            multiply: args.multiply
         }
         await repositories().electObjectRepository().insertParentParams(parentObject._id, newFeederParams)
         const newObj = {
            name: args.name,
            type: args.type,
            parent_object: args.parent_object,
            meter_id: args.meter_id,
            vt: args.vt,
            ct: args.ct,
            parameters: {
               meter: args.meter_id,
               params_meter: parametersMeter,
               params_feeder: {},
               multiply: [1]
            }
         }

         await repositories().feederRepository().insert({ date: args.date, multiply: args.multiply, feeder: parentObject._id, vt: args.vt, ct: args.ct })
         const newElect = await repositories().electObjectRepository().insert(newObj)
         await repositories().logRepository().create(await tokenChecking(args), newElect._id, "Electricity create")
         return { status: 201, message: 'Created' }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.updateFolderFn = () => {
   return async (event, args) => {
      try {
         updateElectFolder(args)
         const { id } = args
         await repositories().electObjectRepository().update(id, { name: args.name })

         await repositories().logRepository().create(await tokenChecking(args), id, "Electricity update")
         return { status: 200, message: "Updated" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.updateMeterFn = () => {
   return async (event, args) => {
      try {
         updateElectMeter(args)
         const { id } = args

         const findOne = await repositories().electObjectRepository().findById(id)
         if (!findOne || findOne.type != 'meter') return { status: 404, message: "Meter Not Found" }

         const obj = {
            name: args.name || findOne.name,
            vt: args.vt || findOne.vt,
            ct: args.ct || findOne.ct,
         }

         if (
            args.vt.dividend != findOne.vt.dividend ||
            args.vt.divisor != findOne.vt.divisor ||
            args.ct.dividend != findOne.ct.dividend ||
            args.ct.divisor != findOne.ct.divisor) {
            await repositories().feederRepository().updateFeeder(findOne.parent_object, findOne, args, findOne._id)
         }

         await repositories().electObjectRepository().insertParentParams(findOne.parent_object, findOne.parameters.map(e => ({ ...e._doc, multiply: args.multiply })))
         await repositories().electObjectRepository().update(id, obj)
         await repositories().logRepository().create(await tokenChecking(args), id, "Electricity update")
         return { status: 200, message: "Updated" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.attachParamsElectFN = () => {
   return async (event, args) => {
      try {
         attachParamsElectJoi(args)
         const { id, parameters } = args

         const find = await repositories().electObjectRepository().findById(id)
         if (!find) return { status: 404, error: null, data: "id Invalid" }
         if (find && (find.type === 'meter' || find.type === 'feeder')) return { status: 400, error: null, data: "Meter no attach" }

         const param = []
         for (const value of parameters) {
            for (const archive of energytotal) {
               if (value.params_meter && value.params_meter[archive] != undefined) value.params_meter[currentFindArchive[archive]] = value.params_meter[archive]
               if (value.params_feeder && value.params_feeder[archive] != undefined) value.params_feeder[currentFindArchive[archive]] = value.params_feeder[archive]
            }

            async function listUpdate(fromId) {
               const fromList = await repositories().electObjectRepository().findWithQuery({ "parameters.from": fromId })
               for (const elect of fromList) {
                  for (const findParam of elect.parameters) {
                     if (String(findParam.from) == String(fromId)) {
                        findParam.multiply = value.multiply
                        if (!['meter', 'feeder'].includes(elect.type)) {
                           for (const shortName of energyarchive) {
                              if (findParam.params_feeder && findParam.params_feeder[shortName] && (value.params_feeder && !value.params_feeder[shortName])) {
                                 delete findParam.params_feeder[shortName]
                              }
                              if (findParam.params_meter && findParam.params_meter[shortName] && (value.params_meter && !value.params_meter[shortName])) {
                                 delete findParam.params_meter[shortName]
                              }
                           }
                        }
                     }
                  }
                  if (electType.includes(elect.type)) {
                     await repositories().electObjectRepository().update(elect._id, { parameters: elect.parameters })
                  } else {
                     await repositories().calculationObjectRepository().update(elect._id, { parameters: elect.parameters })
                  }
                  await listUpdate(elect._id)
               }
            }
            await listUpdate(id)
            param.push(value)
         }

         await repositories().electObjectRepository().update(id, { parameters: param })
         return { status: 200, message: "Updated" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.deleteElect = () => {
   return async (event, args) => {
      try {
         const { id } = args
         await repositories().electObjectRepository().remove(id)

         await repositories().logRepository().create(await tokenChecking(args), id, "Electricity delete")
         return { status: 204 }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}