import * as types from 'constants/action_types';
import lbry from 'lbry';
import lbryio from 'lbryio';
import rewards from 'rewards';

export function doFetchRewards() {
	return function(dispatch, getState) {
		const state = getState();

		dispatch({
			type: types.FETCH_REWARDS_STARTED
		});

		lbryio.call('reward', 'list', {}).then(function(userRewards) {
			dispatch({
				type: types.FETCH_REWARDS_COMPLETED,
				data: { userRewards }
			});
		});
	};
}

export function doClaimReward(rewardType) {
	return function(dispatch, getState) {
		try {
			rewards.claimReward(rewards[rewardType]);
			dispatch({
				type: types.REWARD_CLAIMED,
				data: {
					reward: rewards[rewardType]
				}
			});
		} catch (err) {}
	};
}
