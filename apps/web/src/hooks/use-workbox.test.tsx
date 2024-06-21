import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useWorkbox from "../hooks/use-workbox";

describe("useWorkbox", () => {
  it("hook initializes successfully", async () => {
    // Arrange, Act
    const { result } = renderHook(() => {
      return useWorkbox({
        serviceWorkerPath: "/sw.js",
      });
    });

    // Assert
    expect(result.current).toBeDefined();
  });
});
