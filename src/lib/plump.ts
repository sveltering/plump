import { keyValueStore, arrayStore, writableStore } from '@sveltering/custom-store';
import type { KeyValueStore, ArrayStore, WritableStore } from '@sveltering/custom-store';

const nodeNameRegex = /^(\w+)/i,
	idRegex = /\#([\w\-]+)/i,
	classNamesRegex = /\.([\w\-]+)/gi,
	attributesRegex = /\[([a-z\-]+)\s*=\s*(?:(?:(\")*([^\"]+)(\")*)|(?:(\')*([^\']+)(\')*))\]/gi;
class Plump {
	_nodeName: string;
	_element!: HTMLElement;
	_parent: Plump = null as unknown as Plump;
	_position: number = 0;
	$children: ArrayStore<Plump> = arrayStore([]);
	$attrs: KeyValueStore<string> = keyValueStore({});

	_events: { [eventName: string]: { callback: CallableFunction; options: {} }[] } = {};
	_timeouts: { callback: CallableFunction; time: number; timeoutId?: number }[] = [];
	_intervals: { callback: CallableFunction; time: number; intervalId?: number }[] = [];
	constructor(selector: string) {
		let elNodeName = nodeNameRegex.exec(selector),
			elId = idRegex.exec(selector),
			elClassName = classNamesRegex.exec(selector),
			elAttributes = attributesRegex.exec(selector),
			classNames = [];

		this._nodeName = (<string[]>elNodeName)[1] || 'div';
		if (elId) {
			this.id(elId[1]);
		}
		while (elClassName) {
			classNames.push(elClassName[1]);
			elClassName = classNamesRegex.exec(selector);
		}
		if (classNames.length) {
			this.addClass(...classNames);
		}
		while (elAttributes) {
			if (!elAttributes[3]) continue;
			this.attr(elAttributes[1], elAttributes[3]);
			elAttributes = attributesRegex.exec(selector);
		}
		nodeNameRegex.lastIndex = 0;
		idRegex.lastIndex = 0;
		classNamesRegex.lastIndex = 0;
		attributesRegex.lastIndex = 0;
		return this;
	}

	id(id?: undefined): string;
	id(id: string): this;
	id(id: any): any {
		return id ? this.attr('id', id) : this.attr('id');
	}

	addClass(...classNames: string[]): this {
		let newclassNames = ((this.attr('class') || '') + ' ' + classNames.join(' '))
			.split(/(\s+)/)
			.filter((e) => e.trim().length > 0);
		return this.attr('class', [...new Set(newclassNames)].join(' '));
	}

	removeClass(...classNames: string[]): this {
		let newclassNames: any = (this.attr('class') || '')
			.split(/(\s+)/)
			.filter((e) => e.trim().length > 0);
		newclassNames = new Set(newclassNames);
		for (let i = 0, iLen = classNames.length; i < iLen; i++) {
			newclassNames.delete(classNames[i]);
		}
		return this.attr('class', [...newclassNames].join(' '));
	}

	attr(attrName: string): string;
	attr(attrName: string, value: string): this;
	attr(attrName: any, value?: any): any {
		if (!value) {
			return this.$attrs.value?.[attrName];
		}
		this.$attrs.value[attrName] = '' + value;
		return this;
	}

	attrs(attrs?: undefined): { [key: string]: string };
	attrs(attrs: { [key: string]: string }): this;
	attrs(attrs: any): any {
		if (!attrs) {
			return this.$attrs.value;
		}
		attrs = attrs.map((e: string) => e + '');
		this.$attrs.value = {
			...this.$attrs.value,
			...attrs
		};
		return this;
	}

	get $siblings(): ArrayStore<Plump> {
		return this._parent.$children;
	}
	protected static __resetIndexes<Z>($store: ArrayStore<Plump>): void {
		let storeArr = $store.value;
		for (let i = 0, iLen = storeArr.length; i < iLen; i++) {
			$store.value[i]._position = i;
		}
	}
	protected __pluckElementFromParent(element: Plump): Plump {
		if (!element._parent) {
			return element;
		}
		let $siblings = element.$siblings;
		let plucked = $siblings.pluck(element._position) as Plump;
		Plump.__resetIndexes($siblings);
		return plucked;
	}
	protected __append__or__prepend(element: string | Plump, action: 'push' | 'unshift'): void {
		if (typeof element === 'string') {
			element = P(element);
		}
		this.__pluckElementFromParent(element);
		element._parent = this;
		let $children = this.$children;
		$children.value[action](element);
		Plump.__resetIndexes($children);
	}

	protected __insert(element: Plump, after: boolean = true): this {
		let plucked = this.__pluckElementFromParent(this);
		plucked._parent = element._parent;
		let $newSiblings = element.$siblings;
		$newSiblings[after ? 'addAfter' : 'addBefore'](element._position, plucked);
		Plump.__resetIndexes($newSiblings);
		return this;
	}

	protected __remove(): void {
		this.__pluckElementFromParent(this);
		let properties = Object.getOwnPropertyNames(this);
		for (let i = 0, iLen = properties.length; i < iLen; i++) {
			if (properties[i][0] === '$') {
				//@ts-ignore
				this[properties[i]]?.destroy?.();
			}
		}
	}
	empty(): this {
		if (this?.$children) {
			let children = this.$children.value;
			if (children.length) {
				for (let i = 0, iLen = children.length; i < iLen; i++) {
					children[i].remove();
				}
			}
		}
		return this;
	}
	remove(): void {
		this.empty();
		this.__remove();
	}

	append(element: string | Plump): this {
		this.__append__or__prepend(element, 'push');
		return this;
	}
	prepend(element: string | Plump): this {
		this.__append__or__prepend(element, 'unshift');
		return this;
	}
	appendTo(element: Plump): this {
		element.append(this);
		return this;
	}
	prependTo(element: Plump): this {
		element.prepend(this);
		return this;
	}

	insertAfter(element: Plump): this {
		return this.__insert(element, true);
	}
	insertBefore(element: Plump): this {
		return this.__insert(element, false);
	}
	insertStart(element?: Plump): this {
		return this.prependTo(element || this._parent);
	}
	insertEnd(element?: Plump): this {
		return this.appendTo(element || this._parent);
	}

	on(event: string, callback: CallableFunction, options: {} = {}): this {
		if (!this._events.hasOwnProperty(event)) {
			this._events[event] = [];
		}
		this._events[event].push({ callback, options });
		return this;
	}
	timeout(callback: CallableFunction, time: number): this {
		this._timeouts.push({ callback, time });
		return this;
	}
	interval(callback: CallableFunction, time: number) {
		this._intervals.push({ callback, time });
		return this;
	}
}
export type { Plump };
export default function P(selector: string): Plump {
	return new Plump(selector);
}
