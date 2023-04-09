import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import { redisClient } from '../lib/redis';
import { makeCouncilEmbed } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class CouncilVoteEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'interactionCreate'
		});
	}

	public async run(interaction: Interaction) {
		if (!interaction.isButton()) return null;
		if (interaction.customId.startsWith('council')) {
			const voteId = interaction.message.id;
			console.log('voting for vote', voteId);
			const [, mode] = interaction.customId.split('_');
			const author = interaction.message.embeds[0].author as {
				name: string;
				iconURL: string;
			};
			const propal = interaction.message.embeds[0].description as string;
			let [votesFor, votesAgainst] = interaction.message.components[0].components.map((button) =>
				Number.parseInt(button.customId?.split('_')[2] as string, 10)
			);
			switch (mode) {
				case 'plus':
					if (await redisClient.sismember(`votes:for:${voteId}`, author.name)) return null;
					votesFor += 1;
					if (await redisClient.smove(`votes:against:${voteId}`, `votes:for:${voteId}`, author.name)) votesAgainst -= 1;
					else await redisClient.sadd(`votes:for:${voteId}`, author.name);
					break;
				case 'minus':
					if (await redisClient.sismember(`votes:against:${voteId}`, author.name)) return null;
					votesAgainst += 1;
					if (await redisClient.smove(`votes:for:${voteId}`, `votes:against:${voteId}`, author.name)) votesAgainst -= 1;
					else await redisClient.sadd(`votes:against:${voteId}`, author.name);
					break;
			}
			return interaction.update(makeCouncilEmbed(propal, author, votesFor, votesAgainst));
		}
		return null;
	}
}
