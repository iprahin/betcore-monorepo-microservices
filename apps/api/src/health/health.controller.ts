import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
	@Get('live')
	live() {
		return {
			status: 'ok',
			service: 'api',
			check: 'live',
			timestamp: new Date().toISOString(),
		};
	}

	@Get('ready')
	ready() {
		return {
			status: 'ok',
			service: 'api',
			check: 'ready',
			dependencies: {
				http: 'ok',
			},
			timestamp: new Date().toISOString(),
		};
	}
}
