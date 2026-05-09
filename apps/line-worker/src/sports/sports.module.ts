import { Module } from '@nestjs/common';
import { SportsMessagesController } from './sports-messages.controller';

@Module({
	controllers: [SportsMessagesController],
})
export class SportsModule {}
