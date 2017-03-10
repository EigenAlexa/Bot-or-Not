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
    console.log(Session.get('showBugModal'), typeof Session.get('showBugModal'));
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


  render() {
		is_home = FlowRouter.getRouteName() === 'home';
    return ( 
			<footer className={this.props.isHome ? "footer-lower footer-home" : "footer-lower"} id="footer">
					<div className="row">
							<div className="columns">
									<span>© 2017 BotOrNot - All Rights Reserved</span>
							</div>

							<div className="columns">
								<div className="share-buttons">
									<a className="large btn fb-share" href="http://www.facebook.com/botornot.ml" target="_blank"><i className="fa fa-facebook"></i></a>
									<a className="large btn tw-share" href="http://twitter.com/botornot_ml" target="_blank"><i className="fa fa-twitter"></i></a>
									<a className="large btn tw-share" href="mailto:botornot.ml@gmail.com"><i className="fa fa-envelope"></i></a>
								</div>
							</div>
              
              <div className="columns links">
                <a href="/privacy">Privacy policy</a>
              </div>
              <div className="columns links">
                <a href="/contact">Questions? Contact Us</a>
              </div>
              <div className="columns links">
                <a onClick={this.reportBug}>Report a Bug</a>
              </div>
              { this.props.showBugReport ? this.renderModal('Report a Bug', <BugReport submitHook={this.closeBug.bind(this)}/>) : ""}
                <button onClick={this.reportBug}>Report a Bug</button>
              </div>
					</div>
			</footer>
		);
	}
}

export default createContainer(() => {
  FlowRouter.watchPathChange();
  const isHome = FlowRouter.getRouteName() === 'home';
  return {
    showBugReport : Session.get('showBugModal'),
    isHome
  }
}, Footer);
