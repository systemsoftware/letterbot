const { REST } = require('@discordjs/rest');
const { Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');


const commands = [new SlashCommandBuilder()
	.setName('add')
	.setDescription('Add a user!')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.addStringOption(option =>
		option.setName('user')
			.setDescription('Letterboxd username')
			.setRequired(true))
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Channel to send update in')
                    .setRequired(true)),
                    new SlashCommandBuilder()
	.setName('delete')
	.setDescription('Delete user!')
    .setDMPermission(false)
	.addStringOption(option =>
		option.setName('user')
			.setDescription('Letterboxd username')
			.setRequired(true))
            .addStringOption(option =>
                option.setName('secret')
                    .setDescription('Bot secret')
                    .setRequired(true))
]



const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.')

		await rest.put(
			Routes.applicationGuildCommands(clientId.toString(),guildId.toString()),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.')
	} catch (error) {
		console.error(error)
	}
})()