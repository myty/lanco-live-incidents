import { TypedEventTarget } from "utils/typed-event-target";
import { describe, it, expect } from "vitest";

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
                }>() {}
                const testClass = new TestClass();

                // Act
                const result = testClass.dispatchEvent(
                    new TestEvent("event-one"),
                );

                // Assert
                expect(result).toBeTruthy();
            });
        });
    });
});
