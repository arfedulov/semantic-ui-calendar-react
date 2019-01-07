import * as _ from 'lodash';
import * as React from 'react';
import {
  Form,
  FormInputProps,
  Icon,
  Popup,
  SemanticICONS,
  SemanticTRANSITIONS,
  Transition,
} from 'semantic-ui-react';

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
      innerRef,
      onFocus,
      onBlur,
      onMouseEnter,
      ...rest
    } = this.props;

    const ClearIcon = _.isString(clearIcon) ?
      <Icon name={clearIcon as SemanticICONS} link onClick={onClear} /> :
      <clearIcon.type {...clearIcon.props} link onClick={onClear} />
      ;

    return (
      <Form.Input
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onFocus}
        onMouseEnter={onMouseEnter}
        {...rest}
      >
        {value && clearable ?
          ClearIcon
          :
          <Icon name={icon} />
        }

        <input
          ref={innerRef}
          value={value}
        />

      </Form.Input>
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

  closePopup: () => void;
  openPopup: () => void;

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

  duration?: number;
  animation?: SemanticTRANSITIONS;
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
    animation: 'scale',
    duration: 200,
  };

  public state = { isAnimating: false };
  private inputNode: HTMLElement | undefined;
  private popupNode: HTMLElement | undefined;
  private mouseLeaveTimeout: number | null;

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
      closePopup,
      openPopup,
      animation,
      duration,
      ...rest
    } = this.props;

    const onBlur = (e) => {
      if (e.relatedTarget !== this.popupNode && e.relatedTarget !== this.inputNode) {
        closePopup();
      }
    };

    const onMouseLeave = (e) => {
      if (e.relatedTarget !== this.popupNode && e.relatedTarget !== this.inputNode) {
        if (closeOnMouseLeave) {
          this.mouseLeaveTimeout = window.setTimeout(() => {
            if (this.mouseLeaveTimeout) {
              closePopup();
            }
          }, 500);
        }
      }
    };

    const onMouseEnter = (e) => {
      if (e.currentTarget === this.popupNode || e.currentTarget === this.inputNode) {
        if (closeOnMouseLeave) {
          clearTimeout(this.mouseLeaveTimeout);
          this.mouseLeaveTimeout = null;
        }
      }
    };

    const inputElement = (
      <FormInputWithRef
        {...rest}
        innerRef={(e) => { this.inputNode = e; onMount(e); }}
        value={value}
        tabIndex={tabIndex}
        inline={inlineLabel}
        onClear={(e) => (onClear || onChange)(e, { ...rest, value: '' })}
        onFocus={() => { openPopup(); }}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onChange={onChange} />
    );

    if (inline) {
      return render({ tabIndex: 0 });
    }

    return (<div>
      {inputElement}
      <Transition
        unmountOnHide
        mountOnShow
        transitionOnMount
        visible={!popupIsClosed}
        animation={animation}
        duration={duration}
        onStart={() => this.setState({ isAnimating: true })}
        onComplete={() => this.setState({ isAnimating: false })}
      >
        <Popup
          position={popupPosition}
          open={true}
          hoverable={closeOnMouseLeave}
          flowing
          style={popupStyle}
          context={this.inputNode}
          on='focus'
        >
          <div
            onBlur={onBlur}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            style={{ outline: 'none' }}
            tabIndex={0}
            ref={(ref) => this.popupNode = ref}>
            {render({})}
          </div>
        </Popup>
      </Transition>
    </div>
    );
  }
}

export default InputView;
