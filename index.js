const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
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
	return 'https://' + server + 'world-of-dungeons.de/wod/spiel/' + typePart + '.php?name=' + searchString.replace(' ', '+');
}

function parseWodLink(internalUrl) {
	const regex = /\[(item|hero|player|group|clan|skill|npc|forum|post|auction|set|class):(.*?)\]/g;
	const match = [...internalUrl.matchAll(regex)];
	let matches = match.map(m => {return [m[1], m[2].trim()]});
	return matches;
}

client.login(process.env.DISCORD_TOKEN);
