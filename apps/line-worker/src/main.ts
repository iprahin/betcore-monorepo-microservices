import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('LineWorkerBootstrap');

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL ?? 'amqp://sportsbook:sportsbook@localhost:5672'],
			queue: process.env.SPORTS_QUEUE ?? 'sports.queue',
			queueOptions: {
				durable: true,
			},
			noAck: false,
		},
	});

	const port = Number(process.env.LINE_WORKER_HEALTH_PORT ?? 3001);

	await app.listen(port, '0.0.0.0');

	logger.log(`Line worker health is running on http://0.0.0.0:${port}`);

	await app.startAllMicroservices();

	logger.log('Line worker RMQ microservice is running');
}

bootstrap().catch((error: unknown) => {
	logger.error(
		'Line worker failed to start',
		error instanceof Error ? error.stack : String(error),
	);

	process.exit(1);
});
