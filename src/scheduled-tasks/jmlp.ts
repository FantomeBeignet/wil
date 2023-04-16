import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import axios from 'axios';
import { load } from 'cheerio';
import type { TextChannel } from 'discord.js';

export class JMLPTask extends ScheduledTask {
	public constructor(context: ScheduledTask.Context, options: ScheduledTask.Options) {
		super(context, {
			...options,
			name: 'JMLP',
			pattern: '0 8,12,20 * * *'
		});
	}

	public async run() {
		const page = await axios.get('https://estcequejeanmarielepenestmort.info/');
		const pageText = page.data;
		const $ = load(pageText);
		const text = $('body > div > p').text();

		const { client } = this.container;
		const channel = client.channels.cache.get(process.env.JMLP_CHANNEL as string) as TextChannel;
		const message = await channel.send({ content: text });
		await message.crosspost();
		this.container.logger.info('Ran JMLP task');
	}
}
