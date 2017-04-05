import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withMediaProps } from 'react-media-player';


class BotNotTitle extends React.Component {
	constructor(props) {
		super(props);
	}

  renderBot() {
		return (<div className="">
			<p className="bot">Bot? </p>
		</div>);
  }

  renderNot() {
    return (<div className="">
			<p className="not"> Or Not? </p>
		</div>);
  }
  renderBoth() {
    return (<div className="">
			<p className="bot"> Bot? </p> <p className="not"> Or Not? </p>
		</div>);
  }



  render() {
      if (!this.props.isVideo) {
        title = this.renderBoth();
      }
      else if (Math.floor(this.props.media.currentTime / 3) % 2 == 0) {
        title = this.renderBot() 
      } else {
        title =  this.renderNot();
      }
      return ( <div className="centerText">
        {title}
        <div className="home-abt">Blurring the line between <span className="bot">A.I.</span> and <span className="not">Humans</span></div>
        <a className="btn custom-btn home-btn" href='/chat'>
          Start Chatting</a>
        </div>);
	}
}
BotNotTitle.PropTypes = {
  isVideo : React.PropTypes.Boolean
}
export default withMediaProps(BotNotTitle);
