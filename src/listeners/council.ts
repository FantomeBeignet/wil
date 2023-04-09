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
			const voterId = interaction.user.id;
			const voteId = interaction.message.id;
			const [, mode] = interaction.customId.split('_');
			const author = interaction.message.embeds[0].author as {
				name: string;
				iconURL: string;
			};
			const propal = interaction.message.embeds[0].description as string;
			switch (mode) {
				case 'plus':
					if (await redisClient.sismember(`votes:for:${voteId}`, voterId)) return null;
					if (!(await redisClient.smove(`votes:against:${voteId}`, `votes:for:${voteId}`, voterId)))
						await redisClient.sadd(`votes:for:${voteId}`, voterId);
					break;
				case 'minus':
					if (await redisClient.sismember(`votes:against:${voteId}`, voterId)) return null;
					if (!(await redisClient.smove(`votes:for:${voteId}`, `votes:against:${voteId}`, voterId)))
						await redisClient.sadd(`votes:against:${voteId}`, voterId);
					break;
			}
			const votesFor = await redisClient.scard(`votes:for:${voteId}`);
			const votesAgainst = await redisClient.scard(`votes:against:${voteId}`);
			return interaction.update(makeCouncilEmbed(propal, author, votesFor, votesAgainst));
		}
		return null;
	}
}
