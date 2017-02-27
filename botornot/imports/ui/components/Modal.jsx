import React from 'react';

export class ControlledModal extends  React.Component {
  render () {
		console.log('can close this modal', this.props.canClose);
    return (
      <div>
        <Modal
          isOpen={ this.props.isOpen }
          close={ this.props.closeModal }
          title={ this.props.title }>
					{this.props.children}
          {this.props.canClose ? <button onClick={ this.props.closeModal }>Click Here to Close</button> : ""}
        </Modal>
      </div>
    );
  }
};

ControlledModal.propTypes = {
	canClose : React.PropTypes.bool,
}	