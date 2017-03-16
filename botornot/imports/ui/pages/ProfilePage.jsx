import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { ConvoItem } from '../components/ConvoItem.jsx';
import { ProgressBar } from 'react-bootstrap';

function ProfAttribute(props) {
  return (<div className="col-xs-12 col-sm-4 profile-attribute">
    <div className="profile-attribute-title">{props.title} </div>
    <p>{props.value}</p>
  </div>);
        
}


export default class ProfilePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {rank: -1};
  }
  componentWillUpdate(){
    console.log(this.state.rank)
    if(!this.props.loading && this.state.rank < 0) {
        Meteor.call('users.getUserRanking', this.props.user._id, (error, result) => {
        if (!error){
          this.setState({'rank': result});
        } else {
          console.log("Error!")
          console.log(error);
        }
      });
    }
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
      return (
        <div className="col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2 profile">
          <div className="profile-top">
            <div className="profile-username">{username}</div>
           {this.getHumanity()}
          </div>

          <div className="row">
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
          {this.props.convosLoading ?  <p>Loading convos</p> : this.getConvos()}
        </div>);
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
          <div className="col-xs-12 col-sm-6 profile-div ">
            <div className="profile-attribute-title"> Rated Human </div>
            { HumanConvos.length > 0 ? HumanConvos : <div className="never-rated">Never Rated Human</div>}
          </div>
          <div className="col-xs-12 col-sm-6 profile-div">
            <div className="profile-attribute-title"> Rated Bot </div>
            { BotConvos.length > 0 ? BotConvos : <div className="never-rated">Never Rated Bot</div>}
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
