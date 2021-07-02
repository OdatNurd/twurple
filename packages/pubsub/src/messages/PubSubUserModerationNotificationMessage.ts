import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

export type PubSubUserModerationNotificationMessageStatus = 'PENDING' | 'ALLOWED' | 'DENIED' | 'EXPIRED';

/** @private */
export interface PubSubUserModerationNotificationMessageContent {
	message_id: string;
	status: PubSubUserModerationNotificationMessageStatus;
}

/** @private */
export interface PubSubUserModerationNotificationMessageData {
	type: 'automod_caught_message';
	data: PubSubUserModerationNotificationMessageContent;
}

/**
 * A message that informs about a moderation action on your message..
 */
@rtfm<PubSubUserModerationNotificationMessage>('pubsub', 'PubSubUserModerationNotificationMessage', 'messageId')
export class PubSubUserModerationNotificationMessage extends DataObject<PubSubUserModerationNotificationMessageData> {
	/** @private */
	constructor(data: PubSubUserModerationNotificationMessageData, private readonly _channelId: string) {
		super(data);
	}

	/**
	 * The ID of the channel where the message was posted.
	 */
	get channelId(): string {
		return this._channelId;
	}

	/**
	 * The ID of the message.
	 */
	get messageId(): string {
		return this[rawDataSymbol].data.message_id;
	}

	/**
	 * The status of the queue entry.
	 */
	get status(): PubSubUserModerationNotificationMessageStatus {
		return this[rawDataSymbol].data.status;
	}
}
