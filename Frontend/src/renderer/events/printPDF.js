const electron = require('electron')
const fs = require("fs");
// const os = require("os");
const path = require("path");

module.exports.printPDF = () => {
  return async (event, args) => {
    try {
      let win = new electron.BrowserWindow({
        // other options
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      })
      win.hide();
      if(process.env.NODE_ENV == 'development'){
        win.loadURL(path.join(__dirname,'/bundled/index.html'))
      }else{
        win.loadURL('app://./index.html')
      }
      const html = JSON.stringify(args.content)
      const landscape = args.landscape
      const fileName = (args.fileName + '.pdf') || ('report.pdf')
      const promise1 = new Promise((resolve) => {
        win.webContents.executeJavaScript(`
          function buildhtml () {
            document.body.innerHTML = ${html}
            document.body.style.background = "#ffffff";
          }
          buildhtml();`
        )
        setTimeout(() => {
          resolve()
        }, 1000);
      })
      promise1.then(async () => {
        // const pdfPath = path.join(os.homedir(), 'Downloads', fileName)
        const pdfPath = await showSaveDialog();
        if(pdfPath){
          win.webContents.printToPDF({landscape: landscape, printBackground: true,})
          .then((data) => {
            fs.writeFile(pdfPath, data, (error) => {
              if(error) {
                console.log(error);
              }
              console.log(`Wrote PDF successfully to ${pdfPath}`)
            })
            win.close()
          })
          .catch(error => {
            console.log(`Failed to write PDF to ${pdfPath}: `, error)
          })
        }else{
          win.close()
        }
        function showSaveDialog() {
          return electron.dialog.showSaveDialog({
            title: 'Save PDF',
            defaultPath: path.join(electron.app.getPath('downloads'), fileName),
            filters: [
              { name: 'PDF Files', extensions: ['pdf'] }
            ]
          }).then(result => {
            if (result.canceled) {
                return null;
            } else {
                return result.filePath;
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}