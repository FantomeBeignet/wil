import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({})
export class CriEvent extends Listener {
	private conjugations = [
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
			for (const w of message.content.toLowerCase().split(' ')) {
				// iterate over the words and their index in the message text
				const word = w.replace(/[&\/\\#,+\-()$~%.'":*?<>{}]+$/g, '');
				const index = Math.max(word.indexOf('cri'), word.indexOf('cry'));
				if (index !== -1) {
					// if word includes "cri" or "cry"
					if (!this.conjugations.includes(word)) {
						const toReply = word.slice(index + 3);
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
