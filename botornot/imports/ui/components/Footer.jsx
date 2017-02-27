import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Meteor } from 'meteor/meteor';

var Footer = React.createClass({
  render: function() {
    return ( 
			<footer className="footer-lower" id="footer">
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
					</div>
			</footer>
		);
	}
});

export default Footer;