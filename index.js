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
		let [url, label] = buildURL(linkType, searchString);
		if (!url) { return }
		responseStrings.push('[' + label + '](' + url + ')');
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
	let searchUrl;
	let label = searchString.replaceAll(' ', '+');
	switch (linkType) {
		case 'item': searchUrl = 'hero/item.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'hero': searchUrl = 'hero/profile.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'player': searchUrl = 'profiles/player.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'group': searchUrl = 'dungeon/group.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'clan': searchUrl = 'clan/clan.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'skill': searchUrl = 'hero/skill.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'npc': searchUrl = 'help/npc.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'forum': searchUrl = 'forum/viewtopic.php?pid=' + searchString.replaceAll(' ', '+') + '#' + searchString.replaceAll(' ', '+'); label = 'Zum Forum (' + searchString.replaceAll(' ', '+') + ')'; break;
		case 'post': searchUrl = 'forum/viewtopic.php?pid=' + searchString.replaceAll(' ', '+') + '#' + searchString.replaceAll(' ', '+'); label = 'Zum Forum (' + searchString.replaceAll(' ', '+') + ')'; break;
		//case 'pcom': searchUrl = 'forum/viewforum.php?pid=' + searchString.replaceAll(' ', '+') + '#' + searchString.replaceAll(' ', '+'); label = 'Zum Forum (' + searchString.replaceAll(' ', '+') + ')'; break;
		case 'auction': searchUrl = 'trade/auction_details.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'set': searchUrl = 'hero/set.php?name=' + searchString.replaceAll(' ', '+'); break;
		case 'class': searchUrl = 'hero/class.php?name=' + searchString.replaceAll(' ', '+'); break;
		default: return false;
	}
	return ['https://' + server + 'world-of-dungeons.de/wod/spiel/' + searchUrl, label];
}
/*[pcom:wc_gruppe_17825461]
https://cartegon.world-of-dungeons.de/wod/spiel/forum/viewtopic.php?pid=17825461&board=gruppe&world=wc&IS_POPUP=1&session_hero_id=285410&is_popup=1#17825461
https://cartegon.world-of-dungeons.de/wod/spiel/forum/viewtopic.php?pid=16268041&board=kein&session_hero_id=285410#16268041
https://cartegon.world-of-dungeons.de/wod/spiel/forum/viewtopic.php?pid=17825461&board=gruppe&world=wc&IS_POPUP=1&session_hero_id=285410&is_popup=1#17825461

https://cartegon.world-of-dungeons.de/wod/spiel/forum/viewtopic.php?pid=17825466&jump=1&board=gruppe&world=wc&IS_POPUP=1&is_popup=1#17825466
*/

function parseWodLink(internalUrl) {
	const regex = /\[(item|hero|player|group|clan|skill|npc|forum|post|auction|set|class):(.*?)\]/g;
	const match = [...internalUrl.matchAll(regex)];
	let matches = match.map(m => {return [m[1], m[2].trim()]});
	return matches;
}

client.login(process.env.DISCORD_TOKEN);
