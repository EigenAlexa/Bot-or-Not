import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import BugReport from '/imports/ui/components/BugReport.jsx';
import { Button, Modal } from 'react-bootstrap';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.reportBug = this.reportBug.bind(this);
    this.closeBug = this.closeBug.bind(this);
  }

	renderModal(title,modalChild) {
    return (
      <Modal show={true} backdrop='static' className="bugModal" >
        <Modal.Header> 
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalChild}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeBug}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
	}

  reportBug() {
    Session.set('showBugModal', true);
  }

  closeBug() {
    Session.set('showBugModal', false);
  }

  socialLinks() {
    return (
      <div className="columns">
        <div className="share-buttons">
          <a className="large btn fb-share" href="http://www.facebook.com/botornot.ml" target="_blank"><i className="fa fa-facebook"></i></a>
          <a className="large btn tw-share" href="http://twitter.com/botornot_ml" target="_blank"><i className="fa fa-twitter"></i></a>
          <a className="large btn tw-share" href="mailto:botornot.ml@gmail.com"><i className="fa fa-envelope"></i></a>
        </div>
      </div>
    );
  }
  desktopLinks() {
    return (
      <div>
        <div className="columns links">
          <a href="/privacy">Privacy policy</a>
        </div>
        <div className="columns links">
          <a onClick={this.reportBug}>Report a Bug</a>
        </div>
        <div className="columns">
            <span>© 2017 BotOrNot - All Rights Reserved</span>
        </div>
      </div>
    );
  }
  render() {
    return ( 
			<footer className={this.props.isHome ? "footer-lower footer-home" : "footer-lower align-container"} id="footer">
					<div className="row">
            {this.socialLinks()}
            
            {!this.props.isMobile ? this.desktopLinks() : ""}
            { this.props.showBugReport ? this.renderModal('Report a Bug', <BugReport submitHook={this.closeBug.bind(this)}/>) : ""}
					</div>
			</footer>
		);
	}
}

export default createContainer(() => {
  FlowRouter.watchPathChange();
  const routeName = FlowRouter.getRouteName();
  const lastRoute = Session.get('lastRoute');
  const isHome = routeName === 'home' || (routeName === 'logout' && lastRoute === 'home');
  const isMobile = window.innerWidth < 450;
  return {
    showBugReport : Session.get('showBugModal'),
    isMobile,
    isHome
  }
}, Footer);
