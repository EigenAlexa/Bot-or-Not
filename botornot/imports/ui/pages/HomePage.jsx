import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import Navigation from 'react-router';
import { Media, Player, controls} from 'react-media-player';
import BotNotTitle from '/imports/ui/components/BotNotTitle.jsx';
class HomePage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			videoURL: 'static/botnotvid.mp4'
		}
	}
  renderStill() {
    return (
      <div className="media">
        <BotNotTitle />
        <div className="media-player">
          <img className='background-video' src="img/bot1.png"/>
        </div>
				<div id="video-overlay"></div>
        <div className="playPause media-controls">
          <BotNotTitle isVideo={false}/>
        </div>
      </div>
    );
  }
  renderVideo() {
    return <Media
       volume={0}>
      <div className="media">
        <BotNotTitle />
        <div className="media-player">
          <Player 
              className="background-video" 
              autoPlay="true"
							loop="true"
              src={this.state.videoURL}/>
        </div>
				<div id="video-overlay"></div>
        <div className="playPause media-controls">
          <BotNotTitle isVideo={true}/>
        </div>
      </div>
    </Media>
  }
  render() {
    let width = window.innerWidth;
    if (width > 450) {
      return this.renderVideo();
    } else {
      return this.renderStill();
    }
	}
}

export default HomePage;
