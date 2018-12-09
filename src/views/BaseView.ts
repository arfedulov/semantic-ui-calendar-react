import * as React from 'react';

export interface BaseViewProps {
  onMount: (e: HTMLElement) => void;
}

/** Base class for picker view components. */
class BaseView<P extends BaseViewProps, S> extends React.Component<P, S> {
  protected calendarNode: HTMLElement | undefined;

  public componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.calendarNode);
    }
  }
}

export default BaseView;
