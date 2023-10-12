import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { redisClient } from '../lib/redis';

@ApplyOptions<Command.Options>({
	name: 'bottom',
	description: 'Pour voir qui est le plus gros bottom :3'
})
export class BottomCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			guildIds: [process.env.GUILD_ID as string]
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const scores = await redisClient.hgetall('bottomLeaderboard');
		const formattedScores = await Promise.all(
			Object.entries(scores).map(async ([user, score]) => {
				const member = await interaction.guild?.members.fetch(user);
				return { name: member?.nickname ?? member?.user?.username ?? '', score: parseInt(score) };
			})
		);
		const embed = new EmbedBuilder().setTitle('Bottom Leaderboard').setDescription('Qui est le plus gros bottom ?').setTimestamp();
		formattedScores.sort((a, b) => b.score - a.score).map((s) => embed.addFields({ name: s.name, value: `${s.score} pts`, inline: false }));
		return interaction.reply({
			embeds: [embed]
		});
	}
}
