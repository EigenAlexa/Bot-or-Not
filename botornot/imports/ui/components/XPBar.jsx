import React, { Component, PropTypes } from 'react';
import { ProgressBar } from 'react-bootstrap';

export default class XPBar extends React.Component {
  getContent() {
    return {
      xp: this.props.user.xp, 
      xp_max: this.props.user.xp_max
    }
  }
  render() {
    content = this.getContent();
    const xp = content.xp;
    const xp_max = content.xp_max;

    return (
      <div className="xpBar">
        <div className="progress">
          <div role="progressbar" className=" progress-bar active progress-bar-striped  xpCur bar" 
            aria-valuenow={(xp/xp_max)*100} 
            aria-valuemin="0" 
            aria-valuemax="100" 
            style={{width: (xp/xp_max)*100 + "%" }}></div>
          <span> {"XP "+ xp +"/" + xp_max} </span>
        </div>
      </div>
    );

  }
}

XPBar.propTypes = {
  user: React.PropTypes.object.isRequired
};
