import { keyValueStore, arrayStore, writableStore } from '@sveltering/custom-store';
const nodeNameRegex = /^(\w+)/i, idRegex = /\#([\w\-]+)/i, classNamesRegex = /\.([\w\-]+)/gi, attributesRegex = /\[([a-z\-]+)\s*=\s*(?:(?:(\")*([^\"]+)(\")*)|(?:(\')*([^\']+)(\')*))\]/gi;
class Plump {
    _nodeName;
    _element;
    _parent = null;
    _position = 0;
    $children = arrayStore([]);
    $attrs = keyValueStore({});
    $text = writableStore('');
    _events = {};
    _timeouts = [];
    _intervals = [];
    constructor(selector) {
        let elNodeName = nodeNameRegex.exec(selector), elId = idRegex.exec(selector), elClassName = classNamesRegex.exec(selector), elAttributes = attributesRegex.exec(selector), classNames = [];
        this._nodeName = elNodeName[1] || 'div';
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
            if (!elAttributes[3])
                continue;
            this.attr(elAttributes[1], elAttributes[3]);
            elAttributes = attributesRegex.exec(selector);
        }
        nodeNameRegex.lastIndex = 0;
        idRegex.lastIndex = 0;
        classNamesRegex.lastIndex = 0;
        attributesRegex.lastIndex = 0;
        return this;
    }
    id(id) {
        return id ? this.attr('id', id) : this.attr('id');
    }
    addClass(...classNames) {
        let newclassNames = ((this.attr('class') || '') + ' ' + classNames.join(' '))
            .split(/(\s+)/)
            .filter((e) => e.trim().length > 0);
        return this.attr('class', [...new Set(newclassNames)].join(' '));
    }
    removeClass(...classNames) {
        let newclassNames = (this.attr('class') || '')
            .split(/(\s+)/)
            .filter((e) => e.trim().length > 0);
        newclassNames = new Set(newclassNames);
        for (let i = 0, iLen = classNames.length; i < iLen; i++) {
            newclassNames.delete(classNames[i]);
        }
        return this.attr('class', [...newclassNames].join(' '));
    }
    attr(attrName, value) {
        if (!value) {
            return this.$attrs.value?.[attrName];
        }
        this.$attrs.value[attrName] = '' + value;
        return this;
    }
    attrs(attrs) {
        if (!attrs) {
            return this.$attrs.value;
        }
        attrs = attrs.map((e) => e + '');
        this.$attrs.value = {
            ...this.$attrs.value,
            ...attrs
        };
        return this;
    }
    text(innerText) {
        this.$text.value = innerText;
        return this;
    }
    get $siblings() {
        return this._parent.$children;
    }
    static __resetIndexes($store) {
        let storeArr = $store.value;
        for (let i = 0, iLen = storeArr.length; i < iLen; i++) {
            $store.value[i]._position = i;
        }
    }
    __pluckElementFromParent(element) {
        if (!element._parent) {
            return element;
        }
        let $siblings = element.$siblings;
        let plucked = $siblings.pluck(element._position);
        Plump.__resetIndexes($siblings);
        return plucked;
    }
    __append__or__prepend(element, action) {
        let newElement = typeof element === 'string';
        if (newElement) {
            element = P(element);
        }
        this.__pluckElementFromParent(element);
        element._parent = this;
        let $children = this.$children;
        $children.value[action](element);
        Plump.__resetIndexes($children);
        return newElement ? element : this;
    }
    __insert(element, after = true) {
        let plucked = this.__pluckElementFromParent(this);
        plucked._parent = element._parent;
        let $newSiblings = element.$siblings;
        $newSiblings[after ? 'addAfter' : 'addBefore'](element._position, plucked);
        Plump.__resetIndexes($newSiblings);
        return this;
    }
    __remove() {
        this.__pluckElementFromParent(this);
        let properties = Object.getOwnPropertyNames(this);
        for (let i = 0, iLen = properties.length; i < iLen; i++) {
            if (properties[i][0] === '$') {
                //@ts-ignore
                this[properties[i]]?.destroy?.();
            }
        }
    }
    empty() {
        this.$text.value = '';
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
    remove() {
        this.empty();
        this.__remove();
    }
    append(element) {
        return this.__append__or__prepend(element, 'push');
    }
    prepend(element) {
        return this.__append__or__prepend(element, 'unshift');
    }
    appendTo(element) {
        element.append(this);
        return this;
    }
    prependTo(element) {
        element.prepend(this);
        return this;
    }
    insertAfter(element) {
        return this.__insert(element, true);
    }
    insertBefore(element) {
        return this.__insert(element, false);
    }
    insertStart(element) {
        return this.prependTo(element || this._parent);
    }
    insertEnd(element) {
        return this.appendTo(element || this._parent);
    }
    on(event, callback, options = {}) {
        if (!this._events.hasOwnProperty(event)) {
            this._events[event] = [];
        }
        this._events[event].push({ callback, options });
        return this;
    }
    timeout(callback, time) {
        this._timeouts.push({ callback, time });
        return this;
    }
    interval(callback, time) {
        this._intervals.push({ callback, time });
        return this;
    }
}
export default function P(selector) {
    return new Plump(selector);
}
