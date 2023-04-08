import { Channel, EmbedBuilder, TextChannel, User } from 'discord.js';

export const isTextChannel = (channel: Channel): channel is TextChannel => {
	return channel instanceof TextChannel;
};

export const makeQuoteEmbed = (usedBy: User, title: string, author: User | null, content: string) => {
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(content)
		.setTimestamp()
		.setFooter({
			text: `Envoyé par ${usedBy.username}`
		});
	if (author) {
		embed.setAuthor({
			name: author.username,
			iconURL: author.displayAvatarURL()
		});
	}
	return embed;
};
