import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { ConvoItem } from '../components/ConvoItem.jsx';
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
					<div>
						<div className="profile-align profile-attributes"> 
							<p> PlayerType: {playerType} </p>
							<p>Not Ratings: {notratings} </p>
							<p>Sessions: {sessions} </p>
							<p>Rating: {rating} </p>
							<p>Ranking: {ranking} </p>
							<p>Badges : {badges} </p>
						</div>
						{this.props.convosLoading ?  <p>Loading convos</p> : this.getConvos()}
					</div>
      )
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
        <div className="convos">
            <div className="convos-human">
                <h3 className="convos-title">Human</h3>
                {HumanConvos}
            </div>
            <div className="convos-bot">
                <h3 className="convos-title">Bot</h3>
                { BotConvos }
            </div>
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
        <section className="section-background profile-align">
            <div className="container">
                <h3 className="page-header">
                    {username}
                </h3>
										{this.props.loading ? "" : this.getProfPic()}
            </div>
        </section>
        {this.props.loading ? this.getLoading() : this.getContent()}
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
