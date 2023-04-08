import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate'
		});
	}

	public run(message: Message): Promise<Message> | null {
		if (message.channel.id !== process.env.SERIOUS_CATEGORY && message.content.toLowerCase().includes('quoi')) {
			return message.reply({ content: 'feur', allowedMentions: { repliedUser: false } });
		}
		return null;
	}
}
