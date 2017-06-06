import React from 'react';
import lbryio from 'lbryio';
import { CreditAmount, Icon } from 'component/common.js';
import SubHeader from 'component/subHeader';
import { RewardLink } from 'component/reward-link';

export class RewardTile extends React.Component {
	static propTypes = {
		type: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		description: React.PropTypes.string.isRequired,
		claimed: React.PropTypes.bool.isRequired,
		value: React.PropTypes.number.isRequired,
		onRewardClaim: React.PropTypes.func
	};

	render() {
		return (
			<section className="card">
				<div className="card__inner">
					<div className="card__title-primary">
						<CreditAmount amount={this.props.value} />
						<h3>{this.props.title}</h3>
					</div>
					<div className="card__actions">
						{this.props.claimed
							? <span><Icon icon="icon-check" /> {__('Reward claimed.')}</span>
							: <RewardLink {...this.props} />}
					</div>
					<div className="card__content">{this.props.description}</div>
				</div>
			</section>
		);
	}
}

export class RewardsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userRewards: null,
			failed: null
		};
	}

	componentWillMount() {
		this.loadRewards();
	}

	loadRewards() {
		lbryio.call('reward', 'list', {}).then(
			userRewards => {
				this.setState({
					userRewards: userRewards
				});
			},
			() => {
				this.setState({ failed: true });
			}
		);
	}

	render() {
		return (
			<main className="main--single-column">
				<SubHeader />
				<div>
					{!this.state.userRewards
						? this.state.failed
							? <div className="empty">{__('Failed to load rewards.')}</div>
							: ''
						: this.state.userRewards.map(
								({
									reward_type,
									reward_title,
									reward_description,
									transaction_id,
									reward_amount
								}) => {
									return (
										<RewardTile
											key={reward_type}
											onRewardClaim={this.loadRewards}
											type={reward_type}
											title={__(reward_title)}
											description={__(reward_description)}
											claimed={!!transaction_id}
											value={reward_amount}
										/>
									);
								}
							)}
				</div>
			</main>
		);
	}
}

export default RewardsPage;
