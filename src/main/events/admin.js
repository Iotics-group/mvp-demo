const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validatorAddAdmin, validatorUpdateAdmin, validateDeleteAdmin } = require("../validation/admin")
const { adminRepository } = require("../repository/admin")
const { TOKEN_KEY } = require("../module/config")

const tokenCheck = (token) => {
    try {
        const data = jwt.verify(token, TOKEN_KEY, (err, value) => {
            if (err) return false
            return value
        })
        if (data && data.role === 'admin') return true
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports.addAdminFn = () => {
    return async (event, args) => {
        try {
            await validatorAddAdmin(args)
            if (!tokenCheck(args.token)) return { status: 401, error: 'Token invalid Or not Admin', result: null }

            const find = await adminRepository().findOne({ login: args.login })
            if (find) return { status: 401, error: 'User login already exists', result: null };

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(args.password, salt);
            const newObj = { ...args, password: hash }

            await adminRepository().insert({ ...newObj })
            return { status: 200, error: null, result: "Successful saved" };
        } catch (err) {
            console.log(err)
            return { status: 500, error: err.message, result: null };
        }
    }
}

module.exports.getAdminsListActiveFn = () => {
    return async (event, args) => {
        try {
            const { status } = args
            const adminList = await adminRepository().findAll()
            if (status === 'inactive') {
                return { status: 200, error: null, result: JSON.stringify(adminList.filter(e => !e.active)) }
            }
            return { status: 200, error: null, result: JSON.stringify(adminList.filter(e => e.active)) }
        } catch (err) {
            console.log(err)
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.updateAdminFn = () => {
    return async (event, args) => {
        try {
            await validatorUpdateAdmin(args)

            const { id } = args
            const findId = await adminRepository().findById(id)
            if (!findId) return { status: 404, error: "Admin Not Found", result: null }

            const findLogin = await adminRepository().findOne({ login: args.login })
            if (findLogin && findLogin._id != id) return { status: 401, error: 'User login already use', result: null };

            let password
            if (args.password) {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(args.password, salt);
            }

            await adminRepository().update(args.id, {
                name: args.name || findId.name,
                login: args.login || findId.login,
                password: password || findId.password,
                role: args.role || findId.role,
                open_page: args.open_page || findId.open_page,
                open_folders: args.open_folders || findId.open_folders,
                open_factory: args.open_factory || findId.open_factory
            })
            return { status: 200, error: null, result: 'Successful updated' }
        } catch (err) {
            console.log(err)
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.deleteAdminFn = () => {
    return async (event, args) => {
        try {
            await validateDeleteAdmin(args)
            if (!tokenCheck(args.token)) return { status: 401, error: 'Token invalid Or not Admin', result: null }

            await adminRepository().remove(args.id)
            return { status: 204, error: null, result: 'Successful deleted' }
        } catch (err) {
            console.log(err)
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.activeAdminFn = () => {
    return async (event, args) => {
        try {
            await validateDeleteAdmin(args)
            if (!tokenCheck(args.token)) return { status: 401, error: 'Token invalid Or not Admin', result: null }

            await adminRepository().active(args.id)
            return { status: 200, error: null, result: 'Successful active' }
        } catch (error) {
            console.log(error)
            return { status: 500, error: null, result: null }
        }
    }
}
