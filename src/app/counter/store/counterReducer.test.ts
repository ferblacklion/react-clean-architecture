import { describe, test } from "vitest";
import { counterReducer } from "./counterReducer";
import {
  GET_COUNTER,
  GET_COUNTER_SUCCESS,
  SET_COUNTER,
  UPDATE_COUNTER,
  UPDATE_COUNTER_SUCCESS,
} from "./counterActionTypes";
const INITIAL_STATE = {
  counter: undefined,
  isLoading: false,
  isUpdating: false,
};
describe("store:counterReducer", () => {
  test("should return default state if any action type doesn't match", () => {
    const state = counterReducer(INITIAL_STATE, { type: "" });

    expect(state).toStrictEqual(INITIAL_STATE);
  });

  test("should set counter properly", () => {
    const stateExpected = { ...INITIAL_STATE, counter: { value: 1 } };

    const state = counterReducer(INITIAL_STATE, {
      type: SET_COUNTER,
      counter: stateExpected.counter,
    });

    expect(state).toStrictEqual(stateExpected);
  });

  test("should get counter properly", () => {
    const stateExpected = { ...INITIAL_STATE, isLoading: true };

    const state = counterReducer(INITIAL_STATE, {
      type: GET_COUNTER,
    });

    expect(state).toStrictEqual(stateExpected);
  });

  test("should get counter when is loaded ", () => {
    const stateExpected = {
      ...INITIAL_STATE,
      isLoading: false,
      counter: { value: 1 },
    };

    const state = counterReducer(INITIAL_STATE, {
      type: GET_COUNTER_SUCCESS,
      counter: stateExpected.counter,
    });

    expect(state).toStrictEqual(stateExpected);
  });

  test("should update counter properly", () => {
    const stateExpected = {
      ...INITIAL_STATE,
      isUpdating: true,
    };

    const state = counterReducer(INITIAL_STATE, {
      type: UPDATE_COUNTER,
    });

    expect(state).toStrictEqual(stateExpected);
  });

  test("should return updated counter", () => {
    const stateExpected = {
      ...INITIAL_STATE,
      isUpdating: false,
    };

    const state = counterReducer(INITIAL_STATE, {
      type: UPDATE_COUNTER_SUCCESS,
    });

    expect(state).toStrictEqual(stateExpected);
  });
});
