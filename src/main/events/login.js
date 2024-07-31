const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { TOKEN_KEY } = require("../module/config")
const { repositories } = require("../repository")

module.exports.authorization = () => {
    return async (event, args) => {
        try {
            const { login, password } = args;

            if (!(login && password)) {
                return { status: 401, error: "Login and password is required", args: null }
            }
            const user = await repositories().adminRepository().findOne({ login });
            const ok = JSON.stringify(user)
            if (user) {
                if (user.active) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (!isMatch) {
                        return { status: 401, error: "Login or password is wrong", args: null };
                    } else {
                        await repositories().adminRepository().update(user._id, {last_active: new Date()})
                        const token = jwt.sign(
                            { user: user._id, role: user.role },
                            TOKEN_KEY,
                            {
                                expiresIn: "20h",
                            }
                        );
                        return { status: 200, error: null, args: { token, ok: JSON.parse(ok) } }
                    }
                } else {
                    return { status: 401, error: "User No Active", args: null}
                } 
            } else {
                return { status: 401, error: "user is not exist with this id", args: null };
            }
        } catch (err) {
            console.log(err);
            return { status: 401, error: err.message, args: null };
        }
    }
}
