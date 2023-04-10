import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { TextChannel } from 'discord.js';
import { makeRegularMadameEmbed, makeWeekendMadameEmbed } from '../lib/bonjourMadame';

export class ManualMadameTask extends ScheduledTask {
	public constructor(context: ScheduledTask.Context, options: ScheduledTask.Options) {
		super(context, options);
	}

	public async run(payload: unknown) {
		if (payload === 'regular') {
			const embed = await makeRegularMadameEmbed();
			const { client } = this.container;
			const channel = client.channels.cache.get(process.env.MADAME_CHANNEL as string) as TextChannel;
			if (!embed) {
				this.container.logger.info('Postponing Bonjour Madame regular task');
				this.container.tasks.create('manual', 'regular', 600_000);
				return;
			}
			const message = await channel.send({ embeds: [embed] });
			await message.crosspost();
		} else if (payload === 'weekend') {
			const embed = await makeWeekendMadameEmbed();
			const { client } = this.container;
			const channel = client.channels.cache.get(process.env.MADAME_CHANNEL as string) as TextChannel;
			if (!embed) {
				this.container.logger.info('Postponing Bonjour Madame weekend task');
				this.container.tasks.create('manual', 'weekend', 600_000);
				return;
			}
			const message = await channel.send({ embeds: [embed] });
			await message.crosspost();
		}
		this.container.logger.info('Ran manual Bonjour Madame task');
	}
}

export class RegularMadameTask extends ScheduledTask {
	public constructor(context: ScheduledTask.Context, options: ScheduledTask.Options) {
		super(context, {
			...options,
			pattern: '30 10 * * 1-5'
		});
	}

	public async run() {
		const embed = await makeRegularMadameEmbed();
		const { client } = this.container;
		const channel = client.channels.cache.get(process.env.MADAME_CHANNEL as string) as TextChannel;
		if (!embed) {
			this.container.logger.info('Postponing Bonjour Madame regular task');
			this.container.tasks.create('manual', 'regular', 600_000);
			return;
		}
		const message = await channel.send({ embeds: [embed] });
		await message.crosspost();
		this.container.logger.info('Ran Bonjour Madame regular task');
	}
}

export class WeekendMadameTask extends ScheduledTask {
	public constructor(context: ScheduledTask.Context, options: ScheduledTask.Options) {
		super(context, {
			...options,
			pattern: '30 10 * * 0,6'
		});
	}

	public async run() {
		const embed = await makeWeekendMadameEmbed();
		const { client } = this.container;
		const channel = client.channels.cache.get(process.env.MADAME_CHANNEL as string) as TextChannel;
		if (!embed) {
			this.container.logger.info('Postponing Bonjour Madame weekend task');
			this.container.tasks.create('manual', 'weekend', 600_000);
			return;
		}
		const message = await channel.send({ embeds: [embed] });
		await message.crosspost();
		this.container.logger.info('Ran Bonjour Madame weenkend task');
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		manual: never;
		pattern: never;
	}
}
