const electron = require('electron');
const {repositories} = require("../repository")
const BrowserWindow = electron.BrowserWindow;
const {sortvalueObjectsForFirstReport}  = require("../utils/sortvalue_bydate")


const options = { 
    silent: false, 
    printBackground: true, 
    color: false, 
    landscape: false, 
    pagesPerSheet: 1, 
    collate: false, 
    copies: 1, 
    border:{
        top:'100px',
        bottom:'100px',
        left:'100px'
    },
    scaleFactor: 1,         
};

module.exports.printPage = () => {
    return async () => {
// async function  printPage(){  
 
         let win = BrowserWindow.getFocusedWindow()
        const pages = await repositories().electObjectRepository().firstTemplateReport("65a27292152ff532bdca2b5b",{startDate:"2023-09-11T16:03:03.355+00:00",finishDate:"2024-01-22T19:00:00.000+00:00"})
        let reportData = sortvalueObjectsForFirstReport(pages.parameters)
         
        win.webContents.print(options, (success, failureReason) => { 
        if (!success) console.log(failureReason)})
    }
}

// printPage()