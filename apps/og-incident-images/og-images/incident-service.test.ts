import { assertSpyCall, returnsNext, stub } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";
import { IncidentServiceFactory } from "./incident-service.ts";
import { assertEquals, assertExists } from "@std/assert";

function stubJsonFetch<T>(json: T) {
  return stub(
    globalThis,
    "fetch",
    returnsNext([Promise.resolve({
      json: () => json,
    }) as unknown as Promise<Response>]),
  );
}

describe("IncidentService", () => {
  it("create()", async () => {
    // Arrange
    const apiUrl = "http://localhost:8080";
    Deno.env.set("IncidentsApi", apiUrl);

    const incident = {
      id: "1",
      location: "location",
      type: "type",
      subType: "subType",
    };

    //mock fetch
    const fetchStub = stubJsonFetch([incident]);

    // Act
    const result = await IncidentServiceFactory.create().getIncident(
      incident.id,
    );

    // Assert
    assertExists(result);
    assertEquals(result, incident);
    assertSpyCall(fetchStub, 0, {
      args: [apiUrl],
    });

    // Cleanup
    fetchStub.restore();
  });
});
