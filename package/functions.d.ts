export declare const mountEvent: Event;
export declare const destroyEvent: Event;
export declare const beforeUpdateEvent: Event;
export declare const afterUpdateEvent: Event;
export declare const handleError: CallableFunction;
export declare const debounce: (callback: CallableFunction, timeout: number) => (...args: any[]) => void;
export declare const registerEventListeners: (element: any, events?: {
    [eventName: string]: {
        callback: CallableFunction;
        options: {
            [key: string]: any;
            debounce?: number | undefined;
        };
    }[];
}) => void;
export declare const deRegisterEventListeners: (element: any, events?: {
    [eventName: string]: {
        callback: CallableFunction;
        options: {
            [key: string]: any;
        };
    }[];
}) => void;
export declare const registerTimeouts: (timeouts: {
    callback: CallableFunction;
    time: number;
    timeoutId?: number;
}[]) => void;
export declare const clearTimeouts: (timeouts: {
    callback: CallableFunction;
    time: number;
    timeoutId?: number;
}[]) => void;
export declare const registerIntervals: (intervals: {
    callback: CallableFunction;
    time: number;
    intervalId?: number;
}[]) => void;
export declare const clearIntervals: (intervals: {
    callback: CallableFunction;
    time: number;
    intervalId?: number;
}[]) => void;
