import type { MakeOptional } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { PubSubBasicMessageInfo } from './PubSubMessage';

/** @private */
export interface PubSubBitsMessageBadgeEntitlement {
	previous_version: number;
	new_version: number;
}

/** @private */
export interface PubSubBitsMessageContent
	extends MakeOptional<PubSubBasicMessageInfo, 'channel_id' | 'channel_name' | 'user_id' | 'user_name'> {
	chat_message: string;
	bits_used: number;
	total_bits_used: number;
	context: 'cheer';
	badge_entitlement: PubSubBitsMessageBadgeEntitlement | null;
	is_anonymous: boolean;
}

/** @private */
export interface PubSubBitsMessageData {
	data: PubSubBitsMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

/**
 * A message that informs about bits being used in a channel.
 */
@rtfm<PubSubBitsMessage>('pubsub', 'PubSubBitsMessage', 'userId')
export class PubSubBitsMessage extends DataObject<PubSubBitsMessageData> {
	/**
	 * The ID of the user that sent the bits.
	 */
	get userId(): string | undefined {
		return this[rawDataSymbol].data.user_id;
	}

	/**
	 * The name of the user that sent the bits.
	 */
	get userName(): string | undefined {
		return this[rawDataSymbol].data.user_name;
	}

	/**
	 * The full message that was sent with the bits.
	 */
	get message(): string {
		return this[rawDataSymbol].data.chat_message;
	}

	/**
	 * The number of bits that were sent.
	 */
	get bits(): number {
		return this[rawDataSymbol].data.bits_used;
	}

	/**
	 * The total number of bits that were ever sent by the user in the channel.
	 */
	get totalBits(): number {
		return this[rawDataSymbol].data.total_bits_used;
	}

	/**
	 * Whether the cheer was anonymous.
	 */
	get isAnonymous(): boolean {
		return this[rawDataSymbol].data.is_anonymous;
	}
}
