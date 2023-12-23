/**
 * @vitest-environment jsdom
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useWebShare } from "hooks/use-web-share";

describe("useWebShare", () => {
  it("initializes", async () => {
    // Arrange, Act
    const { result } = renderHook(() => {
      return useWebShare();
    });

    // Assert
    expect(result.current).toBeDefined();
    expect(result.current).toBeTypeOf("object");
    expect(result.current.isSharing).toBe(false);
    expect(result.current.enabled).toBeDefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.share).toBeTypeOf("function");
  });

  describe("when no browser sharing capability", () => {
    it("is not enabled", async () => {
      // Arrange, Act
      const { result } = renderHook(() => {
        return useWebShare();
      });

      // Act
      const { enabled } = result.current;

      // Assert
      expect(enabled).toBe(false);
    });
  });

  describe("when browser has sharing capability", () => {
    beforeEach(() => {
      vi.stubGlobal("navigator", { share: vi.fn() });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("is enabled", async () => {
      // Arrange, Act
      const { result } = renderHook(() => {
        return useWebShare();
      });

      // Act
      const { enabled } = result.current;

      // Assert
      expect(enabled).toBe(true);
    });
  });

  describe("share()", () => {
    describe("when browser has sharing capability", () => {
      afterEach(() => {
        vi.resetAllMocks();
      });

      it("calls navigator.share", async () => {
        // Arrange
        const mockShare: Mock<Record<string, unknown>[], Promise<void>> = vi.fn(() => Promise.resolve());
        vi.stubGlobal("navigator", { share: mockShare });
        const { result } = renderHook(() => {
          return useWebShare();
        });

        // Act
        act(() => {
          result.current.share({});
        });

        // Assert
        expect(mockShare).toBeCalled();
      });

      describe("when successful", () => {
        it("is updates isSharing", async () => {
          // Arrange
          vi.stubGlobal("navigator", {
            share: () => Promise.resolve(),
          });
          const all: ReturnType<typeof useWebShare>[] = [];
          const { result, rerender } = renderHook(() => {
            const value = useWebShare();
            all.push(value);
            return value;
          });

          // Act
          act(() => {
            result.current.share({});
          });

          // Assert
          expect(result.current.isSharing).toBe(true);

          await waitFor(() => !result.current.isSharing);
          rerender();

          expect(result.current.isSharing).toBe(false);
        });
      });

      describe("when errored", () => {
        it("is updates error", async () => {
          // Arrange
          const errorMessage = "This is an error";
          vi.stubGlobal("navigator", {
            share: () => Promise.reject(errorMessage),
          });
          const all: ReturnType<typeof useWebShare>[] = [];
          const { result, rerender } = renderHook(() => {
            const value = useWebShare();
            all.push(value);
            return value;
          });

          // Act
          act(() => {
            result.current.share({});
          });

          // Assert
          expect(result.current.isSharing).toBe(true);

          await waitFor(() => !result.current.isSharing);
          rerender();

          expect(result.current.error).toBe(errorMessage);
          expect(result.current.isSharing).toBe(false);
        });
      });
    });
  });
});
