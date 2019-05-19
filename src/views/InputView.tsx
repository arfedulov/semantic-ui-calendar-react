import isString from 'lodash/isString';
import invoke from 'lodash/invoke';

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
import checkIE from '../lib/checkIE';
import checkMobile from '../lib/checkMobile';
import getRestProps from '../lib/getRestProps';

const popupStyle = {
  padding: '0',
  filter: 'none', // prevents bluring popup when used inside Modal with dimmer="bluring" #28 #26
};

class FormInputWithRef extends React.Component<FormInputProps, {}> {

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

    const ClearIcon = isString(clearIcon) ?
      <Icon name={clearIcon as SemanticICONS} link onClick={onClear} /> :
      <clearIcon.type {...clearIcon.props} link onClick={onClear} />
      ;

    return (
      <Form.Input
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onFocus}
        onMouseEnter={onMouseEnter}
        icon
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

/////////////////////////////////////////// InputViewProps ///////////////////////////////////////////////

export interface InputViewProps {
  [ key: string ]: any;
  /** Used for passing input dom node (input field or inline calendar) to parent component. */
  onMount: (e: HTMLElement) => void;
  /** Called after input field value has changed. */
  onChange: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
  closePopup: () => void;
  openPopup: () => void;
  /** Function for rendering picker. */
  renderPicker: () => React.ReactNode;
  /** Called on input focus. */
  onFocus?: () => void;
  /** Called after clear icon has clicked. */
  onClear?: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
  /** Whether to close a popup when cursor leaves it. */
  closeOnMouseLeave?: boolean;
  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;
  /** Using the clearable setting will let users remove their selection from a calendar. */
  clearable?: boolean;
  /** Optional Icon to display inside the Input. */
  icon?: SemanticICONS | boolean;
  /** Icon position. Default: 'right'. */
  iconPosition?: 'left' | 'right';
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
  /** Duration of the CSS transition animation in milliseconds. */
  duration?: number;
  /** Named animation event to used. Must be defined in CSS. */
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
  /** Picker width (any value that `style.width` can take). */
  pickerWidth?: string;
  /** Style object for picker. */
  pickerStyle?: object;
  /** Do not display popup if true. */
  readOnly?: boolean;
  /** Try to prevent mobile keyboard appearing. */
  hideMobileKeyboard?: boolean;
}

// IMPORTANT: keep it in sync with InputViewProps
export const InputViewPropsNames = [
  'onMount',
  'onChange',
  'closePopup',
  'openPopup',
  'onFocus',
  'renderPicker',
  'onClear',
  'closeOnMouseLeave',
  'inlineLabel',
  'clearable',
  'icon',
  'iconPosition',
  'clearIcon',
  'popupIsClosed',
  'mountNode',
  'tabIndex',
  'inline',
  'duration',
  'animation',
  'popupPosition',
  'value',
  'pickerWidth',
  'pickerStyle',
  'readOnly',
  'hideMobileKeyboard',
];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

class InputView extends React.Component<InputViewProps, {}> {
  public static defaultProps = {
    inline: false,
    closeOnMouseLeave: true,
    tabIndex: '0',
    clearable: false,
    clearIcon: 'remove',
    animation: 'scale',
    duration: 200,
    iconPosition: 'right',
  };

  private inputNode: HTMLElement | undefined;
  private popupNode: HTMLElement | undefined;
  private mouseLeaveTimeout: number | null;

  public render() {
    const {
      renderPicker,
      popupPosition,
      inline,
      value,
      closeOnMouseLeave,
      onChange,
      onClear,
      inlineLabel,
      popupIsClosed,
      mountNode,
      tabIndex,
      onMount,
      closePopup,
      openPopup,
      animation,
      duration,
      iconPosition,
      icon,
      readOnly,
      hideMobileKeyboard,
      clearIcon,
    } = this.props;

    const rest = this.getUnusedProps();

    const onBlur = (e) => {
      if (e.relatedTarget !== this.popupNode && e.relatedTarget !== this.inputNode && !checkIE()) {
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
        { ...rest }
        // trying to use this hack https://stackoverflow.com/a/7610923 for hiding mobile keyboard
        readOnly={(checkMobile() && hideMobileKeyboard) || readOnly}
        icon={icon}
        clearIcon={ clearIcon }
        iconPosition={icon && iconPosition !== 'right' ? iconPosition : undefined}
        innerRef={(e) => { this.inputNode = e; onMount(e); }}
        value={value}
        tabIndex={tabIndex}
        inline={inlineLabel}
        onClear={(e) => (onClear || onChange)(e, { ...rest, value: '' })}
        onFocus={(e) => {
          invoke(this.props, 'onFocus', e, this.props);
          openPopup();
        }}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onChange={onChange} />
    );

    if (inline) {
      return renderPicker();
    }

    return (<>
      {inputElement}
      {
        !readOnly
        &&
        <Transition
          unmountOnHide
          mountOnShow
          visible={!popupIsClosed}
          animation={animation}
          duration={duration}
          onComplete={() => {
            if (popupIsClosed) {
              this.unsetScrollListener();
              // TODO: for some reason sometimes transition component
              // doesn't hide even though `popupIsClosed === true`
              // To hide it we need to rerender component
              this.forceUpdate();
            } else {
              this.setScrollListener();
            }
          }}
        >
          <Popup
            position={popupPosition}
            open={true}
            hoverable={closeOnMouseLeave}
            flowing
            style={popupStyle}
            context={this.inputNode}
            on='hover'
            mountNode={mountNode}
          >
            <div
              onBlur={onBlur}
              onMouseLeave={onMouseLeave}
              onMouseEnter={onMouseEnter}
              style={{ outline: 'none' }}
              tabIndex={0}
              ref={(ref) => this.popupNode = ref}
            >
              {renderPicker()}
            </div>
          </Popup>
        </Transition>
      }
    </>
    );
  }

  public scrollListener = () => {
    const { closePopup } = this.props;
    closePopup();
  }

  private setScrollListener() {
    window.addEventListener('scroll', this.scrollListener);
  }

  private unsetScrollListener() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  private getUnusedProps(): object {
    return getRestProps(this.props, [
      ...InputViewPropsNames,
    ]);
  }
}

export default InputView;
