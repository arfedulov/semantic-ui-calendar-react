import * as _ from 'lodash';
import * as moment from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import CustomPropTypes from '../lib/CustomPropTypes';
import MonthPicker, {
  MonthPickerOnChangeData,
} from '../pickers/monthPicker/MonthPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  DateRelatedProps,
  DisableValuesProps,
  MinMaxValueProps,
} from './BaseInput';
import {
  getInitializer,
  parseArrayOrValue,
  parseValue,
} from './parse';

export type MonthInputProps =
  & BaseInputProps
  & DateRelatedProps
  & DisableValuesProps
  & MinMaxValueProps;

export interface MonthInputOnChangeData extends MonthInputProps {
  value: string;
}

class MonthInput extends BaseInput<MonthInputProps, BaseInputState> {
  public static readonly defaultProps = {
    dateFormat: 'MMM',
    icon: 'calendar',
    inline: false,
  };

  public static readonly propTypes = {
    /** Called on selected value change. */
    onChange: PropTypes.func.isRequired,
    /** Currently selected value. */
    value: PropTypes.string,
    /** Moment date formatting string. */
    dateFormat: PropTypes.string,
    /** Date to display initially when no date is selected. */
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Date or list of dates that are displayed as disabled. */
    disable: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      CustomPropTypes.momentObj,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.instanceOf(Date),
      PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    ]),
    /** Maximum date that can be selected. */
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Minimum date that can be selected. */
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** If true, popup closes after selecting a date-time. */
    closable: PropTypes.bool,
    /**
     * Called on clear.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onClear: PropTypes.func,
    /** Using the clearable setting will let users remove their selection from a calendar. */
    clearable: PropTypes.bool,
    /** Optional Icon to display inside the clearable Input. */
    clearIcon: PropTypes.any,
    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.number,
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };
  }

  public render() {
    const {
      value,
      dateFormat,
      initialDate,
      disable,
      maxDate,
      minDate,
      closable,
      localization,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        {...rest}
        value={value}
        onMount={this.onInputViewMount}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        render={(pickerProps) => (
          <MonthPicker
            {...pickerProps}
            inline={this.props.inline}
            isPickerInFocus={this.isPickerInFocus}
            isTriggerInFocus={this.isTriggerInFocus}
            onCalendarViewMount={this.onCalendarViewMount}
            closePopup={this.closePopup}
            hasHeader={false}
            onChange={this.handleSelect}
            initializeWith={getInitializer({ initialDate, dateFormat, localization })}
            value={parseValue(value, dateFormat)}
            disable={parseArrayOrValue(disable, dateFormat)}
            maxDate={parseValue(maxDate, dateFormat)}
            minDate={parseValue(minDate, dateFormat)}
            localization={localization} />
        )}
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: MonthPickerOnChangeData) => {
    const { localization } = this.props;
    const date = localization ? moment({ month: value.month }).locale(localization) : moment({ month: value.month });
    let output = '';
    if (date.isValid()) {
      output = date.format(this.props.dateFormat);
    }
    _.invoke(
      this.props,
      'onChange',
      e, { ...this.props, value: output });
    if (this.props.closable) {
      this.closePopup();
    }
  }
}

export default MonthInput;
