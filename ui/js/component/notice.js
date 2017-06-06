import React from 'react';

export class Notice extends React.Component {
	static propTypes = {
		isError: React.PropTypes.bool
	};

	static defaultProps = {
		isError: false
	};

	render() {
		return (
			<section
				className={
					'notice ' +
					(this.props.isError ? 'notice--error ' : '') +
					(this.props.className || '')
				}
			>
				{this.props.children}
			</section>
		);
	}
}

export default Notice;
