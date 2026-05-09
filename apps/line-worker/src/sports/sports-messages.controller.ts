import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { SPORTS_PATTERNS } from '@betcore/contracts';
import type { SportDto, SportsSyncRequestedEvent } from '@betcore/contracts';
import type { Channel, ConsumeMessage } from 'amqplib';

type TypedRmqContext = {
	channel: Channel;
	message: ConsumeMessage;
};

function getTypedRmqContext(context: RmqContext): TypedRmqContext {
	const channelRef: unknown = context.getChannelRef();
	const originalMessage: unknown = context.getMessage();

	return {
		channel: channelRef as Channel,
		message: originalMessage as ConsumeMessage,
	};
}

@Controller()
export class SportsMessagesController {
	private readonly logger = new Logger(SportsMessagesController.name);

	@MessagePattern(SPORTS_PATTERNS.LIST_REQUEST)
	listSports(@Ctx() context: RmqContext): SportDto[] {
		const { channel, message } = getTypedRmqContext(context);

		try {
			const result: SportDto[] = [
				{
					key: 'soccer_epl',
					title: 'Premier League',
					description: 'English Premier League',
					active: true,
					hasOutrights: false,
				},
				{
					key: 'basketball_nba',
					title: 'NBA',
					description: 'National Basketball Association',
					active: true,
					hasOutrights: false,
				},
			];

			channel.ack(message);

			return result;
		} catch (error) {
			channel.nack(message, false, true);
			throw error;
		}
	}

	@EventPattern(SPORTS_PATTERNS.SYNC_REQUESTED)
	handleSportsSyncRequested(
		@Payload() payload: SportsSyncRequestedEvent,
		@Ctx() context: RmqContext,
	): void {
		const { channel, message } = getTypedRmqContext(context);

		try {
			this.logger.log({
				event: SPORTS_PATTERNS.SYNC_REQUESTED,
				payload,
				message: 'Sports sync requested',
			});

			channel.ack(message);
		} catch (error) {
			channel.nack(message, false, true);
			throw error;
		}
	}
}
