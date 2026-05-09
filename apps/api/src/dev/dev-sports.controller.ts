import { Controller, Get, Inject, Post } from '@nestjs/common';
import { SPORTS_RMQ_CLIENT } from '../messaging/rabbitmq-client.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SportDto, SPORTS_PATTERNS, SportsSyncRequestedEvent } from '@betcore/contracts';

@Controller('dev/sports')
export class DevSportsController {
	constructor(
		@Inject(SPORTS_RMQ_CLIENT)
		private readonly sportsClient: ClientProxy,
	) {}

	@Get('request')
	async requestSports(): Promise<SportDto[]> {
		return firstValueFrom(
			this.sportsClient.send<SportDto[], Record<string, never>>(
				SPORTS_PATTERNS.LIST_REQUEST,
				{},
			),
		);
	}

	@Post('sync')
	syncSports() {
		const event: SportsSyncRequestedEvent = {
			requestedAt: new Date().toISOString(),
			requestedBy: 'developer',
		};

		this.sportsClient.emit(SPORTS_PATTERNS.SYNC_REQUESTED, event);

		return {
			accepted: true,
			event: SPORTS_PATTERNS.SYNC_REQUESTED,
			timestamp: new Date().toISOString(),
		};
	}
}
