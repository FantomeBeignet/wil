import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { redisClient } from '../lib/redis';
import { splitWords } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class BLEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate'
		});
	}

	public run(message: Message): Promise<Message> | null {
		const words = splitWords(message.content).filter((word) => word.match(/^h+i+/));
		const colonThree = message.content.toLowerCase().match(/:3/g)?.length ?? 0;
		const isForMe = message.content.match(/:isForMe:/g)?.length ?? 0;
		const pleading = message.content.match(/:pleading_face:/g)?.length ?? 0;
		const flushed = message.content.match(/:flushed:/g)?.length ?? 0;
		const pointrl = message.content.match(/:point_right:\s*:point_left:/g)?.length ?? 0;
		if (message.author.id !== process.env.CLIENT_ID && (words.length > 0 || colonThree || isForMe)) {
			let matches: RegExpExecArray[] = [];
			let match = undefined;
			words.map((word) => {
				const localMatches: RegExpExecArray[] = [];
				const re = /h+i+/g;
				while ((match = re.exec(word)) !== null) {
					if (
						match.index === 0 ||
						match.index === localMatches[localMatches.length - 1].index + localMatches[localMatches.length - 1][0].length
					) {
						localMatches.push(match);
					}
				}
				matches = [...matches, ...localMatches];
			});
			redisClient.hincrby(
				'bottomLeaderboard',
				message.author.id,
				matches.length + isForMe * 2 + colonThree * 3 + pleading * 2 + flushed * 2 + pointrl * 3
			);
		}
		return null;
	}
}
