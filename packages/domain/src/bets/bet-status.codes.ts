export const BET_STATUS = {
	DRAFT: 10,
	PENDING: 20,
	WON: 30,
	LOST: 40,
	VOID: 50,
	CANCELLED: 60,
} as const;

export type BetStatusCode = (typeof BET_STATUS)[keyof typeof BET_STATUS];

export const BET_STATUS_LABEL: Record<BetStatusCode, string> = {
	[BET_STATUS.DRAFT]: 'draft',
	[BET_STATUS.PENDING]: 'pending',
	[BET_STATUS.WON]: 'won',
	[BET_STATUS.LOST]: 'lost',
	[BET_STATUS.VOID]: 'void',
	[BET_STATUS.CANCELLED]: 'cancelled',
};

export type FinalBetStatusCode =
	| typeof BET_STATUS.WON
	| typeof BET_STATUS.LOST
	| typeof BET_STATUS.VOID
	| typeof BET_STATUS.CANCELLED;

const FINAL_BET_STATUSES: readonly BetStatusCode[] = [
	BET_STATUS.WON,
	BET_STATUS.LOST,
	BET_STATUS.VOID,
	BET_STATUS.CANCELLED,
];

export function isFinalBetStatus(status: BetStatusCode): status is FinalBetStatusCode {
	return FINAL_BET_STATUSES.includes(status);
}
