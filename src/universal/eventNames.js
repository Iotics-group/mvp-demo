module.exports = {
  loginReq: "login:req",
  print: "printPage",
  printPDFFile: "printPDFFile",
  addAdmin: "admin:add", // New Admin create
  getAdminsListStatus: "admin:getListStatus", // All admins activelar
  updateAdmin: "admin:update", // Admin update
  deleteAdmin: "admin:delete", // Admin delete
  activeAdmin: "admin:active", // Admin Active uchun
  createMeter: "meter:create",
  createComMeter: "meter:com-create",
  updateMeter: "meter:update",
  deleteMeter: "meter:delete",
  deleteFolder: "delete:Folder",
  updateComMeter: "meter:com-update",
  editMeter: "meter:edit",
  getMeterList: "meter:get",
  parametersList: "params:list",
  metersList: "meters:list",
  portList: "port:list",
  getSingleMeter: "meter:single",
  getServerRequestFolders: "request:folders",
  insertServerRequestFolders: "request:createfolder",
  updateServerRequestFolders: "request:updatefolder",
  editServerRequesFolders: "request:editfolder",
  insertServerRequestUspd: "request:createuspd",
  editServerRequesUspd: "request:edituspd",
  getSingleRequestFolder: "request:singlefolder",
  getJournalDocuments: "get:journals",
  getLastJournal: "get:lastjournal",
  getFolderStatus: "folder:status",
  getFolderParent: "folder:parent",
  getLastSuccessfullJournal: "get:successjournal",
  getBillingListTable: "get:table_billing",

  // Events
  getEventTypes: "event:types",
  getEventList: "event:list",
  getEventReport: "event:report",
  getEventLast: "event:last",

  // License
  getUUIDLicenseData: "license:uuid_download",
  getlicenseData: "license:data",
  newLicenseEvent: "license:new",

  // Manual Request
  startManualRequest: "start:manual",
  stopManualRequestEvent: "stop:manual",

  getElectricityObjectsEvent: "object:getList", //Obyektlar ruyhatini list ko'rinishida olish
  getSingleObjectEvent: "object:getSingle", //Bitta obyekt malumotlarini idsi orqali olish
  getVectorDiagram: "vector", //Vector diagramma uchun malumotlarni olish
  getGraphsAndObjectEventCurrent: "graph:currentdata", //3 dagi malumotlarni ikkita alohida shaklda tekushiy(hozirgi) va archive holatida olish
  getGraphsAndObjectEventArchive: "graph:archivedata",
  getGraphListEvent: "graph:list", // 2 chi raqamdagi grafikani tarif bulsa tariflariga bulingan holda olish
  getGraphListEventFull: "graph:full_list",
  getDashboardEvent: "dashboard:total", //dashboardda archive malumotlarni kunlik hisob buyicha olish
  //xuddi shu parametrlarni ochyot obyekt uchun olish
  getElectricityObjectsEventReport: "report:getList",
  getSingleObjectEventReport: "report:getSingle",
  getGraphsAndObjectReportCurrent: "report:graph:currentdata",
  getGraphsAndObjectReportArchive: "report:graph:archivedata",
  getGraphListEventReport: "report:graph:list",
  getGraphListEventReportFull: "report:graph:list_full",
  getDashboardEventReport: "report:dashboard:total",
  getBillingList: "get:billing", // Get Billing ro'yxatini chiqarib berish uchun event {"id": "", "date1": 1,"date2": 2}

  // ElectObject
  createElectFolder: "create:elect_folder",
  createElectMeter: "create:elect_meter",
  deleteElectObject: "delete:elect_meter",
  listUseMeterElect: "list:use_meter_elect",
  updateElectFolder: "update:elect_folder",
  updateElectMeter: "update:elect_meter",
  attachParamsElect: "attach:params_elect",
  getElectFactories: "factories",
  getFirstTemplate: "get:first_elect",
  getSecondTemplate: "get:second_elect",
  getThirdTemplate: "get:third_elect",
  getFourthTemplate: "get:fourth_elect",
  realTime: "elect:real_time",

  // CalculationObject
  createCalculationFolder: "create:calculation_folder",
  deleteCalculationObject: "delete:calculation_meter",
  updateCalculationFolder: "update:Calculation_folder",
  attachParamsCalculation: "attach:params_calculation",
  getReportOnlyMain: "report:main",
  getFirstTemplateReport: "get:first_report",
  getSecondTemplateReport: "get:second_report",
  getThirdTemplateReport: "get:third_report",
  getFourthTemplateReport: "get:fourth_report",
  realTimeReport: "report:real_time",

  // server message to client
  send_message: "send_message",
  event: "event",
  manualRequest: "manual-request",
  check_port: "check:port",
};
