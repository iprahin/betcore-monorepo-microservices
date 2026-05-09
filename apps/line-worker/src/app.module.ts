import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { SportsModule } from './sports/sports.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		HealthModule,
		SportsModule,
	],
})
export class AppModule {}
