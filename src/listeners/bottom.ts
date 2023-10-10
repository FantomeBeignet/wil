import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import { redisClient } from '../lib/redis';
import { splitWords } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class CamionEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate'
		});
	}

	public run(message: Message): Promise<Message> | null {
		const words = splitWords(message.content).filter((word) => word.match(/^h+i+/));
		if (
			(message.channel as TextChannel).parent?.id !== process.env.SERIOUS_CATEGORY &&
			message.author.id !== process.env.CLIENT_ID &&
			words.length > 0
		) {
			const re = /h+i+/g;
			let matches: RegExpExecArray[] = [];
			let match = undefined;
			words.map((word) => {
				const localMatches: RegExpExecArray[] = [];
				while ((match = re.exec(word)) !== null) {
					if (match.index === 0 || match.index === localMatches[-1].index + localMatches[-1][0].length) {
						localMatches.push(match);
					}
				}
				matches = [...matches, ...localMatches];
			});
			redisClient.incrby(`bottomLeaderbord:${message.author.id}`, matches.length);
		}
		return null;
	}
}
