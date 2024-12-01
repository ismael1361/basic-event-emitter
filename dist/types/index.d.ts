declare const _subscriptions: unique symbol;
declare const _oneTimeEvents: unique symbol;
type SubscriptionCallback<T extends Array<any> = any[]> = (...arg: T) => void;
export interface BasicEventHandler {
    stop: () => void;
    remove: () => void;
}
type EventsListeners<K extends PropertyKey = any> = {
    [key in K]: (...p: any[]) => void;
};
/**
 * BasicEventEmitter class
 */
export declare class BasicEventEmitter<T extends EventsListeners = any> {
    private [_subscriptions];
    private [_oneTimeEvents];
    private _ready;
    /**
     * Create a new BasicEventEmitter
     */
    constructor();
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
    ready<R = never>(callback?: () => R | Promise<R>): Promise<R>;
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
    get prepared(): boolean;
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
    set prepared(value: boolean);
    /**
     * Clear all events
     * @returns void
     * @example
     * const emitter = new BasicEventEmitter<{}>();
     * emitter.clearEvents();
     * // All events are cleared
     */
    clearEvents(): void;
    /**
     * Add a listener to an event
     * @param event Event to listen to
     * @param callback Callback to call when the event is emitted
     * @returns BasicEventHandler
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
     * }>();
     *
     * emitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    on<K extends keyof T>(event: K, callback: SubscriptionCallback<Parameters<T[K]>>): BasicEventHandler;
    /**
     * Remove a listener from an event
     * @param event Event to remove the listener from
     * @param callback Callback to remove
     * @returns BasicEventEmitter
     *
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
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
    off<K extends keyof T>(event: K, callback?: SubscriptionCallback<Parameters<T[K]>>): BasicEventEmitter<T>;
    /**
     * Add a listener that will be removed after being called once
     * @param event Event to listen to
     * @param callback Callback to call when the event is emitted
     * @returns Promise that resolves when the event is emitted
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
     * }>();
     *
     * emitter.once("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    once<K extends keyof T>(event: K, callback?: SubscriptionCallback<Parameters<T[K]>>): Promise<void>;
    /**
     * Remove a listener that was added with `once`
     * @param event Event to remove the listener from
     * @param callback Callback to remove
     * @returns BasicEventEmitter
     *
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
     * }>();
     *
     * const listener = (name) => {
     *      console.log(`Hello, ${name}!`);
     * }
     *
     * emitter.once("greet", listener);
     * emitter.offOnce("greet", listener);
     */
    offOnce<K extends keyof T>(event: K, callback?: SubscriptionCallback<Parameters<T[K]>>): BasicEventEmitter<T>;
    /**
     * Emit an event
     * @param event Event to emit
     * @param arg Arguments to pass to the event
     * @returns BasicEventEmitter
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
     * }>();
     *
     * emitter.on("greet", (name) => {
     *      console.log(`Hello, ${name}!`);
     * });
     *
     * emitter.emit("greet", "Alice");
     * // Output: Hello, Alice!
     */
    emit<K extends keyof T>(event: K, ...arg: Parameters<T[K]>): BasicEventEmitter<T>;
    /**
     * Emit an event only once
     * @param event Event to emit
     * @param arg Arguments to pass to the event
     * @returns BasicEventEmitter
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
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
    emitOnce<K extends keyof T>(event: K, ...arg: Parameters<T[K]>): BasicEventEmitter<T>;
    /**
     * Pipe events from one emitter to another
     * @param event Event to pipe
     * @param eventEmitter Emitter to pipe to
     * @returns BasicEventHandler
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
     * }>();
     *
     * const anotherEmitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
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
    pipe<K extends keyof T>(event: K, eventEmitter: BasicEventEmitter<T>): BasicEventHandler;
    /**
     * Pipe events from one emitter to another, but only once
     * @param event Event to pipe
     * @param eventEmitter Emitter to pipe to
     * @returns Promise that resolves when the event is emitted
     * @example
     * const emitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
     * }>();
     *
     * const anotherEmitter = new BasicEventEmitter<{
     *      greet: (name: string) => void;
     *      farewell: (name: string) => void;
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
    pipeOnce<K extends keyof T>(event: K, eventEmitter: BasicEventEmitter<T>): Promise<void>;
}
export default BasicEventEmitter;
//# sourceMappingURL=index.d.ts.map