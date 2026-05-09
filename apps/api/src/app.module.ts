import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DevModule } from './dev/dev.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		HealthModule,
		DevModule,
	],
})
export class AppModule {}
