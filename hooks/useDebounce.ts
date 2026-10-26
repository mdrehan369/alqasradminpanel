"use client";

import { useEffect, useRef, useState } from "react";

export default function useDebounce<T>(value: T, timeout: number = 1000) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const timer = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            setDebouncedValue(value);
            timer.current = null;
        }, timeout);
    }, [value]);

    return debouncedValue;
}
