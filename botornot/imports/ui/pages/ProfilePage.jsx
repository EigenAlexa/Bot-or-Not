import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { ConvoItem } from '../components/ConvoItem.jsx';

function ProfAttribute(props) {
  return (<div className="col-xs-12 col-sm-4 profile-attribute">
    <div className="profile-attribute-title">{props.title} </div>
    <p>{props.value}</p>
  </div>);
        
}


export default class ProfilePage extends React.Component {
  getContent() {
      const username = this.props.username;
      const user = this.props.user;
      const userExists = this.props.userExists;
      const ranking = this.props.ranking;
      if (!userExists) {
          return (<p> User '{username}' doesn't exist </p>);
      }
      const notratings = user.notratings
      const sessions = user.sessions;
      const rating = user.rating;
      const playerType = this.getPlayerType(rating);
      const badges = user.badges;
      return (
        <div className="profile">
          <div className="row profile-center-sm">
            <div className="col-xs-12 col-sm-6 col-md-4">
              {this.getProfPic()}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-8">
              <div className="profile-username">{username}</div>
              <p> Player Type</p>
              <p className="bold-item">{playerType}</p>
            </div>
          </div>
          <div className="row">
            <ProfAttribute 
              title={"Ranking"}
              value={ranking}/>
            <ProfAttribute 
              title={"Sessions"}
              value={sessions}/>
          
            <ProfAttribute 
              title={"Ratings"}
              value={rating}/>
          </div>
          {this.props.convosLoading ?  <p>Loading convos</p> : this.getConvos()}
        </div>);
      // return (
					// <div className="profile-align profile">
      //     <div className="container">
						// <div className="profile-attributes"> 
							// <p>Not Ratings: {notratings} </p>
							// <p>Sessions: {sessions} </p>
							// <p>Rating: {rating} </p>
							// <p>Ranking: {ranking} </p>
							// <p>Badges : {badges} </p>
						// </div>
      //       <div className="convos">
      //         {this.props.convosLoading ?  <p>Loading convos</p> : this.getConvos()}
      //       </div>
					// </div>
      // )
  }
	getProfPic() {
		const user = this.props.user;
    const profPic = user.profPic;
		return <img src={profPic} className='profile-img'/>;
	}
  getConvos() {
      console.log('not convos',this.props.notConvos);
      console.log('bot convos',this.props.botConvos);
      HumanConvos = this.props.notConvos.map(convo => (
          <ConvoItem 
            convo={convo}
            key={convo._id}
            time={convo.time}
          />
      ));
      BotConvos = this.props.botConvos.map(convo => (
          <ConvoItem 
            convo={convo}
            key={convo._id}
            time={convo.time}
          />
      ));
    return (
        <div className="profile-center-sm">
          <div className="col-xs-12 col-sm-6">
            <div className="profile-attribute-title"> Rated Human </div>
            { HumanConvos.length > 0 ? HumanConvos : "Never Rated Human"}
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="profile-attribute-title"> Rated Bot </div>
            { BotConvos.length > 0 ? BotConvos : "Never Rated Bot"}
          </div>
          <br style={{clear : "both"}}/>
        </div>);

  }
    
  
  getLoading() {
    return <p> Loading.. please be patient </p>;
  }
  getPlayerType(rating) {
    const playerMap = [
      ["human",100], 
      ["half-human half-bot",50],
      ["bot",0],
    ]; 
    for (let ratingPair of playerMap) {
      if (rating >= ratingPair[1]) {
        return ratingPair[0];
      }
    }
    return 'clockbot';
  }
  render() {
    const { 
        username,
        loading,
    } = this.props;

    return (
      <div>
        <div className="container">
          {this.props.loading ? this.getLoading() : this.getContent()}
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
    user : React.PropTypes.object,
    username: React.PropTypes.string,
    loading: React.PropTypes.bool,
    ranking: React.PropTypes.number,
    userExists: React.PropTypes.bool,
    convosLoading : React.PropTypes.bool,
    notConvos : React.PropTypes.array,
    botConvos : React.PropTypes.array,
}
