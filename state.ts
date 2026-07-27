class StateManager<T> {
    private state: T;
    private listeners: Set<(newState: T, previousState: T) => void>;

    constructor(initialState: T = {} as T) {
        this.state = initialState;
        this.listeners = new Set<(newState: T, previousState: T) => void>();
    }

    // Returns the current state
    getState(): T {
        return this.state;
    }

    // Updates the state with new values
    setState(newState: Partial<T>): void {
        const previousState = this.state;

        this.state = {
            ...this.state,
            ...newState
        } as T;

        this.notify(this.state, previousState);
    }

    // Subscribes a listener to state changes
    subscribe(callback: (newState: T, previousState: T) => void): () => void {
        this.listeners.add(callback);

        return () => {
            this.listeners.delete(callback);
        };
    }

    // Notifies all listeners when the state changes
    notify(newState: T, previousState: T): void {
        this.listeners.forEach((listener) => {
            listener(newState, previousState);
        });
    }
}

const State = new StateManager<Record<string, unknown>>({});

export default State;
export { StateManager };
