import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom doesn't implement matchMedia; polyfill so prefers-reduced-motion logic works in tests
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// jsdom doesn't implement IntersectionObserver
class IntersectionObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	takeRecords = vi.fn(() => []);
	root = null;
	rootMargin = "";
	thresholds = [];
}
Object.defineProperty(window, "IntersectionObserver", {
	writable: true,
	value: IntersectionObserverMock,
});
Object.defineProperty(global, "IntersectionObserver", {
	writable: true,
	value: IntersectionObserverMock,
});
