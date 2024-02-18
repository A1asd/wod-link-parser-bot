const { Client, Events, GatewayIntentBits, Partials, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { gameServer } = require('./config.json');

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
	partials: [
		Partials.Channel,
	]
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(foldersPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	let responseStrings = [];
	const matches = parseWodLink(message.content);
	matches.forEach(match => {
		let linkType = match[0];
		let searchString = match[1];
		let url = buildURL(linkType, searchString);
		if (!url) { return }
		responseStrings.push('[' + searchString + '](' + url + ')');
	})

	if (responseStrings.length < 1) { return }

	message.channel.send(responseStrings.join(', '));
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

function buildURL(linkType, searchString) {
	const server = gameServer.length > 0 ? gameServer + '.' : '';
	let typePart;
	switch (linkType) {
		case 'item': typePart = 'hero/item'; break;
		case 'hero': typePart = 'hero/profile'; break;
		case 'player': typePart = 'profiles/player'; break;
		case 'group': typePart = 'dungeon/group'; break;
		case 'clan': typePart = 'clan/clan'; break;
		case 'skill': typePart = 'hero/skill'; break;
		case 'npc': typePart = 'help/npc'; break;
		case 'forum': typePart = 'forum/viewforum'; break;
		case 'post': typePart = 'forum/viewtopic'; break;
		case 'auction': typePart = 'trade/auction_details'; break;
		case 'set': typePart = 'hero/set'; break;
		case 'class': typePart = 'hero/class'; break;
		default: return false;
	}
	return 'https://' + server + 'world-of-dungeons.de/wod/spiel/' + typePart + '.php?name=' + searchString.replaceAll(' ', '+');
}

function parseWodLink(internalUrl) {
	const regex = /\[(item|hero|player|group|clan|skill|npc|forum|post|auction|set|class):(.*?)\]/g;
	const match = [...internalUrl.matchAll(regex)];
	let matches = match.map(m => {return [m[1], m[2].trim()]});
	return matches;
}

client.login(process.env.DISCORD_TOKEN);
