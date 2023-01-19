export const mountEvent = new Event('mount');
export const destroyEvent = new Event('destroy');
export const beforeUpdateEvent = new Event('beforeUpdate');
export const afterUpdateEvent = new Event('afterUpdate');
export const handleError = (error) => {
    if (typeof error === 'function') {
        return (...args) => {
            throw new Error(error(...args));
        };
    }
    throw new Error(error);
};
export const debounce = (callback, timeout) => {
    if (timeout) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(function () {
                //@ts-ignore
                callback.apply(this, args);
            }, timeout);
        };
    }
    else {
        return function (...args) {
            //@ts-ignore
            callback.apply(this, args);
        };
    }
};
export const registerEventListeners = (element, events = {}) => {
    for (let eventName in events) {
        for (let i = 0, iLen = events[eventName].length; i < iLen; i++) {
            let args = events[eventName][i];
            if (args.options?.debounce) {
                args.callback = debounce(args.callback, args.options.debounce);
                delete args.options.debounce;
                element.addEventListener(eventName, args.callback, args.options);
            } //
            else {
                element.addEventListener(eventName, args.callback, args.options);
            }
        }
    }
};
export const deRegisterEventListeners = (element, events = {}) => {
    for (let eventName in events) {
        for (let i = 0, iLen = events[eventName].length; i < iLen; i++) {
            let args = events[eventName][i];
            element.removeEventListener(eventName, args.callback, args.options);
        }
    }
};
export const registerTimeouts = (timeouts) => {
    for (let i = 0, iLen = timeouts.length; i < iLen; i++) {
        let timeout = timeouts[i];
        timeout.timeoutId = setTimeout(timeout.callback, timeout.time);
    }
};
export const clearTimeouts = (timeouts) => {
    for (let i = 0, iLen = timeouts.length; i < iLen; i++) {
        clearTimeout(timeouts[i].timeoutId);
    }
};
export const registerIntervals = (intervals) => {
    for (let i = 0, iLen = intervals.length; i < iLen; i++) {
        let interval = intervals[i];
        interval.intervalId = setInterval(interval.callback, interval.time);
    }
};
export const clearIntervals = (intervals) => {
    for (let i = 0, iLen = intervals.length; i < iLen; i++) {
        clearInterval(intervals[i].intervalId);
    }
};
