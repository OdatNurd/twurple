import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelRewardEventData } from '../events/EventSubChannelRewardEvent';
import { EventSubChannelRewardEvent } from '../events/EventSubChannelRewardEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelRewardUpdateSubscription extends EventSubSubscription<EventSubChannelRewardEvent> {
	constructor(
		handler: (data: EventSubChannelRewardEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _rewardId?: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward.update.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRewardEventData): EventSubChannelRewardEvent {
		return new EventSubChannelRewardEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		if (this._rewardId) {
			return await this._client._apiClient.eventSub.subscribeToChannelRewardUpdateEventsForReward(
				this._userId,
				this._rewardId,
				await this._getTransportOptions()
			);
		} else {
			return await this._client._apiClient.eventSub.subscribeToChannelRewardUpdateEvents(
				this._userId,
				await this._getTransportOptions()
			);
		}
	}
}
