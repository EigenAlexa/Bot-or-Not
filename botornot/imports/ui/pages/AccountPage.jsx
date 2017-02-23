import React from 'react';
import {_} from 'meteor/underscore';
import Blaze from 'meteor/gadicc:blaze-react-component';

export default class AccountPage extends React.Component {
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
      const profPic = user.profPic;
      console.log('profPic', profPic);
      return (     <div> 
            <img src={profPic} className='profile-image'/>
            <p>Not Ratings: {notratings} </p>
            <p>Sessions: {sessions} </p>
            <p>Rating: {rating} </p>
            <p>Ranking: {ranking} </p>
          </div>
      )
  }
  getLoading() {
      return <p> Loading.. please be patient </p>;
  }
  render() {
    const { 
        username,
        loading,
    } = this.props;

    return (
      <div>
        <section className="section-background">
            <div className="container">
                <h3 className="page-header">
                    {username}
                </h3>
            </div>
        </section>
        {this.props.loading ? this.getLoading() : this.getContent()}
      </div>
    );
  }
}

AccountPage.propTypes = {
    user : React.PropTypes.object,
    username: React.PropTypes.string,
    loading: React.PropTypes.bool,
    ranking: React.PropTypes.number,
    userExists: React.PropTypes.bool,
}
