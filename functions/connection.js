require('dotenv').config();

module.exports = class Database {
    constructor() {
        this.connection = require(`mysql2`).createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
    }
    async setSettingsLog(userID, settingOption, settingValue) {
        await this.connection.promise().query(`SELECT * FROM members WHERE discordId = '${userID}'`).then((rows) => {
            if (rows[0].length < 1) this.connection.promise().query(`INSERT INTO members (discordId) VALUES ('${userID}')`);
            return this.connection.promise().query(`UPDATE members SET ${settingOption} = ${settingValue} WHERE discordId = '${userID}'`);
        }).catch(err => console.log(err));
    }
    async getSettingsLog(userID) {
        const values = await this.connection.promise().query(`SELECT * FROM members WHERE discordId = '${userID}'`).then(rows => rows[0]).catch(err => console.log(err));
        return values[0];
    }
    async triggerLog(userID, triggerType, triggerName, args) {
        const time = Date.now();
        const data = {
            triggerId: userID,
            triggerReason: triggerType,
            triggerName,
            triggerArgs: JSON.stringify(args),
            triggerTime: time
        }
        await this.connection.promise().query(`INSERT INTO logs SET ?`, data).catch(err => console.log(err));
    }
}