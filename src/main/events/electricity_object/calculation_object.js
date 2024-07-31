const CustomError = require("../../utils/custom_error")
const { repositories } = require("../../repository")
const { creatCalculationFolder, updateCalculationFolder } = require("../../validation/calculation_object")
const { formatParamsList } = require("../../global/file-path")
const { tokenChecking } = require("../../utils/token_check")
const { adminRepository } = require("../../repository/admin")
const { currentFindArchive, energyarchive, energytotal } = require("../../global/variable")
const { electType } = require("../../global/enum")
const { sortvalueObjectsForSecondReport, sortvalueObjectsForFirstReport } = require("../../utils/sortvalue_bydate")
const { uniqueShortNames, obisFilter } = require("../../utils/unique_short-names")
const { attachParamsElectJoi } = require("../../validation/elect_object")

module.exports.getElectricityObjectsCalculation = () => {
   return async (event, args) => {
      try {
         const token = await tokenChecking(args)
         const findAdmin = await adminRepository().findById(token.admin)
         const objectDocuments = await repositories().calculationObjectRepository().findAll({ type: ["main", "child"], list: findAdmin.open_factory })

         return { status: 200, args: JSON.stringify(objectDocuments) }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getSingleElectricityObjectCalculation = () => {
   return async (event, args) => {
      try {
         const id = args.id

         const objectDocument = await repositories().calculationObjectRepository().findOne(id)
         if (!objectDocument) return { status: 200, error: null, data: {} }

         const formatParams = formatParamsList()
         let obisList = {}
         formatParams.indicators.map(e => uniqueShortNames(objectDocument.parameters).includes(e.param_short_name) ? obisList[e.param_short_name] = obisFilter(e.channel_full_id) : "").filter(e => e)

         const block = formatParams.indicators_block.filter(e => Object.values(obisList).includes(e.channel_full_id))
         objectDocument.block = block
         objectDocument.obis = obisList

         const location = await repositories().calculationObjectRepository().findLocation(id)
         return { status: 200, args: JSON.stringify(objectDocument), location }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getFirstTemplateReportFN = () => {
   return async (event, args) => {
      try {
         const { id, date1, date2, step } = args

         const find = await repositories().calculationObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Calculation not found")

         const pages = await repositories().calculationObjectRepository().firstTemplateReport(id, date1, date2, step)
         let reportData
         if (pages) reportData = await sortvalueObjectsForFirstReport(pages, find._id, step, date1, date2)

         const data = {
            data: pages ? reportData : {},
            location: await repositories().calculationObjectRepository().findLocation(id)
         }
         return { status: 200, result: pages ? JSON.stringify(data) : {} }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.getSecondTemplateReportFN = () => {
   return async (event, args) => {
      try {
         const { id, date1, date2 } = args

         const find = await repositories().calculationObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Calculation not found")

         const date1Format = new Date(date1)
         const dateFormat = new Date(date2)
         date1Format.setDate(date1Format.getDate() - 1)
         dateFormat.setDate(dateFormat.getDate() + 1)

         const pages = await repositories().calculationObjectRepository().secondTemplateReport(id, date1Format, dateFormat)
         let reportData = {}
         if (pages) reportData = await sortvalueObjectsForSecondReport(pages.parameters, find._id, date1, date2)

         const data = {
            data: reportData,
            location: await repositories().calculationObjectRepository().findLocation(id)
         }

         return { status: 200, error: null, data }
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

module.exports.getFourthTemplateReportFN = () => {
   return async (event, args) => {
      try {
         const { id, date1, date2 } = args

         const find = await repositories().calculationObjectRepository().findById(id)
         if (!find) throw new CustomError(404, "Calculation not found")

         const data = await repositories().calculationObjectRepository().fourthTemplateReport(id, date1, date2)
         const location = await repositories().calculationObjectRepository().findLocation(id)

         return { status: 200, error: null, data, location }
      } catch (err) {
         return new CustomError(err.status, err.message)
      }
   }
}

module.exports.insertPapkaCalculation = () => {
   return async (event, args) => {
      try {
         creatCalculationFolder(args)
         if (args.parent_object) {
            const parentObject = await repositories().calculationObjectRepository().findById(args.parent_object)
            if (!parentObject) return new CustomError(404, 'Parent Not Found')
            else if (args.type === 'main') return new CustomError(400, 'Main failed')
            else if (parentObject.type == 'meter') return new CustomError(400, 'Parent Bad Request')
         }

         const newObj = await repositories().calculationObjectRepository().insert(args)
         await repositories().logRepository().create(await tokenChecking(args), newObj._id, "Calculation create")

         return { status: 200, message: "Created" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.updateFolderCalculationFn = () => {
   return async (event, args) => {
      try {
         const { id } = args

         updateCalculationFolder(args)
         await repositories().calculationObjectRepository().update(id, { name: args.name })
         await repositories().logRepository().create(await tokenChecking(args), id, "Calculation update")
         return { status: 200, message: "Updated" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.calculationMain = () => {
   return async (event, args) => {
      try {
         const data = await repositories().calculationObjectRepository().onlyMain()

         return { status: 200, data: JSON.stringify(data) }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.attachParamsCalculationFN = () => {
   return async (event, args) => {
      try {
         attachParamsElectJoi(args)
         const { id, parameters } = args

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
                     if (!['meter', 'feeder'].includes(elect.type)) {
                        if (String(findParam.from) == String(fromId)) {
                           findParam.multiply = value.multiply
                           for (const shortName of energyarchive) {
                              if (findParam.params_feeder && findParam.params_feeder[shortName] && !value.params_feeder[shortName]) {
                                 delete findParam.params_feeder[shortName]
                              }
                              if (findParam.params_meter && findParam.params_meter[shortName] && !value.params_meter[shortName]) {
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

         await repositories().calculationObjectRepository().update(id, { parameters: param })
         return { status: 200, message: "Updated" }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

module.exports.deleteCalculation = () => {
   return async (event, args) => {
      try {
         const { id } = args
         await repositories().calculationObjectRepository().remove(id)

         await repositories().logRepository().create(await tokenChecking(args), id, "Calculation delete")
         return { status: 204 }
      } catch (error) {
         return new CustomError(error.status, error.message)
      }
   }
}

// getSecondTemplateReportFN, getThirdTemplateReportFN, getFourthTemplateReportFN,