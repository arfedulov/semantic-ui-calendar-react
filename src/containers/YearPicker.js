import React from 'react';
import { YearPickerComponent, PickerHeader } from '../components';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction } from '../utils.js';
import PropTypes from 'prop-types';
import moment from 'moment';

class YearPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeYear: '',
      yearsStart: moment().year() - 6
    };
  }

  onYearClick = (event, data) => {
    this.setState({ activeYear: data.value });
    this.props.onYearChange(event, data);
  }

  getActiveYear = () => {
    return this.state.activeYear || moment().year();
  }

  onNextBtnClick = () => {
    this.setState(({ yearsStart }) => {
      return { yearsStart: yearsStart + 12 };
    });
  }

  onPrevBtnClick = () => {
    this.setState(({ yearsStart }) => {
      return { yearsStart: yearsStart - 12 };
    });
  }

  render() {
    const rest = getUnhandledProps(YearPicker, this.props);
    const { yearsStart } = this.state;
    const yearsRange = {
      start: yearsStart,
      end: yearsStart + 11
    };

    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <PickerHeader
          width="3"
          activeYears={yearsRange}
          onPrevBtnClick={this.onPrevBtnClick}
          onNextBtnClick={this.onNextBtnClick} />
        <YearPickerComponent
          onYearClick={this.onYearClick}
          activeYear={this.getActiveYear()}
          yearsStart={this.state.yearsStart} />
      </Table>
    );
  }
}

YearPicker.propTypes = {
  /** (event, data) => {} */
  onYearChange: PropTypes.func
};

YearPicker.defaultProps = {
  onYearChange: emptyFunction
};

export default YearPicker;
export {
  YearPicker
};