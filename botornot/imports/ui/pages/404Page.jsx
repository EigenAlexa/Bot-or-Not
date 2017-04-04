import React from 'react';

export default class FourOhFourPage extends React.Component {
  render() {
    const isBot = true; 
    return (
      <div className="page not-found">
        <section className="section-background">
          <h2 className="page-header">
           page not found 
          </h2>
        </section> {/* /.section-background */}
        <div className="img404">
          <p> Try another url</p>
          <img className={isBot ? "botico" : "humanico" } src={isBot ? "/img/botico.png" : "/img/humanico.png"}/>
        </div>
      </div>
    );
  }
}

