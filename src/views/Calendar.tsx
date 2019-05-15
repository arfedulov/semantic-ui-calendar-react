import * as React from 'react';
import { Table } from 'semantic-ui-react';

interface CalendarProps {
  /** Table content. */
  children: React.ReactNode[];
  /** Whether to outline the calendar on focus. */
  outlineOnFocus: boolean;
  /** Picker width (any value that `style.width` can take). */
  pickerWidth?: string;
  /** Style object for picker. */
  pickerStyle?: object;
}

class Calendar extends React.Component<CalendarProps, {}> {
  public static readonly defaultProps = {
    pickerWidth: '100%',
  };

  public render() {
    const {
      children,
      outlineOnFocus,
      pickerWidth,
      pickerStyle,
      ...rest
    } = this.props;

    const style = {
      width: pickerWidth,
      minWidth: '22em',
      // Prevent poped up picker from beeing outlined on focus.
      // Inline picker should be outlined when in focus.
      outline: outlineOnFocus ? undefined : 'none',
      ...pickerStyle,
    };

    return (
      <Table
        { ...rest }
        style={style}
        unstackable
        celled
        textAlign='center'
      >
        { children }
      </Table>
    );
  }
}

export default Calendar;
