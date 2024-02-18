const { SlashCommandBuilder } = require('discord.js');
const { gameServer } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parryextended')
		.setDescription('gives list of all parries and their respective attributes'),
	async execute(interaction) {
		await interaction.reply(`
[Quelle](https://world-of-dungeons.de/ency/Kampfsystem_-_Abwehr_von_Angriffen)
Hier die Auflistung der unkonventionelleren Paraden
* Hinterhalt: WA/IN [Sechster Sinn](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Sechster+sinn)
* Falle auslösen: WA/SN [Sechster Sinn](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Sechster+sinn)
* Explosion: SN/WA
* Naturgewalt: WI/SN [Naturverbunden](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Naturverbunden)
* Krankheit: KO/CH [Zäh](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Zäh)
* Magisches Geschoss: IN/SN
* Verfluchen: CH/WI
* Verschrecken: WI/KO
		`);
	},
}