import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "iamelilla:demo-usage:v1:";
const DEFAULT_MAX_USES = 2;

interface UsageState {
	used: number;
	remaining: number;
	max: number;
	blocked: boolean;
	loaded: boolean;
}

/**
 * Tracks how many times an anonymous visitor has used a public demo
 * tool from this browser. Persists in localStorage under a versioned
 * key so we can rotate it if needed.
 *
 * Bypass is trivial (clear storage / incognito), but it's enough
 * friction to stop casual abuse. Backed by a hard product decision:
 * the limit does NOT renew — once exhausted, the user has to email us.
 */
export function useDemoUsageLimit(toolKey: string, max: number = DEFAULT_MAX_USES) {
	const storageKey = STORAGE_PREFIX + toolKey;
	const [state, setState] = useState<UsageState>({
		used: 0,
		remaining: max,
		max,
		blocked: false,
		loaded: false,
	});

	const read = useCallback((): number => {
		if (typeof window === "undefined") return 0;
		const raw = window.localStorage.getItem(storageKey);
		const parsed = raw ? parseInt(raw, 10) : 0;
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
	}, [storageKey]);

	useEffect(() => {
		const used = read();
		setState({
			used,
			remaining: Math.max(0, max - used),
			max,
			blocked: used >= max,
			loaded: true,
		});
	}, [read, max]);

	const increment = useCallback(() => {
		const next = read() + 1;
		if (typeof window !== "undefined") {
			window.localStorage.setItem(storageKey, String(next));
		}
		setState({
			used: next,
			remaining: Math.max(0, max - next),
			max,
			blocked: next >= max,
			loaded: true,
		});
		return next >= max;
	}, [read, storageKey, max]);

	return {
		...state,
		increment,
	};
}
