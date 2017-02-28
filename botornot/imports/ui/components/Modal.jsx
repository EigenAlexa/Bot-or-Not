import React from 'react';

export class ControlledModal extends  React.Component {
  render () {
    return (
      <div>
        <Modal
          isOpen={ this.props.isOpen }
          close={ this.props.closeModal }
          title={ this.props.title }>
					{this.props.children}
        </Modal>
      </div>
    );
  }
};

ControlledModal.propTypes = {
	canClose : React.PropTypes.bool,
}	
