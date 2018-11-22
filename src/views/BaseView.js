import React from 'react';

/** Base class for picker view components. */
class BaseView extends React.Component {
  componentDidMount() {
    this.props.onMount && this.props.onMount(this.calendarNode);
  }
}

export default BaseView;
