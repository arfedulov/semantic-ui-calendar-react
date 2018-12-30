import * as _ from 'lodash';
import * as React from 'react';
import { Form, FormInputProps, Icon, Popup, SemanticICONS } from 'semantic-ui-react';

import { findHTMLElement } from '../lib';

const popupStyle = {
  padding: '0',
  filter: 'none', // prevents bluring popup when used inside Modal with dimmer="bluring" #28 #26
};

class FormInputWithRef extends React.Component<FormInputProps, any> {
  public render() {

    const {
      value,
      clearable,
      icon,
      clearIcon,
      onClear,
      ...rest
    } = this.props;

    const ClearIcon = _.isString(clearIcon) ?
      <Icon name={clearIcon as SemanticICONS} link onClick={onClear} /> :
      <clearIcon.type {...clearIcon.props} link onClick={onClear} />
    ;

    return (
      <Form.Input
        { ...rest }
        value={value}
        icon={value && clearable ? ClearIcon : icon}
      />
    );
  }
}

interface InputViewProps {
  /** Used for passing input dom node (input field or inline calendar) to parent component. */
  onMount: (e: HTMLElement) => void;
  /** Called after input field value has changed. */
  onChange: (e: React.SyntheticEvent, data: any) => void;
  /** Called on input focus. */
  onFocus?: () => void;
  /** Function for rendering component. */
  render?: (props: any) => React.ReactNode;
  /** Called after clear icon has clicked. */
  onClear?: (e: React.SyntheticEvent, data: any) => void;
  /** Picker. */
  children?: React.ReactNode;
  /** Whether to close a popup when cursor leaves it. */
  closeOnMouseLeave?: boolean;
  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;
  /** Using the clearable setting will let users remove their selection from a calendar. */
  clearable?: boolean;
  /** Optional Icon to display inside the Input. */
  icon?: any;
  /** Optional Icon to display inside the clearable Input. */
  clearIcon?: any;
  /** Whether popup is closed. */
  popupIsClosed?: boolean;
  /** The node where the picker should mount. */
  mountNode?: HTMLElement;
  /** Input element tabindex. */
  tabIndex?: string | number;
  /** Whether to display inline picker or picker inside a popup. */
  inline?: boolean;
  /** Where to display popup. */
  popupPosition?:
    | 'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'top center'
    | 'bottom center';
  /** Currently selected value. */
  value?: string;
}

class InputView extends React.Component<InputViewProps, any> {
  public static defaultProps = {
    inline: false,
    closeOnMouseLeave: true,
    tabIndex: '0',
    clearable: false,
    icon: 'calendar',
    clearIcon: 'remove',
  };

  private initialInputNode: HTMLElement | undefined;
  private inputNode: HTMLElement | undefined;

  public componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.inputNode);
    }
    this.initialInputNode = this.inputNode;
  }

  public componentDidUpdate() {
    // TODO: find actual root of the problem.
    // Sometimes input node reference passed
    // to this.props.onMount stales.
    // this.inputNode referes to
    // different DOM object than it was after first
    // component render.
    // InputView component doesn't unmount it just
    // gets different underlying input node.
    // In order to keep input node reference fresh
    // we make this check.
    if (this.inputNode !== this.initialInputNode) {
      this.initialInputNode = this.inputNode;
      this.props.onMount(this.inputNode);
    }
  }

  public render() {
    const {
      render,
      popupPosition,
      inline,
      value,
      closeOnMouseLeave,
      onChange,
      onClear,
      children,
      inlineLabel,
      popupIsClosed,
      mountNode,
      tabIndex,
      onMount,
      ...rest
    } = this.props;

    const inputElement = (
      <FormInputWithRef
        { ...rest }
        ref={(e) => {
          const node = findHTMLElement(e);
          this.inputNode = node && node.querySelector('input');
        }}
        value={value}
        tabIndex={tabIndex}
        inline={inlineLabel}
        onClear={(e) => (onClear || onChange)(e, { ...rest, value: '' })}
        onChange={onChange} />
    );

    if (inline) {
      return render({
        tabIndex,
      });
    }

    return (
      <Popup
        position={popupPosition}
        open={popupIsClosed ? false : undefined}
        trigger={inputElement}
        hoverable={closeOnMouseLeave}
        flowing
        mountNode={mountNode}
        style={popupStyle}
        hideOnScroll
        on='focus'
      >
        {
          render({
            tabIndex: -1,
          })
        }
      </Popup>
    );
  }
}

export default InputView;
