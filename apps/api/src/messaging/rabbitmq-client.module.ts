import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const SPORTS_RMQ_CLIENT = Symbol('SPORTS_RMQ_CLIENT');

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: SPORTS_RMQ_CLIENT,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
						queue: configService.getOrThrow<string>('SPORTS_QUEUE'),
						queueOptions: {
							durable: true,
						},
					},
				}),
			},
		]),
	],
	exports: [ClientsModule],
})
export class RabbitMqClientModule {}
