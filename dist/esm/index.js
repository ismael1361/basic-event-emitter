const _subscriptions = Symbol("subscriptions");
const _oneTimeEvents = Symbol("oneTimeEvents");
function runCallback(callback, ...arg) {
    callback(...arg);
}
/**
 * BasicEventEmitter class
 */
export class BasicEventEmitter {
    [_subscriptions];
    [_oneTimeEvents];
    _ready = false;
    /**
     * Create a new BasicEventEmitter
     */
    constructor() {
        this[_subscriptions] = [];
        this[_oneTimeEvents] = new Map();
        this.on("internal_ready", () => {
            this._ready = true;
        });
    }
    /**
     * Wait for the emitter to be ready
     * @param callback Callback to call when the emitter is ready
     * @returns Promise
     *
     * @example
     * const emitter = new BasicEventEmitter<{}>();
     *
     * emitter.ready(() => {
     *     console.log("Emitter is ready");
     * });
     *
     * emitter.prepared = true;
     * // Output: Emitter is ready
     */
    async ready(callback) {
        if (this._ready) {
            const response = await callback?.();
            return Promise.resolve(response);
        }
        return new Promise((resolve) => {
            this.once("internal_ready", (async () => {
                const response = await callback?.();
                resolve(response);
            }));
        });
    }
    /**
     * Property to get the emitter as prepared
     * @returns boolean
     *
     * @example
     * const emitter = new BasicEventEmitter<{}>();
     *
     * emitter.ready(() => {
     *      console.log("Emitter is ready");
     * });
     *
     * console.log(emitter.prepared);
     * // Output: false
     *
     * emitter.prepared = true;
     * console.log(emitter.prepared);
     * // Output: true
     */
    get prepared() {
        return this._ready;
    }
    /**
     * Property to set the emitter as prepared
     * @param value Value to set
     *
     * @example
     * const emitter = new BasicEventEmitter<{}>();
     *
     * emitter.ready(() => {
     *      console.log("Emitter is ready");
     * });
     *
     * emitter.prepared = true;
     * // Output: Emitter is ready
     */
    set prepared(value) {
        if (value === true) {
            this.emit("internal_ready");
        }
        this._ready = value;
    }
    /**
     * Clear all events
     * @returns void
     * @example
     * const emitter = new BasicEventEmitter<{}>();
     * emitter.clearEvents();
     * // All events are cleared
     */
    clearEvents() {
        this[_subscriptions] = [];
        this[_oneTimeEvents].clear();
    }
    /**
     * Add a listener to an event
     * @param event Event to listen to
     * @param callback Callback to call when the event is emitted
     * @returns BasicEventHandler
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * emitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    on(event, callback) {
        if (this[_oneTimeEvents].has(event)) {
            runCallback(callback, ...(this[_oneTimeEvents].get(event) ?? []));
        }
        else {
            this[_subscriptions].push({ event, callback: callback, once: false });
        }
        const self = this;
        return {
            stop() {
                self.off(event, callback);
            },
            remove() {
                this.stop();
            },
        };
    }
    /**
     * Remove a listener from an event
     * @param event Event to remove the listener from
     * @param callback Callback to remove
     * @returns BasicEventEmitter
     *
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * const listener = (name) => {
     *      console.log(`Hello, ${name}!`);
     * }
     *
     * emitter.on("greet", listener);
     * emitter.off("greet", listener);
     *
     * emitter.emit("greet", "Alice");
     * // No output
     */
    off(event, callback) {
        this[_subscriptions] = this[_subscriptions].filter((s) => s.event !== event || (callback && s.callback !== callback));
        return this;
    }
    /**
     * Add a listener that will be removed after being called once
     * @param event Event to listen to
     * @param callback Callback to call when the event is emitted
     * @returns Promise that resolves when the event is emitted
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * emitter.once("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    once(event, callback) {
        return new Promise((resolve) => {
            const ourCallback = (...arg) => {
                const r = callback?.(...arg);
                resolve(r);
            };
            if (this[_oneTimeEvents].has(event)) {
                runCallback(ourCallback, ...(this[_oneTimeEvents].get(event) ?? []));
            }
            else {
                this[_subscriptions].push({
                    event,
                    callback: ourCallback,
                    once: true,
                });
            }
        });
    }
    /**
     * Remove a listener that was added with `once`
     * @param event Event to remove the listener from
     * @param callback Callback to remove
     * @returns BasicEventEmitter
     *
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * const listener = (name) => {
     *      console.log(`Hello, ${name}!`);
     * }
     *
     * emitter.once("greet", listener);
     * emitter.offOnce("greet", listener);
     */
    offOnce(event, callback) {
        this[_subscriptions] = this[_subscriptions].filter((s) => s.event !== event || (callback && s.callback !== callback) || !s.once);
        return this;
    }
    /**
     * Emit an event
     * @param event Event to emit
     * @param arg Arguments to pass to the event
     * @returns BasicEventEmitter
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * emitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    emit(event, ...arg) {
        if (this[_oneTimeEvents].has(event)) {
            throw new Error(`Event "${String(event)}" was supposed to be emitted only once`);
        }
        for (let i = 0; i < this[_subscriptions].length; i++) {
            const s = this[_subscriptions][i];
            if (s.event !== event) {
                continue;
            }
            runCallback(s.callback, ...arg);
            if (s.once) {
                this[_subscriptions].splice(i, 1);
                i--;
            }
        }
        return this;
    }
    /**
     * Emit an event only once
     * @param event Event to emit
     * @param arg Arguments to pass to the event
     * @returns BasicEventEmitter
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * emitter.emitOnce("greet", "Alice");
     * emitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Bob");
     * // Output: Hello, Alice!
     */
    emitOnce(event, ...arg) {
        if (this[_oneTimeEvents].has(event)) {
            throw new Error(`Event "${String(event)}" was supposed to be emitted only once`);
        }
        this.emit(event, ...arg);
        this[_oneTimeEvents].set(event, arg); // Mark event as being emitted once for future subscribers
        this.offOnce(event); // Remove all listeners for this event, they won't fire again
        return this;
    }
    /**
     * Pipe events from one emitter to another
     * @param event Event to pipe
     * @param eventEmitter Emitter to pipe to
     * @returns BasicEventHandler
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * const anotherEmitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * emitter.pipe("greet", anotherEmitter);
     *
     * anotherEmitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    pipe(event, eventEmitter) {
        return this.on(event, (...arg) => {
            eventEmitter.emit(event, ...arg);
        });
    }
    /**
     * Pipe events from one emitter to another, but only once
     * @param event Event to pipe
     * @param eventEmitter Emitter to pipe to
     * @returns Promise that resolves when the event is emitted
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * const anotherEmitter = new BasicEventEmitter<{
     *      greet: [name: string];
     *      farewell: [name: string];
     * }>();
     *
     * emitter.pipeOnce("greet", anotherEmitter);
     *
     * anotherEmitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    pipeOnce(event, eventEmitter) {
        return this.once(event, (...arg) => {
            eventEmitter.emitOnce(event, ...arg);
        });
    }
}
export default BasicEventEmitter;
//# sourceMappingURL=index.js.map