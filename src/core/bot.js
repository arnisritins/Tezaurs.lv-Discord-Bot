import dotenv from 'dotenv'
import { resolve } from 'path'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { importModules, fileDirName } from './helpers.js'

dotenv.config();

class Bot
{
    /**
     * Construct Discord bot core components
     * 
     */
    constructor() {
        const __dirname = fileDirName(import.meta.url);

        // Set Discord credentials
        this.token = process.env.DISCORD_TOKEN;
        this.clientId = process.env.DISCORD_CLIENT_ID;

        // Resolve folders
        this.commandsFolder = resolve(__dirname, '../commands');
        this.eventsFolder = resolve(__dirname, '../events');

        // Initialize Discord client
        this.client = new Client({ 
            intents: [
                GatewayIntentBits.Guilds
            ]
        });
    }

    /**
     * Start bot application
     * 
     */
    async start() {
        await this.#setCommands();
        await this.#setEvents();
       
        // Login to Discord with client's token
        this.client.login(this.token);
    }

    /**
     * Set bot slash commands
     * 
     */
    async #setCommands() {
        console.log("Commands:");

        this.client.commands = new Collection();

        await importModules(this.commandsFolder, command => {
            this.client.commands
                .set(command.data.name, command);

            console.log(`${command.data.name}`);
        });
    }

    /**
     * Set chat events
     * 
     */
    async #setEvents() {
        console.log("Events:");

        await importModules(this.eventsFolder, event => {
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args));
            }

            console.log(`${event.name}`);
        });
    }
}

export { Bot }
