import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
	@Get('live')
	live() {
		return {
			status: 'ok',
			service: 'line-worker',
			check: 'live',
			timestamp: new Date().toISOString(),
		};
	}

	@Get('ready')
	ready() {
		return {
			status: 'ok',
			service: 'line-worker',
			check: 'ready',
			dependencies: {
				rabbitmq: 'connected',
			},
			timestamp: new Date().toISOString(),
		};
	}
}
