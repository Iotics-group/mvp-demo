const bcrypt = require('bcryptjs')
const { adminModel } = require('../models/admin')

module.exports = async () => {
    try {
        const find = await adminModel.findOne({ role: "admin" })
        if (!find) {
            const salt = await bcrypt.genSalt(10);
            await adminModel.create({
                name: "Админ",
                login: 'admin',
                password: await bcrypt.hash("p@ssw0rd", salt),
                role: 'admin'
            })
            console.log('Create Super User...')
        } else {
            console.log('SuperAdmin mavjud...')
        }
    } catch (error) {
        console.log(error)
    }
}

// Bu file Yengi Eng kotta super Admin yaratish uchun ishlatilinadi.
