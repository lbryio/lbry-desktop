import React from 'react';
import ReactModal from 'react-modal';

export class ModalPage extends React.Component {
	render() {
		return (
			<ReactModal
				onCloseRequested={this.props.onAborted || this.props.onConfirmed}
				{...this.props}
				className={(this.props.className || '') + ' modal-page'}
				overlayClassName="modal-overlay"
			>
				<div className="modal-page__content">
					{this.props.children}
				</div>
			</ReactModal>
		);
	}
}

export default ModalPage;
