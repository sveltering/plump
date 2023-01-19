import type { KeyValueStore, ArrayStore, WritableStore } from '@sveltering/custom-store';
declare class Plump {
    _nodeName: string;
    _element: HTMLElement;
    _parent: Plump;
    _position: number;
    $children: ArrayStore<Plump>;
    $attrs: KeyValueStore<string>;
    $text: WritableStore<string>;
    _events: {
        [eventName: string]: {
            callback: CallableFunction;
            options: {};
        }[];
    };
    _timeouts: {
        callback: CallableFunction;
        time: number;
        timeoutId?: number;
    }[];
    _intervals: {
        callback: CallableFunction;
        time: number;
        intervalId?: number;
    }[];
    constructor(selector: string);
    id(id?: undefined): string;
    id(id: string): this;
    addClass(...classNames: string[]): this;
    removeClass(...classNames: string[]): this;
    attr(attrName: string): string;
    attr(attrName: string, value: string): this;
    attrs(attrs?: undefined): {
        [key: string]: string;
    };
    attrs(attrs: {
        [key: string]: string;
    }): this;
    text(innerText: string): this;
    get $siblings(): ArrayStore<Plump>;
    protected static __resetIndexes<Z>($store: ArrayStore<Plump>): void;
    protected __pluckElementFromParent(element: Plump): Plump;
    protected __append__or__prepend(element: string, action: 'push' | 'unshift'): Plump;
    protected __append__or__prepend(element: Plump, action: 'push' | 'unshift'): this;
    protected __insert(element: Plump, after?: boolean): this;
    protected __remove(): void;
    empty(): this;
    remove(): void;
    append(element: string): Plump;
    append(element: Plump): this;
    prepend(element: string): Plump;
    prepend(element: Plump): this;
    appendTo(element: Plump): this;
    prependTo(element: Plump): this;
    insertAfter(element: Plump): this;
    insertBefore(element: Plump): this;
    insertStart(element?: Plump): this;
    insertEnd(element?: Plump): this;
    on(event: string, callback: CallableFunction, options?: {}): this;
    timeout(callback: CallableFunction, time: number): this;
    interval(callback: CallableFunction, time: number): this;
}
export type { Plump };
export default function P(selector: string): Plump;
