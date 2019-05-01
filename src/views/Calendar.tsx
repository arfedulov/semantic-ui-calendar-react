import * as React from 'react';
import { Table } from 'semantic-ui-react';

// interface PickerStyle {
//   [key: string]: any;
//   width?: string;
//   minWidth?: string;
// }

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

class Calendar extends React.Component<CalendarProps, any> {
  public static readonly propTypes: object;
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
