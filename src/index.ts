import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Logger } from '@sapphire/plugin-logger';
import '@sapphire/plugin-logger/register';
import { GatewayIntentBits, REST, Routes } from 'discord.js';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { redisClient } from './lib/redis';

const client = new SapphireClient({
	caseInsensitiveCommands: true,
	logger: {
		instance: new Logger({ level: LogLevel.Debug })
	},
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
	loadMessageCommandListeners: true,
	tasks: {
		strategy: new ScheduledTaskRedisStrategy({
			bull: {
				connection: redisClient
			}
		})
	}
});

const main = async () => {
	try {
		const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);
		rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands.'))
			.catch(console.error);
		rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);
		client.logger.info('Logging in');
		await client.login(process.env.DISCORD_TOKEN);
		client.logger.info('Logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main().catch((error) => {
	client.logger.fatal(error);
	client.destroy();
	process.exit(1);
});
