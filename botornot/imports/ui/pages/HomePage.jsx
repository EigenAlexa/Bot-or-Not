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
  renderTest() {
    return <Media>
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
          // <BotNotTitle />
        </div>
      </div>
    </Media>
  }
  renderBGVideo() {
    console.log(this.getCurrentVideoTime());
    return (
			<div>
				<video className="background-video" ref={(input) => { this.bgVid = input; }} loop autoPlay>
					<source src={this.state.videoURL} type="video/mp4" />
					<source src={this.state.videoURL} type="video/ogg" />
						Your browser does not support the video tag.
				</video>
				<div id="video-overlay"></div>
			</div>
		);
	}
  render() {
		return this.renderTest();
	}
    // return (

    //   <div>
    //     <title>Bot or Not</title>
    //     /* Home */
    //     <div id="header">
    //       <div className="flexslider">
    //         <ul className="slides">
    //           <li className="slider-item" style={{backgroundImage: 'url("http://www.wallpaperup.com/uploads/wallpapers/2012/09/26/16626/8155b41ae43140299c342079a2c134dd.jpg")'}}> 
    //           </li>
    //          </ul>
    //         <div className="intro container">
    //           <div className="inner-intro">
    //             <h1 className="header-title">
    //               <span>Bot</span> or Not
    //             </h1>
    //             <a className="btn custom-btn" href='/chat'>
    //               Start Chatting</a>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  // }
}

export default HomePage;
