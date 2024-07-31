const CustomError = require("../utils/custom_error")
const { authorization } = require("./login")
const { printPage } = require("./printPage")
const { printPDF } = require("./printPDF")
const { addAdmin, print, updateAdmin, deleteAdmin, getLastSuccessfullJournal, getJournalDocuments, getLastJournal, getSingleRequestFolder, insertServerRequestUspd, editServerRequesUspd, getServerRequestFolders, insertServerRequestFolders, loginReq, printPDFFile, getDashboardEvent, getElectricityObjectsEventReport, getSingleObjectEventReport, getGraphsAndObjectReportCurrent, getGraphsAndObjectReportArchive, getGraphListEventReport, getDashboardEventReport, getGraphsAndObjectEventCurrent, getGraphsAndObjectEventArchive, getGraphListEvent, getVectorDiagram, getElectricityObjectsEvent, getSingleObjectEvent, createMeter, getSingleMeter, getMeterList, activeAdmin, getBillingList, createElectFolder, createElectMeter, deleteElectObject, createCalculationFolder, deleteCalculationObject, listUseMeterElect, updateElectFolder, updateElectMeter, updateCalculationFolder, attachParamsElect, attachParamsCalculation, getAdminsListStatus, createComMeter, updateComMeter, parametersList, metersList, realTimeReport, portList, realTime, getFolderStatus, getElectFactories, getReportOnlyMain, getBillingListTable, getFirstTemplate, getFirstTemplateReport, check_port, getEventTypes, getEventList, getEventLast, getEventReport, getFolderParent, updateServerRequestFolders, getlicenseData, getGraphListEventFull, getGraphListEventReportFull, getSecondTemplateReport, getThirdTemplateReport, getFourthTemplateReport, startManualRequest, updateMeter, deleteMeter, deleteFolder, stopManualRequestEvent, getUUIDLicenseData, newLicenseEvent, getSecondTemplate, getThirdTemplate, getFourthTemplate } = require("../../universal/eventNames")
const { addAdminFn, updateAdminFn, deleteAdminFn, activeAdminFn, getAdminsListActiveFn } = require("./admin")
const { createMeterFunction, getListOfMetersFunction, getSingleMeterFunction, paramsList, meterList, createComMeterFunction, editComMeterFunction, portListFN, editMeterFunction, removeFolder, removeMeter } = require("./server_request/meter")
const { getElectricityObjects, getSingleElectricityObject, insertPapka, insertMeter, deleteElect, listUseMeterElectFn, updateFolderFn, updateMeterFn, attachParamsElectFN, factories, getFirstTemplateFN, getSecondTemplateFN, getThirdTemplateFN, getFourthTemplateFN } = require("./electricity_object/electricity_object")
const { getVectorDiagramData } = require("./graphics/vector_diagram")
const { getGraphDataList, getGraphDataListCalculation, getGraphDataListFull, getGraphDataListCalculationFull } = require("./graphics/data_list")
const { getGraphsAndObjectDataArchive, getGraphsAndObjectCurrent, getGraphsAndObjectDataCalculationArchive, getGraphsAndObjectDataCalculationCurrent } = require("./graphics/graphs_object_data")
const { getDashboardData, getDashboardDataCalculation, getRealTime, getRealTimeReport } = require("./graphics/dashboard")
const { getElectricityObjectsCalculation, getSingleElectricityObjectCalculation, insertPapkaCalculation, deleteCalculation, updateFolderCalculationFn, attachParamsCalculationFN, calculationMain, getFirstTemplateReportFN, getSecondTemplateReportFN, getFourthTemplateReportFN, getThirdTemplateReportFN } = require("./electricity_object/calculation_object")
const { getFoldersList, getSingleFolder, folderStatus, getParentFolder, createFolder, updateFolder } = require("./server_request/folder")
const { createUspdServer, updateUspdServer } = require("./server_request/uspd")
const { getLastInsertedJournal, getJournalList, getLastSuccessfullyInsertedJournal } = require("./server_request/journal")
const { getBillingListFn, getBillingListTableFn } = require("./server_request/billing")
const { checkPortFn } = require("./server_request/check_port")
const { getTypeEventList, getEvents, getListForReport, getLast20 } = require("./server_request/event")
const { getDesktopData, getLicenseData, newLicense } = require("./server_request/license")
const { manualRequestFn } = require("../connection/loop")
const { stopManualRequest } = require("../connection/manual_request")

