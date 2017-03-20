import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { ConvoItem } from '../components/ConvoItem.jsx';
import { Button, ProgressBar } from 'react-bootstrap';

function ProfAttribute(props) {
  return (<div className="col-lg-12 profile-attribute">
    <div className="profile-attribute-title">{props.title} </div>
    <p>{props.value}</p>
  </div>);
        
}


export default class ProfileSide extends React.Component {
  constructor(props){
    super(props);
    this.state = {rank: -1};
  }

  componentWillUpdate(){
    console.log(this.state.rank)
    if(!this.props.loading && this.state.rank < 0 && this.props.userExists) {	
			this.updateRank();
    }
  }

	updateRank() {
			Meteor.call('users.getUserRanking', this.props.user._id, (error, result) => {
			if (!error){
				this.setState({'rank': result});
			} else {
				console.log("Error!")
				console.log(error);
			}
		});
	}

  getContent() {
      const username = this.props.username;
      const user = this.props.user;
      const userExists = this.props.userExists;
      const ranking = this.state.rank;
      if (!userExists) {
          return (<p> User '{username}' doesn't exist </p>);
      }
      const notratings = user.notratings
      const sessions = user.sessions;
      const botratings = sessions - notratings;
      const rating = user.rating;
      const badges = user.badges;
      const isAnon = user.anon;
      return (
        <div className="profile-side col-sm-3">
          {this.getHeader(isAnon)}
          <div className="row">
					<ProgressBar active bsStyle="danger" now={10} label={"XP: 10/100"} />
            <ProfAttribute 
              title={"Sessions"}
              value={sessions}/>
            <ProfAttribute 
              title={"Ranking"}
              value={ranking}/>
          
            <ProfAttribute 
              title={"Score"}
              value={rating.toFixed(2)}/>
          </div>
        </div>);
  }

	getHeader(isAnon) {
    // Return the headers of the profile
    if (!isAnon) {
      return (	
        <div className="profile-top">
          <div className="profile-username">{username}</div>
         {this.getHumanity()}
        </div>
      );
    } else {
      return (	
        <div className="profile-top">
          You're not signed in! If you don't sign in or sign up, you'll lose your progress! 
          <div className="signupCall">
            <Button bsStyle='primary' size='medium' className="sign-up" onClick={this.handleSignUpButton.bind(this)} >Sign Up Now</Button>
          </div>
         {this.getHumanity()}
        </div>
      );
    }
	}
  handleSignUpButton() {
   console.log('Sign it up');
  }
  getHumanity(){
    const user = this.props.user;
    const username = this.props.username;
    const notratings = user.notratings
    const sessions = user.sessions;
    const botratings = sessions - notratings;
    const prefix = this.props.isSelfProfile ? "you're" : ( <span>
      <span className='userColor'> {username} </span> is </span>);
    return (       
      <div>   
         <div className="col-xs-12 col-sm-12 profile-attribute">
          <div className="profile-attribute-title">Humanity </div>
          <img className={botratings > notratings ? "botico" : "humanico" } src={botratings > notratings ? "/img/botico.png" : "/img/humanico.png"}/>
          </div>  
          {sessions >0 ?   
        <div className="col-xs-12 col-sm-12 profile-attribute">
        <p> Players think {prefix} {botratings > notratings ? "a bot.": "human."} </p>
          <ProgressBar>
                <ProgressBar active bsStyle="danger botBar" now={(botratings/sessions)*100} key={2} label={"BOT: "+ botratings} />
                <ProgressBar active  bsStyle="success notBar" now={(notratings/sessions)*100} key={1} label={"NOT: " + notratings} />
            </ProgressBar>
        </div> : <div></div>}
      </div>);
  }
	getProfPic() {
		const user = this.props.user;
    const profPic = user.profPic;
		return <img src={profPic} className='profile-img'/>;
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
          {this.props.userExists && this.props.loading ? this.getLoading() : this.getContent()}
        </div>
    );
  }
}

ProfileSide.propTypes = {
    user : React.PropTypes.object,
    username: React.PropTypes.string,
    loading: React.PropTypes.bool,
    ranking: React.PropTypes.number,
    userExists: React.PropTypes.bool,
    convosLoading : React.PropTypes.bool,
    notConvos : React.PropTypes.array,
    botConvos : React.PropTypes.array,
}
