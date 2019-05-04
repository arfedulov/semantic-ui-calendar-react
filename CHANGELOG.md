# Changelog

## v0.15.0 2019-05-04

- feat: add ``hideMobileKeyboard`` prop [`#143`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/143)

- feat: add ``className``'s to headers and wrap table cell content in span [`#139`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/139)

- fix: Esc and Arrow keys fixes for Internet Explorer. And removed prevent default on arrow left/right events [`#137`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/137)

- fix(DatesRangeInput): error when allowed range doesn't contain today [`#140`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/140)

- fix (DateInput, DateTimeInput): update internal *Input date when value changed [`#142`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/142)

## v0.14.4 2019-03-30

- fix(package): set proper types path [`#115`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/115)

## v0.14.3 2019-03-17

- feat(DatesRangeInput): allow same start/end date selection when using [`#104`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/104)

- fix: readOnly prop in InputView [`fe63e3d`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/fe63e3d35c22b62ef23511afba47f56346d03187)

- fix: #95 #55 can't change years and months in IE [`#110`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/110)

- chore: build for multiple module systems [`ef32ca7`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/ef32ca7b900a6d83245f84a6be06c1eb84c4a13f)

- chore: add umd build [`#111`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/111)

## v0.14.2 2019-02-27

- fix: can mark any date [`#98`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/98)

- fix(InputView): don't wrap field in extra div [`#99`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/99)

- fix: use "ui icon input" for correct styling [`#100`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/100)

- fix: can remove icon from input [`#101`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/101)

## v0.14.1 2019-02-19

- feat: allow to mark specific dates [`#77`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/77)

- feat: MonthRangeInput [`#79`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/79)

- feat: adds localization prop on each component [`#85`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/85)

- fix(MinutePicker): #78 minDate disables minutes in each hour in the day [`93972b3`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/93972b3077b2957fb3e4d1f9ecd2e087e3fa4b3d)

- fix: #83 pass popup mount node to inputView [`#89`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/86)

- fix: #84 initialize picker state with input value [`#88`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/88)

- fix(DateInput/DateTimeInput): #93 able to change year, month, date ... [`#96`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/96)

## v0.13.0 2019-01-12

- feat: added transitions for popup [`65`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/65)

- feat: pickerWidth and pickerStyle props on top level component [`6ed8e76`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/6ed8e76207012c11eae705c6d79de14e4b42623b)

- fix: BasePicker SyntheticEvent generic type [`69`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/69)

## v0.12.2 2018-12-31

- feat: add clearable props to Input [`#60`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/60)

- fix: do not select disabled cells after page switch [`b536d89`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/b536d89e8af52e533c97735a0301a0c4dfd04963)

- fix: not jump over 0th cell on ArrowLeft press [`394470c`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/394470c1105400ca3f62858dc0856da4125c047b)

- fix(MinutePicker): getInitialDatePosition handles disabled positions [`c1ad726`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/c1ad72661e8d5a88efeacf5573ecfd2e9104bff8)

- fix: #59 prevent selecting disabled values [`bab7718`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/bab7718df3f969e4deb6001517c14b8ac6bb6137)

## v0.12.1 2018-11-24

- fix: stale input node reference [`32b56c3`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/32b56c381891bd716efb3a93e1ef8ef1ac0400a6)

- fix: jump over disabled cell when keyboard navigating [`9c15bb1`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/9c15bb17505ea536c71df8d351a9c01441c635c6)

- fix: if date in month/year disabled the whole month/year disabled [`ee9b673`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/ee9b673a981c436550f7fd3216d7129f2b9fd707)

- fix: string value in `disable` prop doesn't work [`7ce6c73`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/7ce6c73b017fddd35534c2cb4b3b8433895074ec)

## v0.12.0 2018-11-19

- feat: add disableMinute prop to TimeInput (#49) [`#49`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/49)

- feat: keyboard shortcuts support [`0033d62`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/0033d62a8061c3cd1d2d9ff0fad7b0e17b0167a2)

- fix: popup closes on selection [`e3d1807`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/e3d1807d810c06ff32936ab5c4f3ea4aedf12f53)

- fix: extra Tab needed to navigate inside calendar [`5acc549`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/5acc5491de046b80fb3b444b3a664f327a1e15f2)

- fix: remove on focus outline from poped up picker [`550f1a4`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/550f1a494b904811707459932314ad864dd815e8)

## v0.11.0 2018-11-03

- feat: add dateTimeFormat prop to DateTimePicker (#42) [`#42`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/42)

- fix(yearPicker): initialize page with selected value [`6c639aa`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/6c639aa70b53a8c7a56e83c24fdcab8c4aec2aff)

- fix: #28 popup blured when inside Modal [`036a95f`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/036a95f052aefacfaf97afa66cdf09a8598c969a)

- fix: initialDate prevent clearing input field [`8c51722`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/8c51722c670bf0b2a8beedb68550a2ec9b797e2d)

## v0.10.0 2018-10-18

- feat: allow passthrough of mountNode to InputView Popup (#38) [`#38`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/38)

- fix: #39 invalid date when first week in Jan starts with day from prev month (#40) [`#40`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/40)

## v0.9.1 2018-09-30

- feat(preserveViewMode): allow preserveViewMode to reset mode onFocus [`#36`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/36)

## v0.9.0 2018-09-18

- fix: #31 min/maxDate params not working [`b9f335f`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/b9f335f3b8e234549a9c2a144ba277b50bd5a5fe)
- fix: #34 calendar popup unexpectedly closes [`5edea86`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/5edea86ccc9ac27e5af4aa9fb37b95b59a61e95b)
- fix: #33 initialDate doesn't work [`d15f374`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/d15f374b15a181e092561bf959e1986188bda3c1)
- fix: delay handle change on one tick [`4e012f4`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/4e012f4dfdf93d3767b1a84116985a08458ec6a6)
- fix: weeks labels dont change locale [`24b0632`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/24b0632ac2b96bc0db864eb9f285bfb99ac2df6e)

- feat(DateInput): `enable` attribute #30 [`53c19c3`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/53c19c351a3a867ef8f7a0e50bb92c407543cf28)

## v0.8.0 2018-08-04

- feat: `closeOnMouseLeave` prop [`#23`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/23)

- fix: #20 onClick prop got false instead of undefined [`#21`](https://github.com/arfedulov/semantic-ui-calendar-react/pull/21)

- breaking: use Form.Input instead of Input [`abda4fb`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/abda4fb9059dc68ec09da3072e3e1d86463d58b1)


## v0.7.1 2018-07-22

- feat: `disable`, `minDate`, `maxDate` attributes [`af0d3a9`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/af0d3a91933903f5fc82fee83e5a0499f44f544f)
- feat: add `initialDate` attribute [`23e8008`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/23e800851716e0645451c99f2e0084937747a4c6)

- fix(DatesRangeInput): clear selected range if `value` is empty [`3b57013`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/3b57013f3f8bd56092c7612f965894f4efc5109e)
- fix(DateInput): accidental import couses error [`45b9811`](https://github.com/arfedulov/semantic-ui-calendar-react/commit/45b9811e6f780d4df4170bc0aca3ab3171f4539f)
