import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';
import type { HelixCustomReward } from './HelixCustomReward';

/**
 * The possible statuses of a custom Channel Points reward redemption you can set.
 */
export type HelixCustomRewardRedemptionTargetStatus = 'FULFILLED' | 'CANCELED';

/**
 * The possible statuses of a custom Channel Points reward redemption.
 */
export type HelixCustomRewardRedemptionStatus = 'UNFULFILLED' | HelixCustomRewardRedemptionTargetStatus;

/** @private */
export interface HelixCustomRewardRedemptionRewardData {
	id: string;
	title: string;
	prompt: string;
	cost: number;
}

/** @private */
export interface HelixCustomRewardRedemptionData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: HelixCustomRewardRedemptionStatus;
	redeemed_at: string;
	reward: HelixCustomRewardRedemptionRewardData;
}

/**
 * A redemption of a custom Channel Points reward.
 */
@rtfm<HelixCustomRewardRedemption>('api', 'HelixCustomRewardRedemption', 'id')
export class HelixCustomRewardRedemption extends DataObject<HelixCustomRewardRedemptionData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixCustomRewardRedemptionData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the redemption.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster where the reward was redeemed.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster where the reward was redeemed.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster where the reward was redeemed.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster where the reward was redeemed.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * The ID of the user that redeemed the reward.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user that redeemed the reward.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that redeemed the reward.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the user that redeemed the reward.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The text the user wrote when redeeming the reward.
	 */
	get userInput(): string {
		return this[rawDataSymbol].user_input;
	}

	/**
	 * Whether the redemption was fulfilled.
	 */
	get isFulfilled(): boolean {
		return this[rawDataSymbol].status === 'FULFILLED';
	}

	/**
	 * Whether the redemption was canceled.
	 */
	get isCanceled(): boolean {
		return this[rawDataSymbol].status === 'CANCELED';
	}

	/**
	 * The date and time when the reward was redeemed.
	 */
	get redemptionDate(): Date {
		return new Date(this[rawDataSymbol].redeemed_at);
	}

	/**
	 * The ID of the reward that was redeemed.
	 */
	get rewardId(): string {
		return this[rawDataSymbol].reward.id;
	}

	/**
	 * Retrieves more info about the reward that was redeemed.
	 */
	async getReward(): Promise<HelixCustomReward> {
		return (await this._client.channelPoints.getCustomRewardById(
			this[rawDataSymbol].broadcaster_id,
			this[rawDataSymbol].reward.id
		))!;
	}

	/**
	 * The title of the reward that was redeemed.
	 */
	get rewardTitle(): string {
		return this[rawDataSymbol].reward.title;
	}

	/**
	 * The prompt of the reward that was redeemed.
	 */
	get rewardPrompt(): string {
		return this[rawDataSymbol].reward.prompt;
	}

	/**
	 * The cost of the reward that was redeemed.
	 */
	get rewardCost(): number {
		return this[rawDataSymbol].reward.cost;
	}
}
