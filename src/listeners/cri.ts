import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import { bold } from 'discord.js';
import { splitWords } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class CriEvent extends Listener {
	private blacklist = [
		'crier',
		'crie',
		'cries',
		'crions',
		'criez',
		'crient',
		'crierai',
		'crieras',
		'criera',
		'crierons',
		'crierez',
		'crieront',
		'criais',
		'crias',
		'cria',
		'criâmes',
		'criâtes',
		'crièrent',
		'criais',
		'criait',
		'criions',
		'criiez',
		'criiaient',
		'criant',
		'crié'
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
			(message.content.toLowerCase().includes('cri') || message.content.toLowerCase().includes('cry'))
		) {
			const words = splitWords(message.content);
			for (const word of words) {
				// iterate over the words and their index in the message text
				const index = Math.max(word.indexOf('cri'), word.indexOf('cry'));
				if (index !== -1) {
					// if word includes "cri" or "cry"
					if (!this.blacklist.includes(word)) {
						// +3 to get beyond the "cri" or "cry"
						const wordToReply = word.slice(index + 3);
						if (wordToReply.length > 4 && wordToReply.length < 12) {
							// replies with the uppercase message
							return message.reply({ content: bold(wordToReply).toUpperCase(), allowedMentions: { repliedUser: false } });
						}
					}
				}
			}
		}
		return null;
	}
}
