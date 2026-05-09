import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	const port = Number(process.env.API_PORT ?? 3000);

	await app.listen(port, '0.0.0.0');

	console.log(`API is running on http://localhost:${port}/api`);
}

bootstrap().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
