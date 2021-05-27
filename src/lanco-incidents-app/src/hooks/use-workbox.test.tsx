import { render, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import useWorkbox from "hooks/use-workbox";
import React from "react";
import * as workboxWindow from "workbox-window";

const mockRegister = jest.fn();
const mockGetSW = jest.fn().mockResolvedValue({});
const mockedWorkbox = jest
    .spyOn(workboxWindow, "Workbox")
    .mockImplementation((scriptUrl: string, registrationOptions?: any) => {
        return {
            register: mockRegister,
            getSW: mockGetSW,
        } as unknown as workboxWindow.Workbox;
    });

describe("useWorkbox", () => {
    beforeEach(() => jest.clearAllMocks());

    test("hook initializes successfully", async () => {
        // Arrange
        const results = Array<any>();
        const TestComponent = () => {
            const result = useWorkbox({
                serviceWorkerPath: "/sw.js",
            });

            results.push(result);

            return null;
        };

        // Act
        render(<TestComponent />);

        await waitFor(() => results.length === 1);

        // Assert
        expect(results[0]).toBeDefined();
    });

    test("hook initially returns undefined service worker", async () => {
        // Arrange
        const serviceWorkers = Array<ServiceWorker | undefined>();
        const TestComponent = () => {
            const { serviceWorker } = useWorkbox({
                serviceWorkerPath: "/sw.js",
            });

            serviceWorkers.push(serviceWorker);

            return null;
        };

        // Act
        render(<TestComponent />);

        await waitFor(() => serviceWorkers.length === 1);

        // Assert
        expect(serviceWorkers[0]).toBeUndefined();
    });

    xtest("hook returns service worker after workbox is loaded", async () => {
        // Arrange
        const { result, waitForNextUpdate } = renderHook(
            ({ serviceWorkerPath }) => useWorkbox({ serviceWorkerPath }),
            { initialProps: { serviceWorkerPath: "/sw.js" } }
        );

        // Act
        await waitForNextUpdate();

        // Assert
        expect(result.current).toBeDefined();
    });

    xtest("hook calls Workbox one time", async () => {
        // Arrange
        const { waitForNextUpdate } = renderHook(
            ({ serviceWorkerPath }) => useWorkbox({ serviceWorkerPath }),
            { initialProps: { serviceWorkerPath: "/sw.js" } }
        );

        // Act
        await waitForNextUpdate();

        // Assert
        expect(mockedWorkbox).toBeCalledTimes(1);
    });
});
