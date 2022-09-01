import { SlashCommandBuilder } from 'discord.js'
import TezaursClient from '../core/TezaursClient.js'

const data = new SlashCommandBuilder()
    .setName("tz")
    .setDescription("Meklē vārda skaidrojumu latviešu valodā, izmantojot Tezaurs.lv resursus.")
    .addStringOption(option => {
        option.setName("vārds")
            .setDescription("Frāze vai vārds latviešu valodā.")
            .setRequired(true);
        return option;
    });

/**
 * Execute 'tz' command
 * 
 */
const execute = async (interaction) => {
    await interaction.deferReply();

    const word = interaction
        .options.getString("vārds");

    let message = "";

    try {
        let entries = await new TezaursClient().retrieve(word);

        if (entries !== null) {
            message = formatMessage(word, entries);
        } else {
            message = `Pēc frāzes **${word}** nekas netika atrasts.`;
        }
    } catch {
        message = "Notika kļūda! Lūdzu, mēģiniet vēlreiz.";
    }

    return interaction
        .editReply(message);
}

/**
 * Format response message
 * 
 */
const formatMessage = (word, entries) => {
    let message = "";

    const hasHomonym = ("2" in entries);

    for (let hom in entries) {
        if (hasHomonym) {
            message += `**${word}** \`${hom}\`\n`;
        } else {
            message += `**${word}**\n`;
        }

        let senses = entries[hom];

        for (let sense of senses) {
            message += `> ${sense}\n\n`;
        }
    }

    return message;
}

export default { 
    data, 
    execute
}
