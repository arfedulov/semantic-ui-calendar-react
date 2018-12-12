import * as keyboardKey from 'keyboard-key';
import {
  includes,
  isNumber,
} from 'lodash';
import * as React from 'react';

import {
  RangeIndexes,
} from '../views/BaseCalendarView';

export interface BasePickerProps {
  closePopup: () => void;
  inline: boolean;
  isPickerInFocus: () => boolean;
  isTriggerInFocus: () => boolean;
}

interface HandleChangeParams {
  value: string;
  itemPosition?: number;
}

/** Do not expose this class. Instead use RangeSelectionPicker and SingleSelectionPicker. */
abstract class BasePicker extends React.Component<BasePickerProps, any> {
  protected PAGE_WIDTH: number;

  public componentDidMount(): void {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  protected onHoveredCellPositionChange = (e: React.SyntheticEvent,
                                           { itemPosition }: { itemPosition: number }): void => {
    this.setState({
      hoveredCellPosition: itemPosition,
    });
  }

  protected canCalendarCatchKeyboardEvents = (): boolean => {
    if (this.props.inline) {
      return this.props.isPickerInFocus();
    }

    return this.props.isTriggerInFocus();
  }

  protected handleKeyPress = (event: KeyboardEvent): void => {
    if (!this.canCalendarCatchKeyboardEvents()) {
      return;
    }
    const key = keyboardKey.getKey(event);
    switch (key) {
    case 'Enter':
      this.handleEnterKeyPress(event);
      break;
    default:
      this.handleArrowKeyPress(event);
    }
  }

  protected handleEnterKeyPress = (event: KeyboardEvent): void => {
    const key = keyboardKey.getKey(event);
    if (key === 'Enter' && this.canCalendarCatchKeyboardEvents()) {
      event.preventDefault();
      const selectedValue = this.buildCalendarValues()[this.state.hoveredCellPosition];
      this.handleChange(null, {
        value: selectedValue,
        itemPosition: this.state.hoveredCellPosition,
      });
    }
  }

  protected handleBlur = (): void => {
    this.props.closePopup();
  }

  protected handleArrowKeyPress = (event: KeyboardEvent): void => {
    if (!this.canCalendarCatchKeyboardEvents()) {
      return;
    }
    const key = keyboardKey.getKey(event);
    const selectableCells = this.getSelectableCellPositions();
    const nextSelectableCellPositionLeft = selectableCells
      .slice(0, selectableCells.indexOf(this.state.hoveredCellPosition)).pop();
    const nextSelectableCellPositionRight = selectableCells
      .slice(selectableCells.indexOf(this.state.hoveredCellPosition) + 1)[0];
    switch (key) {
    case 'ArrowLeft':
      event.preventDefault();
      if (nextSelectableCellPositionLeft) {
        this.onHoveredCellPositionChange(null, { itemPosition: nextSelectableCellPositionLeft });
      } else {
        if (this.isPrevPageAvailable()) {
          this.switchToPrevPage(null, null, () => {
            const selectableCellsPrevPage = this.getSelectableCellPositions();
            this.onHoveredCellPositionChange(
              null, { itemPosition: selectableCellsPrevPage[selectableCellsPrevPage.length - 1] });
          });
        }
      }
      break;
    case 'ArrowRight':
      event.preventDefault();
      if (nextSelectableCellPositionRight) {
        this.onHoveredCellPositionChange(null, { itemPosition: nextSelectableCellPositionRight });
      } else {
        if (this.isNextPageAvailable()) {
          this.switchToNextPage(null, null, () => {
            const selectableCellsNextPage = this.getSelectableCellPositions();
            this.onHoveredCellPositionChange(null, { itemPosition: selectableCellsNextPage[0] });
          });
        }
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (includes(selectableCells, this.state.hoveredCellPosition - this.PAGE_WIDTH)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition - this.PAGE_WIDTH });
      }
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (includes(selectableCells, this.state.hoveredCellPosition + this.PAGE_WIDTH)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition + this.PAGE_WIDTH });
      }
      break;
    default:
      break;
    }
  }

  /** Return a position of a value (date, year, month ...) with wich a calendar was initialized. */
  protected abstract getInitialDatePosition(): number;

  /** Creates values with wich calendar filled. */
  protected abstract buildCalendarValues(): string[];

  /** Handles currently selected value change. */
  protected abstract handleChange(e: React.SyntheticEvent, data: HandleChangeParams): void;

  /** Return positions of all values on calendar that can be selected. */
  protected abstract getSelectableCellPositions(): number[];

  /** Check if calendar has selectable values on previous page (i.e. prev year, month, day). */
  protected abstract isPrevPageAvailable(): boolean;

  /** Check if calendar has selectable values on next page (i.e. next year, month, day). */
  protected abstract isNextPageAvailable(): boolean;

  /** Change currently displayed page (i.e. year, month, day) to previous one. */
  protected abstract switchToPrevPage(e?: React.SyntheticEvent, data?: any, cb?: () => void): void;

  /** Change currently displayed page (i.e. year, month, day) to next one. */
  protected abstract switchToNextPage(e?: React.SyntheticEvent, data?: any, cb?: () => void): void;
}

export abstract class RangeSelectionPicker extends BasePicker {
  public componentDidMount(): void {
    super.componentDidMount();
    const { start, end } = this.getActiveCellsPositions();
    let hoveredPos;
    if (end) {
      hoveredPos = end;
    } else if (start) {
      hoveredPos = start;
    } else {
      hoveredPos = this.getInitialDatePosition();
    }
    this.setState({
      hoveredCellPosition: hoveredPos,
    });
  }

  protected abstract getActiveCellsPositions(): RangeIndexes | undefined;
}

export abstract class SingleSelectionPicker extends BasePicker {
  public componentDidMount(): void {
    super.componentDidMount();
    const active = this.getActiveCellPosition();
    this.setState({
      hoveredCellPosition: isNumber(active) ? active : this.getInitialDatePosition(),
    });
  }

  protected abstract getActiveCellPosition(): number | undefined;
}
