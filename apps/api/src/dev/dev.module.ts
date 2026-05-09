import { Module } from '@nestjs/common';
import { DevSportsController } from './dev-sports.controller';
import { RabbitMqClientModule } from '../messaging/rabbitmq-client.module';

@Module({
	imports: [RabbitMqClientModule],
	controllers: [DevSportsController],
})
export class DevModule {}
