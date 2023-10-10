import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import { splitWords } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class DiEvent extends Listener {
	private blacklist = [
		'dire',
		'dis',
		'dit',
		'disons',
		'dites',
		'disent',
		'dirai',
		'dirait',
		'diras',
		'dirons',
		'direz',
		'diront',
		'dimes',
		'dites',
		'dirent',
		'disais',
		'disait',
		'disions',
		'disiez',
		'disaient',
		'disant',
		'disais',
		'discord'
	];

	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate'
		});
	}

	public run(message: Message): Promise<Message> | null {
		if (
			(message.channel as TextChannel).parent?.id !== process.env.SERIOUS_CATEGORY &&
			message.author.id !== process.env.CLIENT_ID &&
			(message.content.toLowerCase().includes('di') || message.content.toLowerCase().includes('dy'))
		) {
			const words = splitWords(message.content);
			for (const word of words) {
				// iterate over the words and their index in the message text
				const index = Math.max(word.indexOf('di'), word.indexOf('dy'));
				if (index !== -1) {
					// if word includes "di" or "dy"
					if (!this.blacklist.includes(word)) {
						const toReply = word.slice(index + 2);
						if (toReply.length > 4 && toReply.length < 12) {
							return message.reply({ content: toReply, allowedMentions: { repliedUser: false } });
						}
					}
				}
			}
		}
		return null;
	}
}
