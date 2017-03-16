import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withMediaProps } from 'react-media-player';


class BotNotTitle extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {
		// 	btIdx : 0,
		//   lastTime : 0.0,
		// };
		// this.updateBotTimeIndex = this.updateBotTimeIndex.bind(this);
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

	// updateBotTimeIndex() {
	// 	console.log('updating bot time Index');
	// 	// should only be called only on ShouldComponentUpdate
	// 	this.setState({lastTime : this.props.media.currentTime});
	// 	if (btIdx + 1 >= this.props.bnSwitch.length()) {
	// 		this.setState({btIdx : 0});
	// 	} else {
	// 		this.setState({btIdx : this.state.btIdx + 1});
	// 	}
	// }

  render() {
		if (Math.floor(this.props.media.currentTime / 5) % 2 == 0) {
		  title = this.renderBot() 
		} else {
			title =  this.renderNot();
		}
    return ( <div className="centerText">
      {title}
      <div className="home-abt">Blurring the line between <span className="bot">Chatbot</span> and <span className="not">Human</span></div>
      <a className="btn custom-btn home-btn" href='/chat'>
        Start Chatting</a>
      </div>);
	}
}
export default withMediaProps(BotNotTitle);
