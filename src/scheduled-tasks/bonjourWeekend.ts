import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { TextChannel } from 'discord.js';
import { makeWeekendMadameEmbed } from '../lib/bonjourMadame';

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
