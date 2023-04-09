import axios from 'axios';
import { load } from 'cheerio';
import { EmbedBuilder } from 'discord.js';
import { redisClient } from './redis';

export async function makeRegularMadameEmbed() {
	const page = await axios.get('https://www.bonjourmadame.fr/');
	const pageText = page.data;
	const $ = load(pageText);
	const img = $('div.post-content img');
	if (img.attr('src') === (await redisClient.get('lastmadame'))) return null;
	await redisClient.set('lastmadame', img.attr('src') as string);
	const title = $('h1.post-title > a').text();
	const source = $('div.post-content > p > a').attr('href');
	const embed = new EmbedBuilder()
		.setAuthor({
			name: 'Bonjour Madame !',
			iconURL: 'https://i0.wp.com/bonjourmadame.fr/wp-content/uploads/2018/12/cropped-favicon.jpg?fit=32%2C32&ssl=1',
			url: source ?? 'https://bonjourmadame.fr'
		})
		.setDescription(title)
		.setImage(img.attr('src') ?? null)
		.setFooter({ text: 'Powered by bonjourmadame.fr' });
	return embed;
}

export async function makeWeekendMadameEmbed() {
	const json = await axios.get('https://www.reddit.com/r/eroticbutnotporn/hot.json?limit=1');
	const img = json.data.data.children[0].data.url;
	const { title } = json.data.data.children[0].data;
	const source = `https://reddit.com${json.data.data.children[0].data.permalink}`;
	if (source === (await redisClient.get('lastmadame'))) return null;
	await redisClient.set('lastmadame', source);
	const embed = new EmbedBuilder()
		.setAuthor({
			name: 'Bonjour Madame !',
			iconURL: 'https://i0.wp.com/bonjourmadame.fr/wp-content/uploads/2018/12/cropped-favicon.jpg?fit=32%2C32&ssl=1',
			url: source ?? 'https://bonjourmadame.fr'
		})
		.setDescription(title)
		.setImage(img ?? null)
		.setFooter({ text: 'Powered by r/EroticButNotPorn' });
	return embed;
}
