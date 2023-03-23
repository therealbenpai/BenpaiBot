// Language: Node.js (JavaScript) using CommonJS module syntax
// Database Type: MySQL v8.0.26

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
    /**
     * 
     * @param {string} userID 
     * @param {string} triggerType 
     * @param {string} triggerName 
     * @param {string[]} args 
     * @returns {Promise<number>}
     */
    async triggerLog(userID, triggerType, triggerName, args) {
        const time = Date.now();
        const data = {
            triggerId: userID,
            triggerReason: triggerType,
            triggerName,
            triggerArgs: JSON.stringify(args),
            triggerTime: time
        }
        await this.connection.promise().query(`INSERT INTO logs SET ?`, data).catch(error => console.log);
        const logID = await this.connection.promise().query(`SELECT id FROM logs WHERE triggerId = '${userID}' AND triggerTime = '${time}'`).then(rows => rows[0][0].id).catch(error => console.log);
        return logID;
    }
    /**
     * 
     * @param {string} userID
     * @param {string} ticketReason
     * @param {string} ticketID
     * @returns {Promise<number>}
     */
    async createTicketLog(userID, ticketReason, ticketID,) {
        const data = {
            ticketChannelId: ticketID,
            ticketReason,
            ticketUserId: userID
        }
        await this.connection.promise().query(`INSERT INTO tickets SET ?`, data).catch(error => console.log);
        const logID = await this.connection.promise().query(`SELECT id FROM tickets WHERE ticketUserId = '${userID}' AND ticketChannelId = '${ticketID}'`).then(rows => rows[0][0].id).catch(error => console.log);
        return logID;
    }
    /**
     * 
     * @param {number} ticketId
     * @param {string} columnToChange
     * @param {string|boolean|number} newValue
     * @returns {Promise<boolean>}
     */
    async editTicketLog(ticketId, columnToChange, newValue) {
        switch (columnToChange) {
            case 'ticketStaffID':
                if (typeof newValue !== 'string') return false;
                if (newValue.length > 20) return false;
                break;
            case 'ticketReason':
                if (typeof newValue !== 'string') return false;
                if (newValue !== 'mod' && newValue !== 'feature' && newValue !== 'bug') return false;
                break;
            case 'closed':
                if (typeof newValue !== 'boolean' && typeof newValue !== 'number') return false;
                newValue = Number(newValue);
                if (newValue !== 0 && newValue !== 1) return false;
                break;
            case 'transcript':
                if (typeof newValue !== 'string') return false;
                break;
            default:
                return false;
        }
        await this.connection.promise().query(`UPDATE tickets SET ${columnToChange} = '${newValue}' WHERE id = '${ticketId}'`).catch(error => console.log);
        return true;
    }
    /**
     * 
     * @param {string} ticketId
     * @returns {Promise<{id:number, ticketChannelId: string, ticketUserId: string, ticketReason: string, ticketStaffId: string|null, closed: 0|1, transcript: string|null }|null>}
     */
    async getTicketLog(ticketId) {
        return (await this.connection.promise().query(`SELECT * FROM tickets WHERE id = '${ticketId}'`).then(rows => rows[0][0]).catch(error => console.log))
    }
    async getServerSettings(serverId) {
        /*
        Server Settings Table: `servers`

        Columns:
        - id (int) (auto increment)
        - guildId (varchar(20))
        - ticketLogChannelId (varchar(20))
        - ticketSupportRoleId (varchar(20))
        - ticketCategory (varchar(20))
        - welcomeChannelId (varchar(20))
        */

        return (await this.connection.promise().query(`SELECT * FROM servers WHERE guildId = '${serverId}'`).then(rows => rows[0][0]).catch(error => console.log))
    }
    async editServerSettings(serverId, columnToChange, newValue) {
        /*
        Server Settings Table: `servers`

        Columns:
        - id (int) (auto increment)
        - guildId (varchar(20))
        - ticketLogChannelId (varchar(20))
        - ticketSupportRoleId (varchar(20))
        - ticketCategory (varchar(20))
        - welcomeChannelId (varchar(20))

        Read-Only Columns:
        - id
        - guildId

        Columns that can be changed:
        - ticketLogChannelId
        - ticketSupportRoleId
        - ticketCategory
        - welcomeChannelId
        */

        switch (columnToChange) {
            case 'ticketLogChannelId':
                if (typeof newValue !== 'string') return false;
                if (newValue.length > 20) return false;
                break;
            case 'ticketSupportRoleId':
                if (typeof newValue !== 'string') return false;
                if (newValue.length > 20) return false;
                break;
            case 'ticketCategory':
                if (typeof newValue !== 'string') return false;
                if (newValue.length > 20) return false;
                break;
            case 'welcomeChannelId':
                if (typeof newValue !== 'string') return false;
                if (newValue.length > 20) return false;
                break;
            default:
                return false;
        }
        await this.connection.promise().query(`UPDATE servers SET ${columnToChange} = '${newValue}' WHERE guildId = '${serverId}'`).catch(error => console.log);
        return true;
    }
    async createServerSettings(serverId) {
        /*
        Default Values:
        - ticketLogChannelId: 'pending'
        - ticketSupportRoleId: 'pending'
        - ticketCategory: 'pending'
        - welcomeChannelId: 'pending'
        */

        const data = {
            guildId: serverId,
            ticketLogChannelId: 'pending',
            ticketSupportRoleId: 'pending',
            ticketCategory: 'pending',
            welcomeChannelId: 'pending'
        }
        await this.connection.promise().query(`INSERT INTO servers SET ?`, data).catch(error => console.log);
        return true;
    }
}