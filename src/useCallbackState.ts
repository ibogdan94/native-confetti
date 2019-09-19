import { useEffect, useState, useRef } from "react-native";

export function useCallbackState<S>(defaultState: S): [S, any] {
    const [value, setValue] = useState(defaultState);
    const firstMount = useRef(true);
    const callback = useRef();

    const setState = (state: S, fn: any): void => {
        setValue(state);
        callback.current = fn;
    };

    useEffect(() => {
        if (firstMount.current) {
            firstMount.current = false;
            return;
        }

        if (callback.current) {
            callback.current(value);
        }
    }, [value]);

    return [value, setState];
}
