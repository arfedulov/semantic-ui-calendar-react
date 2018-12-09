import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  Icon,
  Table,
} from 'semantic-ui-react';

import { BodyWidth } from '../CalendarBody/Body';
import HeaderRange from './HeaderRange';
import HeaderWeeks from './HeaderWeeks';

interface HeaderProps {
  /** Header text content. */
  title: string;
  /** Called after click on next page button. */
  onNextPageBtnClick: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick: () => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage: boolean;
  /** Whether to display weeks row or not. */
  displayWeeks: boolean;
  /** Header width. */
  width: BodyWidth;
  /** Text content to display in dates-range row. */
  rangeRowContent?: string;
  /** Called after click on calendar header. */
  onHeaderClick?: () => void;
}

function Header(props: HeaderProps) {
  const {
    rangeRowContent,
    displayWeeks,
    onNextPageBtnClick,
    onPrevPageBtnClick,
    hasPrevPage,
    hasNextPage,
    onHeaderClick,
    width,
    title,
  } = props;

  const cellStyle = {
    border: 'none',
    borderBottom: displayWeeks ? 'none' : '1px solid rgba(34,36,38,.1)',
  };
  const prevPageBtnStyle = {
    cursor: hasPrevPage ? 'pointer' : 'auto',
  };
  const nextPageBtnStyle = {
    cursor: hasNextPage ? 'pointer' : 'auto',
  };
  const headerTitleStyle = {
    cursor: onHeaderClick ? 'pointer' : 'default',
  };

  return (
    <Table.Header>
      { !_.isNil(rangeRowContent) && <HeaderRange content={rangeRowContent} /> }
      <Table.Row>
        <Table.HeaderCell style={cellStyle} colSpan='1'>
          <Icon
            fitted
            style={prevPageBtnStyle}
            disabled={!hasPrevPage}
            onClick={hasPrevPage ? onPrevPageBtnClick : undefined}
            name='chevron left' />
        </Table.HeaderCell>

        <Table.HeaderCell
          onClick={onHeaderClick ? onHeaderClick : undefined}
          style={cellStyle}
          colSpan={(width - 2).toString()}>
          <span style={headerTitleStyle}>{ title }</span>
        </Table.HeaderCell>

        <Table.HeaderCell style={cellStyle} colSpan='1'>
          <Icon
            fitted
            style={nextPageBtnStyle}
            disabled={!hasNextPage}
            onClick={hasNextPage ? onNextPageBtnClick : undefined}
            name='chevron right' />
        </Table.HeaderCell>
      </Table.Row>
      { displayWeeks && <HeaderWeeks /> }
    </Table.Header>
  );
}

Header.propTypes = {
  /** Header text content. */
  title: PropTypes.string.isRequired,
  /** Called after click on next page button. */
  onNextPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on previous page button. */
  onPrevPageBtnClick: PropTypes.func.isRequired,
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: PropTypes.bool.isRequired,
  /** Whether to display next page button as active or disabled. */
  hasNextPage: PropTypes.bool.isRequired,
  /** Whether to display weeks row or not. */
  displayWeeks: PropTypes.bool.isRequired,
  /** Header width. */
  width: PropTypes.oneOf([3, 4, 7]).isRequired,
  /** Text content to display in dates-range row. */
  rangeRowContent: PropTypes.string,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
};

export default Header;
