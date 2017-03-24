import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import Navigation from 'react-router';
import { Media, Player, controls} from 'react-media-player';
import BotNotTitle from '/imports/ui/components/BotNotTitle.jsx';
class HomePage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			videoURL: 'botnotvid.mp4'
		}
	}
  renderBG() {
    return <Media
       volume={0}>
      <div className="media">
        <BotNotTitle />
        <div className="media-player">
          <Player 
              className="background-video" 
              autoPlay="true"
							loop="true"
              volume={0}
              src={this.state.videoURL}/>
        </div>
				<div id="video-overlay"></div>
        <div className="playPause media-controls">
          <BotNotTitle />
        </div>
      </div>
    </Media>
  }
  render() {
		return this.renderBG();
	}
}

export default HomePage;
