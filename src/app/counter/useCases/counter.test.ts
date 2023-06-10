import { afterAll, beforeAll, describe, vi } from "vitest";
import { incrementCounterUseCase } from "./incrementCounterUseCase";
import { UpdateCounterStore } from "./updateCounterUseCase";
import { decrementCounterUseCase } from "./decrementCounterUseCase";

describe("counter:use-cases", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  test("incrementCounterUseCase - should increment properly", () => {
    const storeMock: UpdateCounterStore = {
      counter: { value: 0 },
      updateCounter: vi.fn(),
      setCounter: vi.fn(),
    };

    incrementCounterUseCase(storeMock);
    vi.advanceTimersByTime(500);

    expect(storeMock.setCounter).toBeCalledTimes(1);
    expect(storeMock.setCounter).toBeCalledWith({
      value: 1,
    });

    incrementCounterUseCase({ ...storeMock, counter: { value: 1 } });
    vi.advanceTimersByTime(500);

    expect(storeMock.updateCounter).toBeCalledTimes(2);
    expect(storeMock.updateCounter).toBeCalledWith({
      value: 2,
    });
  });

  test("decrementCounterUseCase - should decrement properly", () => {
    const storeMock: UpdateCounterStore = {
      counter: { value: 3 },
      updateCounter: vi.fn(),
      setCounter: vi.fn(),
    };

    decrementCounterUseCase(storeMock);
    vi.advanceTimersByTime(500);

    expect(storeMock.setCounter).toBeCalledTimes(1);
    expect(storeMock.setCounter).toBeCalledWith({
      value: 2,
    });

    decrementCounterUseCase({ ...storeMock, counter: { value: 1 } });
    vi.advanceTimersByTime(500);

    expect(storeMock.updateCounter).toBeCalledTimes(2);
    expect(storeMock.updateCounter).toBeCalledWith({
      value: 0,
    });
  });
});
