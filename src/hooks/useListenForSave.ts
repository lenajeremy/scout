import * as React from 'react'
import { useGetOS } from './useGetOS';

export function useListenForSave(callback: () => void, deps: React.DependencyList) {
    const os = useGetOS();

    const onKeyDown = React.useCallback((e: KeyboardEvent) => {
        if (os === "macOS") {
            if (e.key == "s" && e.metaKey) {
                e.preventDefault();
                callback()
            }
        } else if (os === "windows") {
            if (e.key == "s" && e.ctrlKey) {
                e.preventDefault();
                callback()
            }
        }
    }, [os, callback]);

    React.useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, deps);
}