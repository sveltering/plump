import { SvelteComponentTyped } from "svelte";
import type { Plump } from './plump.js';
declare const __propDef: {
    props: {
        P: Plump;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PlumpProps = typeof __propDef.props;
export type PlumpEvents = typeof __propDef.events;
export type PlumpSlots = typeof __propDef.slots;
export default class Plump extends SvelteComponentTyped<PlumpProps, PlumpEvents, PlumpSlots> {
}
export {};
