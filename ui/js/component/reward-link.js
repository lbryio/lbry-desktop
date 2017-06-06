import React from 'react';
import lbry from 'lbry';
import { Icon } from 'component/common';
import Modal from 'component/modal';
import rewards from 'rewards';
import Link from 'component/link';

export class RewardLink extends React.Component {
	static propTypes = {
		type: React.PropTypes.string.isRequired,
		claimed: React.PropTypes.bool,
		onRewardClaim: React.PropTypes.func,
		onRewardFailure: React.PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			claimable: true,
			pending: false,
			errorMessage: null
		};
	}

	refreshClaimable() {
		switch (this.props.type) {
			case 'new_user':
				this.setState({ claimable: true });
				return;

			case 'first_publish':
				lbry.claim_list_mine().then(list => {
					this.setState({
						claimable: list.length > 0
					});
				});
				return;
		}
	}

	componentWillMount() {
		this.refreshClaimable();
	}

	claimReward() {
		this.setState({
			pending: true
		});

		rewards
			.claimReward(this.props.type)
			.then(reward => {
				this.setState({
					pending: false,
					errorMessage: null
				});
				if (this.props.onRewardClaim) {
					this.props.onRewardClaim(reward);
				}
			})
			.catch(error => {
				this.setState({
					errorMessage: error.message,
					pending: false
				});
			});
	}

	clearError() {
		if (this.props.onRewardFailure) {
			this.props.onRewardFailure();
		}
		this.setState({
			errorMessage: null
		});
	}

	render() {
		return (
			<div className="reward-link">
				{this.props.claimed
					? <span><Icon icon="icon-check" /> {__('Reward claimed.')}</span>
					: <Link
							button={this.props.button ? this.props.button : 'alt'}
							disabled={this.state.pending || !this.state.claimable}
							label={
								this.state.pending ? __('Claiming...') : __('Claim Reward')
							}
							onClick={() => {
								this.claimReward();
							}}
						/>}
				{this.state.errorMessage
					? <Modal
							isOpen={true}
							contentLabel={__('Reward Claim Error')}
							className="error-modal"
							onConfirmed={() => {
								this.clearError();
							}}
						>
							{this.state.errorMessage}
						</Modal>
					: ''}
			</div>
		);
	}
}
