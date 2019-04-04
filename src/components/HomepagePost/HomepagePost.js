import React, { Component } from 'react';

import './HomepagePost.scss';

class HomepagePost extends Component {
  render() {
    return (
      <div className={"HomepagePost HomepagePost--" + this.props.type} data-aos="zoom-in" data-aos-delay={this.props.index * 100}>
        <div className="aspect aspect--4x3">
          <div className="aspect__inner">
            <img src={this.props.src} alt={this.props.title} />
            <div className="HomepagePost-Title">{this.props.title}</div>
            <div className="HomepagePost-TypeLabel"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomepagePost; 