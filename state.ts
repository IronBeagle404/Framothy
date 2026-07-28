class StateManager<T> {
    private state: T;
    private listeners: Set<(newState: T, previousState: T) => void>;

    constructor(initialState: T) {
        this.state = initialState;
        this.listeners = new Set<(newState: T, previousState: T) => void>();
    }

    /**
     * Returns the current state value.
     */
    getState(): T {
        return this.state;
    }

    /**
     * Replaces the current state and notifies listeners.
     */
    setState(newValue: T): void {
        const previousState = this.state;
        this.state = newValue;
        this.notify(this.state, previousState);
    }

    /**
     * Subscribes a callback to state updates.
     */
    subscribe(callback: (newState: T, previousState: T) => void): () => void {
        this.listeners.add(callback);

        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notifies all registered listeners.
     */
    notify(newState: T, previousState: T): void {
        this.listeners.forEach((listener) => {
            listener(newState, previousState);
        });
    }
}

export default StateManager;
