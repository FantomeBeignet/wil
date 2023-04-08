import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildEmoji, Message, MessageReaction, TextChannel } from 'discord.js';
import { isTextChannel } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class QuoiEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate'
		});
	}

	public run(message: Message): Promise<Message | MessageReaction> | Promise<void> | undefined | null {
		if ((message.channel as TextChannel).parent?.id !== process.env.SERIOUS_CATEGORY && message.author.id !== process.env.CLIENT_ID) {
			const { content, mentions } = message;
			const words = content.toLowerCase().split(' ');
			if (words.includes('ratio')) return this.react(message, 'ratio');
			if (words.includes('cheh')) return this.react(message, 'orge');
			if (words.includes('titre')) return this.react(message, 'titre');
			if (mentions.roles.has('1028963968309526618')) return message.react('🤝');
			if (mentions.roles.has('1028958078101631046'))
				return message.reply({ content: 'Mais qui est William ?', allowedMentions: { repliedUser: false } });
			if (mentions.roles.has('1029027447318003764')) return this.react(message, 'orge');
		}
		return null;
	}

	private react(message: Message, emojiName: string) {
		const emote = message.guild?.emojis.cache.find((emoji: GuildEmoji) => emoji.name === emojiName) as GuildEmoji;
		const messageId = message.reference?.messageId as string;
		if (!isTextChannel(message.channel)) return;
		return message.channel.messages.fetch(messageId).then(async (msg: Message) => {
			await msg.react(emote);
		});
	}
}
