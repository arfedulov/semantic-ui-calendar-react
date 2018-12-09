import * as React from 'react';

export interface BaseViewProps {
  /** Used for passing calendar dom element to parent component. */
  onMount: (e: HTMLElement) => void;
  /** Whether a calendar is inside a popup or inline. */
  inline: boolean;
  /** Whether a calendar has header. */
  hasHeader?: boolean;
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
