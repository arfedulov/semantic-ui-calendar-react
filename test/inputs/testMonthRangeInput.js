import {assert} from "chai";
import {
  mount
} from "enzyme";
import moment from "moment";
import * as sinon from "sinon";
import * as React from "react";
import * as _ from "lodash";
import MonthRangeInput from "../../src/inputs/MonthRangeInput";

describe("<MonthRangeInput />: handleSelect_from", () => {
  it("call `onChange`", () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<MonthRangeInput onChange={onChangeFake}/>);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    wrapper.instance().handleSelect("click", {value: {start: moment().set("month", 2)}});
    const firstCalledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, "`onChange` callback called once");
    assert.equal(firstCalledWithArgs[0], "click", "correct first argument");
    assert(_.isString(firstCalledWithArgs[1].value), "value is string");
    assert.equal(firstCalledWithArgs[1].value, `03-${currentYear} - `, "correct value");
  });
});

describe("<MonthRangeInput />: handleSelect_from_to", ()=>{
  it("call `onChange`", () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<MonthRangeInput onChange={onChangeFake}/>);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    wrapper.instance().handleSelect("click", {value: {start: moment().set("month", 2), end: moment().set("month", 5)}});
    const secondCalledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, "`onChange` callback called twice");
    assert.equal(secondCalledWithArgs[0], "click", "correct first argument");
    assert(_.isString(secondCalledWithArgs[1].value), "value is string");
    assert.equal(secondCalledWithArgs[1].value, `03-${currentYear} - 06-${currentYear}`, "correct value");
  });
});
