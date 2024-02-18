const { SlashCommandBuilder } = require('discord.js');
const { gameServer } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parry')
		.setDescription('gives list of the most common parries and their respective attributes'),
	async execute(interaction) {
		await interaction.reply(`
[Quelle](https://world-of-dungeons.de/ency/Kampfsystem_-_Abwehr_von_Angriffen)
Hier die Auflistung der Standardparaden
* Nahkampf: SN/GE [Hieb ausweichen](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Hieb+ausweichen), [Schildparade](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Schildparade), Waffenparaden
* Fernkampf: SN/WA [Geschoss ausweichen](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Geschoss+ausweichen), [Geschoss blocken](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Geschoss+blocken), [Kleinwuchs](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Kleinwuchs)
* Magie: WI/IN [Magieresistenz](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Magieresistenz)
* Sozial: WI/CH [Fester Wille](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Fester+wille), [Stoische Ruhe](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Stoische+ruhe), [Sturheit des Ochsen](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Sturheit+des+ochsen), [Narrenfreiheit](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Narrenfreiheit), [Göttliche Zuversicht](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Göttliche+zuversicht), [Disziplin](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Disziplin), [Starrsinn](https://cartegon.world-of-dungeons.de/wod/spiel/hero/skill.php?name=Starrsinn)
		`);
	},
}