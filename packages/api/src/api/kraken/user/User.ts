import { Enumerable } from '@d-fischer/shared-utils';
import type { UserIdResolvable, UserIdResolvableType, UserNameResolveableType } from '@twurple/common';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { NoSubscriptionProgramError } from '../../../Errors/NoSubscriptionProgramError';
import type { Channel } from '../channel/Channel';
import { ChannelPlaceholder } from '../channel/ChannelPlaceholder';
import type { EmoteSetList } from '../channel/EmoteSetList';
import type { Stream } from '../stream/Stream';
import type { UserFollow } from './UserFollow';
import type { UserSubscription } from './UserSubscription';

/** @private */
export interface UserData {
	_id: string;
	bio: string;
	created_at: string;
	name: string;
	display_name: string;
	logo: string;
	type: string;
	updated_at: string;
}

/**
 * A Twitch user.
 */
@rtfm<User>('api', 'User', 'id')
export class User extends DataObject<UserData> implements UserIdResolvableType, UserNameResolveableType {
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: UserData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/** @private */
	get cacheKey(): string {
		return this[rawDataSymbol]._id;
	}

	/**
	 * The ID of the user.
	 */
	get id(): string {
		return this[rawDataSymbol]._id;
	}

	/**
	 * The bio of the user.
	 */
	get bio(): string {
		return this[rawDataSymbol].bio;
	}

	/**
	 * The date when the user was created, i.e. when they registered on Twitch.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The last date when the user changed anything in their profile, e.g. their description or their profile picture.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].updated_at);
	}

	/**
	 * The name of the user.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * The URL to the profile picture of the user.
	 */
	get logoUrl(): string {
		return this[rawDataSymbol].logo;
	}

	/**
	 * The type of the user.
	 */
	get type(): string {
		return this[rawDataSymbol].type;
	}

	/**
	 * Retrieves the channel data of the user.
	 */
	async getChannel(): Promise<Channel> {
		return await this._client.kraken.channels.getChannel(this);
	}

	/**
	 * Gets a channel placeholder object for the user, which can do anything you can do to a channel with just the ID.
	 */
	getChannelPlaceholder(): ChannelPlaceholder {
		return new ChannelPlaceholder({ _id: this[rawDataSymbol]._id }, this._client);
	}

	/**
	 * Retrieves the currently running stream of the user.
	 */
	async getStream(): Promise<Stream | null> {
		return await this.getChannelPlaceholder().getStream();
	}

	/**
	 * Retrieves the subscription data for the user to the given channel.
	 *
	 * Throws if the channel doesn't have a subscription program or the user is not subscribed to it.
	 *
	 * This method requires access to the user. If you only have access to the channel,
	 * use {@ChannelPlaceholder#getSubscriptionBy} instead.
	 *
	 * @param channel The channel you want to get the subscription data for.
	 */
	async getSubscriptionTo(channel: UserIdResolvable): Promise<UserSubscription | null> {
		return await this._client.kraken.users.getSubscriptionData(this, channel);
	}

	/**
	 * Checks whether the user is subscribed to the given channel.
	 *
	 * @param channel The channel you want to check the subscription for.
	 */
	async isSubscribedTo(channel: UserIdResolvable): Promise<boolean> {
		try {
			return (await this.getSubscriptionTo(channel)) !== null;
		} catch (e) {
			if (e instanceof NoSubscriptionProgramError) {
				return false;
			}

			throw e;
		}
	}

	/**
	 * Retrieves a list of channels followed by the user.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderBy The field to order by.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
	async getFollows(
		page?: number,
		limit?: number,
		orderBy?: 'created_at' | 'last_broadcast' | 'login',
		orderDirection?: 'asc' | 'desc'
	): Promise<UserFollow[]> {
		return await this._client.kraken.users.getFollowedChannels(this, page, limit, orderBy, orderDirection);
	}

	/**
	 * Retrieves the follow data of the user to a given channel.
	 *
	 * @param channel The channel to retrieve the follow data for.
	 */
	async getFollowTo(channel: UserIdResolvable): Promise<UserFollow | null> {
		return await this._client.kraken.users.getFollowedChannel(this, channel);
	}

	/**
	 * Checks whether the user is following the given channel.
	 *
	 * @param channel The channel to check for the user's follow.
	 */
	async follows(channel: UserIdResolvable): Promise<boolean> {
		try {
			return (await this.getFollowTo(channel)) !== null;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * Retrieves the emotes the user can use.
	 */
	async getEmotes(): Promise<EmoteSetList> {
		return await this._client.kraken.users.getUserEmotes(this);
	}
}
