<script>import { browser } from "$app/environment";
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
import {
  registerEventListeners,
  deRegisterEventListeners,
  registerTimeouts,
  clearTimeouts,
  registerIntervals,
  clearIntervals,
  mountEvent,
  destroyEvent,
  beforeUpdateEvent,
  afterUpdateEvent
} from "./functions.js";
export let P;
let DOMelement;
const nodeName = P._nodeName, children = P.$children, attributes = P.$attrs, innerText = P.$text, hasEvents = !!Object.keys(P._events).length, hasTimeouts = !!P._timeouts.length, hasIntervals = !!P._intervals.length;
if (browser) {
  onMount(() => {
    P._element = DOMelement;
    if (hasEvents) {
      registerEventListeners(DOMelement, P._events);
      if (P._events?.mount) {
        DOMelement.dispatchEvent(mountEvent);
      }
    }
    if (hasTimeouts) {
      registerTimeouts(P._timeouts);
    }
    if (hasIntervals) {
      registerIntervals(P._intervals);
    }
  });
  onDestroy(() => {
    if (hasEvents) {
      if (P._events?.destroy) {
        DOMelement.dispatchEvent(destroyEvent);
      }
      deRegisterEventListeners(DOMelement, P._events);
      DOMelement = null;
    }
    if (hasTimeouts) {
      clearTimeouts(P._timeouts);
    }
    if (hasIntervals) {
      clearIntervals(P._intervals);
    }
  });
  if (hasEvents) {
    if (P._events?.beforeUpdate) {
      beforeUpdate(() => {
        DOMelement.dispatchEvent(beforeUpdateEvent);
      });
    }
    if (P._events?.afterUpdate) {
      afterUpdate(() => {
        DOMelement.dispatchEvent(afterUpdateEvent);
      });
    }
  }
}
</script>

<svelte:element this={nodeName} bind:this={DOMelement} {...$attributes}>
	{$innerText}
	{#each $children as child}
		<svelte:self P={child} />
	{/each}
</svelte:element>
