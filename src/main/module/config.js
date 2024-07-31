require("dotenv").config()

module.exports = {
      PORT: 2525,
      HASHNUMBER: 10,
      TOKEN_KEY: "donttouchthis!!",
      DB_ADDRESS: "mongodb://localhost:27017/DEMO",
      // DB_PORT:process.env.DB_PORT,
      // DB_NAME:process.env.DB_NAME,
      // DB_USER:process.env.DB_USER,
      // DB_PASSWORD:process.env.DB_PASSWORD,
      SERVER_ADDRESS: "http://admin:admin@176.96.254.243/crq"
}
