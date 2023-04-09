import { ChatInputCommand, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { makeQuoteEmbed } from '../lib/utils';
import type { TextChannel } from 'discord.js';

@ApplyOptions<Command.Options>({
	name: 'quote',
	description: "C'est ici le vrai Mini Tel'"
})
export class QuoteCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('author').setDescription("L'auteur de la dingz").setRequired(true))
				.addStringOption((option) => option.setName('content').setDescription('La dingz en question').setRequired(true))
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const author = interaction.options.getUser('author');
		const content = interaction.options.getString('content')!;
		const usedBy = interaction.user;
		const title = 'A dit :';
		const embed = makeQuoteEmbed(usedBy, title, author, content);
		const quoteChannel = interaction.guild?.channels.cache.get(process.env.QUOTE_CHANNEL as string) as TextChannel;
		await quoteChannel.send({ embeds: [embed] });
		await interaction.reply({
			content: 'Quote envoyée !',
			ephemeral: true
		});
	}
}

@ApplyOptions<Command.Options>({
	name: 'vu',
	description: 'Quand tu vois un truc (duh)'
})
export class VuCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('content').setDescription('La dingz vue').setRequired(true))
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const content = interaction.options.getString('content')!;
		const usedBy = interaction.user;
		const title = 'Vu :';
		const embed = makeQuoteEmbed(usedBy, title, null, content);
		const quoteChannel = interaction.guild?.channels.cache.get(process.env.QUOTE_CHANNEL as string) as TextChannel;
		await quoteChannel.send({ embeds: [embed] });
		await interaction.reply({
			content: 'Quote envoyée !',
			ephemeral: true
		});
	}
}

@ApplyOptions<Command.Options>({
	name: 'entendu',
	description: 'Quand tu entendu un truc (duh)'
})
export class EntenduCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('content').setDescription('La dingz entendue').setRequired(true))
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const content = interaction.options.getString('content')!;
		const usedBy = interaction.user;
		const title = 'Entendu :';
		const embed = makeQuoteEmbed(usedBy, title, null, content);
		const quoteChannel = interaction.guild?.channels.cache.get(process.env.QUOTE_CHANNEL as string) as TextChannel;
		await quoteChannel.send({ embeds: [embed] });
		await interaction.reply({
			content: 'Quote envoyée !',
			ephemeral: true
		});
	}
}

@ApplyOptions<Command.Options>({
	name: 'pasvu',
	description: 'Quand tu vois pas un truc (duh)'
})
export class PasVuCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('content').setDescription('La dingz pas vue').setRequired(true))
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const content = interaction.options.getString('content')!;
		const usedBy = interaction.user;
		const title = 'Pas vu :';
		const embed = makeQuoteEmbed(usedBy, title, null, content);
		const quoteChannel = interaction.guild?.channels.cache.get(process.env.QUOTE_CHANNEL as string) as TextChannel;
		await quoteChannel.send({ embeds: [embed] });
		await interaction.reply({
			content: 'Quote envoyée !',
			ephemeral: true
		});
	}
}

@ApplyOptions<Command.Options>({
	name: 'pasentendu',
	description: 'Quand tu entends pas un truc (duh)'
})
export class PasEntenduCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('content').setDescription('La dingz pas entendu').setRequired(true))
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const content = interaction.options.getString('content')!;
		const usedBy = interaction.user;
		const title = 'Pas entendu :';
		const embed = makeQuoteEmbed(usedBy, title, null, content);
		const quoteChannel = interaction.guild?.channels.cache.get(process.env.QUOTE_CHANNEL as string) as TextChannel;
		await quoteChannel.send({ embeds: [embed] });
		await interaction.reply({
			content: 'Quote envoyée !',
			ephemeral: true
		});
	}
}
