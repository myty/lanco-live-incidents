import { TypedEvent } from "utils/typed-event";
import { describe, expect, it } from "vitest";

describe("TypedEvent", () => {
  it("is an Event", () => {
    // Arrange
    class TestEvent extends TypedEvent<string>("event") {}

    // Act
    const event = new TestEvent("test");

    // Assert
    expect(event instanceof Event).toBeTruthy();
  });
});
