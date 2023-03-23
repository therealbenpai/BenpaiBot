const Sentry = require('@sentry/node');
const Intigrations = require('@sentry/integrations');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const Tracing = require("@sentry/tracing");
const { v5 } = require('uuid');
const crypto = require('crypto');
// const Database = require('./connection');

Sentry.init(
    {
        dsn: "https://d13b69e8e97e4ace8553d606501f4fa7@o4504516705058816.ingest.sentry.io/4504743959724032",
        sampleRate: 1.0,
        serverName: "Server",
        integrations: [
            new ProfilingIntegration(),
            new Intigrations.ExtraErrorData({ depth: 20 }),
            new Intigrations.SessionTiming(),
            new Intigrations.Transaction(),
            new Intigrations.ReportingObserver(),
            new Intigrations.CaptureConsole({
                levels: ['error', 'warn']
            })
        ],
        // @ts-ignore
        profilesSampleRate: 1.0,
        environment: "Development",
        release: "Main",
        sendDefaultPii: true
    }
)

module.exports = class ErrorHandler {
//    static #connection = new Database().connection;
    static generateErrorID = (error) => v5(crypto.createHmac('sha512', 'ErrorHashKey-3r2w7yii3s4rgs').update(error.stack).digest('hex'), '6ba7b810-9dad-11d1-80b4-00c04fd430c8');
    static async catchErrors(error, interaction, id) {
        const errorID = this.generateErrorID(error);
        Sentry.captureException(error, { tags: { errorID }, level: 'error' });
        console.log(`New Error Thrown. Error ID: ${errorID}`)
        console.error(error);
        const reply = { content: ['There was an error while executing this command! Please contact one of my developers of this issue.', '', `Please provide this error ID to the developer: \`${errorID}\``].join('\n'), ephemeral: true }
        if (interaction && !interaction.author) interaction.isRepliable() ? await interaction.reply(reply) : await interaction.followUp(reply);
//        if (typeof id === 'number') this.#connection.query('UPDATE logs SET successful = 0, errorId = ? WHERE id = ' + id, [errorID], (err) => (err) ? console.error(err) : undefined)
    }
}