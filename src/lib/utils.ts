import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, Colors, EmbedBuilder, TextChannel, User } from 'discord.js';

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

export function makeCouncilEmbed(propal: string, author: { name: string; iconURL: string }, votesFor: number, votesAgainst: number) {
	const embed = new EmbedBuilder()
		.setTitle('Proposition pour le conseil')
		.setAuthor(author)
		.setDescription(propal)
		.addFields(
			{ name: 'Votes pour :', value: votesFor.toString(), inline: true },
			{ name: 'Votes contre :', value: votesAgainst.toString(), inline: true }
		)
		.setTimestamp();
	votesFor > votesAgainst ? embed.setColor(Colors.Green) : votesFor < votesAgainst ? embed.setColor(Colors.Red) : embed.setColor(Colors.Default);
	const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setCustomId(`council_plus_${votesFor.toString()}`).setEmoji('✔️').setStyle(ButtonStyle.Success),
		new ButtonBuilder().setCustomId(`council_minus_${votesAgainst.toString()}`).setEmoji('✖️').setStyle(ButtonStyle.Danger)
	);
	return { embeds: [embed], components: [buttons] };
}

export const splitWords = (sentence: string) =>
	sentence
		.toLowerCase()
		.split(' ')
		.map((word) => word.replace(/^[`!?\.,\(\)\[\]\{\};:'"\/]+|[`!?\.,\(\)\[\]\{\};:'"\/]+$/g, ''));
