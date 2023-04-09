import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { TextChannel, User } from 'discord.js';
import { makeCouncilEmbed } from '../lib/utils';

@ApplyOptions<Command.Options>({
	name: 'propal',
	description: 'Pour soumettre une proposition au conseil'
})
export class PropalCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('prop').setDescription('La proposition à soumettre').setRequired(true)),
			{ guildIds: [process.env.GUILD_ID as string] }
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const propal = interaction.options.getString('prop');
		if (!propal) return;
		const author = interaction.member?.user as User;
		const pfp = author?.avatarURL() as string;
		const message = makeCouncilEmbed(propal, { name: author.username, iconURL: pfp }, 0, 0);
		const councilChannel = interaction.guild?.channels.cache.get(process.env.COUNCIL_CHANNEL as string) as TextChannel;
		await councilChannel.send(message);
		return interaction.reply({
			content: 'La proposition a été soumise au conseil !',
			ephemeral: true
		});
	}
}
