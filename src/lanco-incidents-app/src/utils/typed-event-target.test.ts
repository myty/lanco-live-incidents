import { TypedEventTarget } from "utils/typed-event-target";
import { describe, expect, it, vi } from "vitest";

describe("TypedEventTarget", () => {
  it("is an EventTarget", () => {
    // Arrange
    class TestClass extends TypedEventTarget<{
      "event-one": Event;
    }>() {}

    // Act
    const result = new TestClass();

    // Assert
    expect(result instanceof EventTarget).toBeTruthy();
  });

  describe("dispatchEvent()", () => {
    describe("when EventsMap has Custom events", () => {
      it("it accepts custom events", () => {
        // Arrange
        class TestEvent extends Event {}
        class TestClass extends TypedEventTarget<{
          "event-one": TestEvent;
          "event-two": TestEvent;
        }>() {}
        const testClass = new TestClass();

        // Act
        const result = testClass.dispatchEvent(new TestEvent("event-one"));

        // Assert
        expect(result).toBeTruthy();
      });
    });
  });

  describe("addEventListener()", () => {
    describe("when dispatchEvent", () => {
      it("it calls eventListener", () => {
        // Arrange
        const eventOne = "event-one" as const;
        class TestClass extends TypedEventTarget<{
          [eventOne]: Event;
        }>() {}
        const eventListener = vi.fn();

        const testClass = new TestClass();
        testClass.addEventListener(eventOne, eventListener);

        // Act
        testClass.dispatchEvent(new Event(eventOne));

        // Assert
        expect(eventListener).toBeCalled();
      });
    });

    describe("when dispatchEvent of unknown event", () => {
      it("it does not call eventListener", () => {
        // Arrange
        const eventOne = "event-one" as const;
        const eventTwo = "event-two" as const;
        class TestClass extends TypedEventTarget<{
          [eventOne]: Event;
        }>() {}
        const eventListener = vi.fn();

        const testClass = new TestClass();
        testClass.addEventListener(eventOne, eventListener);

        // Act
        testClass.dispatchEvent(new Event(eventTwo));

        // Assert
        expect(eventListener).not.toBeCalled();
      });
    });
  });
});
