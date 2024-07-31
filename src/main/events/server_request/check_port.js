const net = require('net');
const CustomError = require('../../utils/custom_error');
const { repositories } = require('../../repository');

module.exports.checkPortFn = () => {
    return async (event, args) => {
        try {
            const { port } = args
            const server = net.createServer();

            if ((await repositories().meterRepository().findListAlreadyPorts()).includes(port)) {
                return { status: 404, message: "Port In Database" }
            }

            const timeOut = setTimeout(() => {
                return { status: 200, message: "Port Already busy" }
            }, 5000);

            server.listen(port, () => {
                server.close();
                clearTimeout(timeOut)
                return { status: 404, message: "Middleware not working" }
            });

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    clearTimeout(timeOut)
                    return { status: 200, message: "Middleware running" }
                }
            });
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}
