import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({})
export class QuoiEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate'
		});
	}

	public run(message: Message): Promise<Message> | null {
		const words = message.content
			.toLowerCase()
			.split(' ')
			.map((word) => word.replace(/^[`!?\.,\(\)\[\]\{\};:'"\/]+|[`!?\.,\(\)\[\]\{\};:'"\/]+$/g, ''));
		if (
			(message.channel as TextChannel).parent?.id !== process.env.SERIOUS_CATEGORY &&
			message.author.id !== process.env.CLIENT_ID &&
			words.some((word) => ['quoi', 'koi', 'kois', 'quoient', 'koient'].includes(word))
		) {
			return message.reply({ content: 'feur', allowedMentions: { repliedUser: false } });
		} else if (
			(message.channel as TextChannel).parent?.id !== process.env.SERIOUS_CATEGORY &&
			message.author.id !== process.env.CLIENT_ID &&
			words.includes('pourquoi')
		) {
			return message.reply({ content: 'Parce que feur', allowedMentions: { repliedUser: false } });
		}
		return null;
	}
}
