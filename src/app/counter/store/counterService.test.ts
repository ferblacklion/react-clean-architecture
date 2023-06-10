import { vi } from "vitest";
import { getCounter, updateCounter } from "./counterService";

describe("store:counterService", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  test("should return the counter value properly", async () => {
    const counter = await getCounter();
    vi.advanceTimersByTime(1000);
    expect(counter).toEqual({ value: 0 });
  });
  test("should update the counter value properly", async () => {
    const counterExpected = { value: 5 };
    const counter = await updateCounter(counterExpected);
    vi.advanceTimersByTime(1000);
    expect(counter).toEqual(counterExpected);
  });
});
