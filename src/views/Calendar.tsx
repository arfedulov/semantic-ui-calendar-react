import * as React from 'react';
import { Table } from 'semantic-ui-react';

interface CalendarProps {
  /** Table content. */
  children: React.ReactNode[];
  /** Whether to outline the calendar on focus. */
  outlineOnFocus: boolean;
}

class Calendar extends React.Component<CalendarProps, any> {
  public static propTypes: object;

  public render() {
    const {
      children,
      outlineOnFocus,
      ...rest
    } = this.props;
    const style = {
      // Prevent poped up picker from beeing outlined on focus.
      // Inline picker should be outlined when in focus.
      outline: outlineOnFocus ? undefined : 'none',
    };

    return (
      <Table
        style={style}
        unstackable
        celled
        {...rest}
        textAlign='center'>
        { children }
      </Table>
    );
  }
}

export default Calendar;
