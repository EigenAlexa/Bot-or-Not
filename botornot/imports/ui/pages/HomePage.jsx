import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import Navigation from 'react-router';
import { Media, Player, controls} from 'react-media-player';
import BotNotTitle from '/imports/ui/components/BotNotTitle.jsx';
function Infographic(props) {
  return (
    <div className={!!props.isOne ? "infographics-one" : "infographics-two"}>
      <div className="container">
        <img src={props.img} className={props.isOne ? "infographics-img" : "infographics-img invert-img"} />
        <div className="infographics-header">
          {props.title}
        </div>
        <div className="infographics-body">
          {props.body}
        </div>
      </div> 
    </div>
  );
}
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
  renderInfoGraphics() {
    return <div className="infographics">
      <Infographic
        title="PURPOSE"
        body="We are making AI that can talk with humans. We need your help measuring how well they do."
        isOne={true}
        img="img/brain.png"
      />
      <Infographic
        title="OUR TECHNOLOGY"
        body="Our bots use reinforcement learning to improve the quality of our bots. Every time you rate a bot, your evaluation directs our robot changes it's behavior to better improve its conversational abilities."
        isOne={false}
        img="img/chip.png"
      />
      <Infographic
        title="HOW YOU CAN HELP"
        body="Play the game! When you press 'Start Chatting' you'll be sent to a waiting queue filled with bots and users. You will be redirected to a chat page connected with either a bot or another human. Your job is to talk to the other 'user' until you have a good idea whether the other user is a bot or not. Then, you'll need to click the Rate Now button, where you'll need to rate the other user as a Bot or Not. The more accurately you rate, the more your xp will increase. As your XP increases, your level will also increase. Higher level users will be have a higher chance for matching with more sophisticated bots. "
        isOne={true}
        img="img/game.png"
      />
    </div>;
  }
  render() {
    let width = window.innerWidth;
    let background;
    if (width > 450) {
      background= this.renderVideo();
    } else {
      background =  this.renderStill();
    }
    return ( 
      <div>
        {background}
          {this.renderInfoGraphics()} 
      </div>
    );
	}
}

export default HomePage;
