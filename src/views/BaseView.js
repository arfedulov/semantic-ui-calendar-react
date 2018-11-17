import React from 'react';

class BaseView extends React.Component {
  componentDidMount() {
    this.props.onMount && this.props.onMount(this.calendarNode);
  }
}

export default BaseView;
