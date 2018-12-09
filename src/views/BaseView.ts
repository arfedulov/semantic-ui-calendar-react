import * as React from 'react';

/** Base class for picker view components. */
class BaseView extends React.Component<any, any> {
  protected calendarNode: HTMLElement | undefined;

  public componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.calendarNode);
    }
  }
}

export default BaseView;
