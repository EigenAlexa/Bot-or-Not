import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { ConvoItem } from '../components/ConvoItem.jsx';
import XPBar from '../components/XPBar.jsx';
import { Button, ProgressBar, Modal} from 'react-bootstrap';

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
  getContent() {
      const username = this.props.username;
      const user = this.props.user;
      const userExists = this.props.userExists;
      const ranking = this.state.rank;
      if (!userExists) {
          return (<p> Loading user.</p>);
      }
      console.log(user);
      if(!!user){

      
      const notratings = user.notratings
      const sessions = user.sessions;
      const botratings = sessions - notratings;
      const rating = !!user.rating ? user.rating : 0;
      const badges = user.badges;
      const isAnon = user.anon;
      return (
        <div className="profile-side col-sm-3 hidden-xs">
          {this.getHeader(isAnon)}
          <div className="row">
            <ProfAttribute 
              title={"Score"}
              value={rating.toFixed(2)}/>

            <ProfAttribute 
              title={"Sessions"}
              value={sessions}/> 
          </div>
        </div>);
    }
    else{
      return(<div className="profile-side col-sm-3 hidden-xs">
        </div>);
    }
  }


	getHeader(isAnon) {
    // Return the headers of the profile
    if (!isAnon) {
      return (	
        <div className="profile-top">
         {this.getHumanity()}
        </div>
      );
    } else {
      return (	
        <div className="profile-top">
          <div className="signupCall">
          <p className="sign-up-text">Sign up to save your progress!</p>
            <Button bsStyle='primary' size='medium' className="sign-up" onClick={this.handleSignUpButton.bind(this)} >Sign Up</Button>
          </div>
         {this.getHumanity()}
        </div>
      );
    }
	}
  handleSignUpButton() {
    FlowRouter.redirect('/sign-up');
  }
  getHumanity(){
    const user = this.props.user;
    if(!user)
      return <div> </div>;

    const anon = this.props.user.anon;
    const username = anon ? "ANONYMOUS" : this.props.username;
    const notratings = user.notratings
    const sessions = user.sessions;
    const botratings = sessions - notratings;
    const shortuser = username.length > 7 ? 
                    username.substring(0, username.length - 3) + "..." : 
                    username;
    const xp = !!user.xp ? user.xp : 15;
    const xp_max = !!user.xp_max ? user.xp_max : 50;
    const level = !!user.level ? user.level : 1;
    const prefix = this.props.isSelfProfile ? "you're" : ( <span>
      <span className='userColor'> {username} </span> is </span>);
    return (       
      <div>   
         <div className="col-xs-12 col-sm-12 profile-attribute">
          <div className="profile-username">{anon ? "ANONYMOUS" : shortuser} </div>
            <img className={botratings > notratings ? "botico" : "humanico" } src={botratings > notratings ? "/img/botico.png" : "/img/humanico.png"}/>
            <div className="profile-level">
              <span className="label label-lg label-warning">Level {level}</span>
            </div>
          </div>  
          <div className="col-xs-12 col-sm-12 profile-attribute">
            {sessions >0 ?   
              <div>
                <p> Players think {prefix} {botratings > notratings ? "a bot.": "human."} </p>
                <ProgressBar>
                      <ProgressBar active bsStyle="danger botBar" now={(botratings/sessions)*100} key={2} label={"BOT: "+ botratings} />
                      <ProgressBar active  bsStyle="success notBar" now={(notratings/sessions)*100} key={1} label={"NOT: " + notratings} />
                  </ProgressBar>
              </div>
              : <div></div>}
              <XPBar user={user}/>  
          </div> 
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