module.exports.eventController = async (ipcMain) => {
    try {
        // Login
        ipcMain.handle(loginReq, authorization())

        // Admin
        ipcMain.handle(addAdmin, addAdminFn())
        ipcMain.handle(getAdminsListStatus, getAdminsListActiveFn())
        ipcMain.handle(updateAdmin, updateAdminFn())
        ipcMain.handle(deleteAdmin, deleteAdminFn())
        ipcMain.handle(activeAdmin, activeAdminFn())

        // Print
        ipcMain.handle(print, printPage())
        ipcMain.handle(printPDFFile, printPDF())

        // Meter
        ipcMain.handle(getMeterList, getListOfMetersFunction())
        ipcMain.handle(getSingleMeter, getSingleMeterFunction())
        ipcMain.handle(createMeter, createMeterFunction())
        ipcMain.handle(createComMeter, createComMeterFunction())
        ipcMain.handle(updateMeter, editMeterFunction())
        ipcMain.handle(updateComMeter, editComMeterFunction())
        ipcMain.handle(parametersList, paramsList())
        ipcMain.handle(metersList, meterList())
        ipcMain.handle(portList, portListFN())
        ipcMain.handle(deleteMeter, removeMeter())
        ipcMain.handle(deleteFolder, removeFolder())

        // Graph
        ipcMain.handle(getGraphListEvent, getGraphDataList())
        ipcMain.handle(getGraphListEventFull, getGraphDataListFull())
        ipcMain.handle(getVectorDiagram, getVectorDiagramData())
        ipcMain.handle(getGraphsAndObjectEventCurrent, getGraphsAndObjectCurrent())
        ipcMain.handle(getDashboardEvent, getDashboardData())
        ipcMain.handle(getGraphsAndObjectEventArchive, getGraphsAndObjectDataArchive())

        // Folder | USPD
        ipcMain.handle(getServerRequestFolders, getFoldersList())
        ipcMain.handle(getSingleRequestFolder, getSingleFolder())
        ipcMain.handle(getFolderStatus, folderStatus())
        ipcMain.handle(getFolderParent, getParentFolder())
        ipcMain.handle(insertServerRequestFolders, createFolder())
        ipcMain.handle(updateServerRequestFolders, updateFolder())
        ipcMain.handle(insertServerRequestUspd, createUspdServer())
        ipcMain.handle(editServerRequesUspd, updateUspdServer())

        // Event
        ipcMain.handle(getEventTypes, getTypeEventList())
        ipcMain.handle(getEventList, getEvents())
        ipcMain.handle(getEventReport, getListForReport())
        ipcMain.handle(getEventLast, getLast20())

        // License
        ipcMain.handle(getUUIDLicenseData, getDesktopData())
        ipcMain.handle(getlicenseData, getLicenseData())
        ipcMain.handle(newLicenseEvent, newLicense())

        // Manual Request
        ipcMain.handle(startManualRequest, manualRequestFn())
        ipcMain.handle(stopManualRequestEvent, stopManualRequest())

        // Journal
        ipcMain.handle(getLastJournal, getLastInsertedJournal())
        ipcMain.handle(getJournalDocuments, getJournalList())
        ipcMain.handle(getLastSuccessfullJournal, getLastSuccessfullyInsertedJournal())

        // Report
        ipcMain.handle(getSingleObjectEventReport, getSingleElectricityObjectCalculation())
        ipcMain.handle(getGraphsAndObjectReportCurrent, getGraphsAndObjectDataCalculationCurrent())
        ipcMain.handle(getGraphsAndObjectReportArchive, getGraphsAndObjectDataCalculationArchive())
        ipcMain.handle(getGraphListEventReport, getGraphDataListCalculation())
        ipcMain.handle(getGraphListEventReportFull, getGraphDataListCalculationFull())
        ipcMain.handle(getDashboardEventReport, getDashboardDataCalculation())

        // Billing
        ipcMain.handle(getBillingListTable, getBillingListTableFn())
        ipcMain.handle(getBillingList, getBillingListFn())

        // Elect_Object
        ipcMain.handle(getElectricityObjectsEvent, getElectricityObjects())
        ipcMain.handle(getSingleObjectEvent, getSingleElectricityObject())
        ipcMain.handle(createElectFolder, insertPapka())
        ipcMain.handle(createElectMeter, insertMeter())
        ipcMain.handle(deleteElectObject, deleteElect())
        ipcMain.handle(listUseMeterElect, listUseMeterElectFn())
        ipcMain.handle(updateElectFolder, updateFolderFn())
        ipcMain.handle(updateElectMeter, updateMeterFn())
        ipcMain.handle(attachParamsElect, attachParamsElectFN())
        ipcMain.handle(getElectFactories, factories())
        ipcMain.handle(getFirstTemplate, getFirstTemplateFN())
        ipcMain.handle(getSecondTemplate, getSecondTemplateFN())
        ipcMain.handle(getThirdTemplate, getThirdTemplateFN())
        ipcMain.handle(getFourthTemplate, getFourthTemplateFN())
        ipcMain.handle(realTime, getRealTime())

        // Calculation_Object
        ipcMain.handle(createCalculationFolder, insertPapkaCalculation())
        ipcMain.handle(getElectricityObjectsEventReport, getElectricityObjectsCalculation())
        ipcMain.handle(deleteCalculationObject, deleteCalculation())
        ipcMain.handle(updateCalculationFolder, updateFolderCalculationFn())
        ipcMain.handle(attachParamsCalculation, attachParamsCalculationFN())
        ipcMain.handle(getReportOnlyMain, calculationMain())
        ipcMain.handle(getFirstTemplateReport, getFirstTemplateReportFN())
        ipcMain.handle(getSecondTemplateReport, getSecondTemplateReportFN())
        ipcMain.handle(getThirdTemplateReport, getThirdTemplateReportFN())
        ipcMain.handle(getFourthTemplateReport, getFourthTemplateReportFN())
        ipcMain.handle(realTimeReport, getRealTimeReport())

        ipcMain.handle(check_port, checkPortFn())
    } catch (err) {
        console.log(err)
        console.log('Asosiy controller ichida hatolik')
        // throw new CustomError(500, err.message)
    }
}
