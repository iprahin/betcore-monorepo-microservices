export const SPORTS_PATTERNS = {
	LIST_REQUEST: 'sports.list.request',
	SYNC_REQUESTED: 'sports.sync.requested',
} as const;

export type SportsSyncRequestedEvent = {
	requestedAt: string;
	requestedBy: 'system' | 'admin' | 'developer';
};
