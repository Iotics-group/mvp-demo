const CustomError = require("../../utils/custom_error");

module.exports.getDesktopData = () => {
    return async (event, args) => {
        try {
            return ""
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.newLicense = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, data: "Succesfull updated" }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}

module.exports.getLicenseData = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, data: {} }
        } catch (err) {
            return new CustomError(err.status, err.message)
        }
    }
}