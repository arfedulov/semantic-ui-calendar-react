import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { css, StyleSheet } from 'aphrodite';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { 
  compareDates,
  isDayInCurrentMonth } from '../utils.js';

const styles = StyleSheet.create({
  cell: {
    border: 'none'
  },
  bottomBorder: {
    border: 'none',
    borderBottom: '1px solid rgba(34, 36, 38, .1)'
  },
  hoverable: {
    ':hover': {
      outline: '1px solid #85b7d9'
    }
  }
});

function Cell(props) {
  const {
    active,
    disabled,
    className,
    onClick,
    children
  } = props;
  const classes = ClassNames(className, css(styles.hoverable));
  return (
    <Table.Cell
      active={active}
      disabled={disabled}
      className={classes}>
      {props.children}
    </Table.Cell>
  );
}

function Calendar(props) {
  const {
    data,
    onDateClick,
    activeDate,
    className
  } = props;
  const _getBodyRow = (week) => {
    const days = week.map((day) => {
      const active = compareDates(day, activeDate);
      const disabled = !isDayInCurrentMonth(day);
      return (
        <Cell
          active={active}
          disabled={disabled}
          key={day.format('DD-MM-YYYY')}>
          { day.format('D') }
        </Cell>
      );
    });
    return (
      <Table.Row>
        { days }
      </Table.Row>
    );
  };

  const _getBody = (weeks) => {
    return weeks.map((week) => _getBodyRow(week));
  };

  const classes = ClassNames(className);
  return (
    <Table unstackable celled textAlign="center" className={classes}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className={css(styles.cell)} colSpan="1">
            <Icon name="chevron left" />
          </Table.HeaderCell>
          <Table.HeaderCell className={css(styles.cell)} colSpan="5">Март 2018</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.cell)} colSpan="1">
            <Icon name="chevron right" />
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">пн</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">вт</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">ср</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">чт</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">пт</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">сб</Table.HeaderCell>
          <Table.HeaderCell className={css(styles.bottomBorder)} colSpan="1">вс</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {_getBody(data)}
      </Table.Body>
    </Table>
  );
}

Calendar.propTypes = {
  /** Array of weeks (week represented as array of `moment`'s) */
  data: PropTypes.array.isRequired,
  /** (clickedDate) => { do something } */
  onDateClick: PropTypes.func.isRequired,
  /** Currently selected date */
  activeDate: PropTypes.instanceOf(moment),
  className: PropTypes.string
};

Calendar.defaultProps = {
  activeDate: moment()
};

export default Calendar;
export {
  Calendar
};

{/* <Table.Row>
          <Cell disabled>30</Cell>
          <Cell>1</Cell>
          <Cell>2</Cell>
          <Cell>3</Cell>
          <Cell>4</Cell>
          <Cell>5</Cell>
          <Cell>6</Cell>
        </Table.Row>
        <Table.Row>
          <Cell>7</Cell>
          <Cell active>8</Cell>
          <Cell>9</Cell>
          <Cell>10</Cell>
          <Cell>11</Cell>
          <Cell>12</Cell>
          <Cell>13</Cell>
        </Table.Row>
        <Table.Row>
          <Cell>14</Cell>
          <Cell>15</Cell>
          <Cell>16</Cell>
          <Cell>17</Cell>
          <Cell>18</Cell>
          <Cell>19</Cell>
          <Cell>20</Cell>
        </Table.Row>
        <Table.Row>
          <Cell>21</Cell>
          <Cell>22</Cell>
          <Cell>23</Cell>
          <Cell>24</Cell>
          <Cell>25</Cell>
          <Cell>26</Cell>
          <Cell>27</Cell>
        </Table.Row>
        <Table.Row>
          <Cell>28</Cell>
          <Cell>29</Cell>
          <Cell>30</Cell>
          <Cell>31</Cell>
          <Cell disabled>1</Cell>
          <Cell disabled>2</Cell>
          <Cell disabled>3</Cell>
        </Table.Row>
        <Table.Row>
          <Cell disabled>4</Cell>
          <Cell disabled>5</Cell>
          <Cell disabled>6</Cell>
          <Cell disabled>7</Cell>
          <Cell disabled>8</Cell>
          <Cell disabled>9</Cell>
          <Cell disabled>10</Cell>
        </Table.Row> */}