class StateManager {
    constructor() {

        this.state = {};
        this.listeners = new Set();
    }

    // Sets the initial state of the application
    init(initialState) {
        this.state = initialState;
    }

    // Returns the current state
    getState() {
        return this.state;
    }

    /// Updates the state with new values
    setState(newState) {

        const previousState = this.state;

        this.state = {
            ...this.state,
            ...newState
        };

        this.notify(
            this.state,
            previousState
        );

    }

    // Subscribes a listener to state changes
    subscribe(callback) {
        this.listeners.add(callback);

        return () => {
            this.listeners.delete(callback);
        };
    }

    // Notifies all listeners when the state changes
    notify(newState, previousState) {
        this.listeners.forEach(listener => {

            listener(
                newState,
                previousState
            );
        });
    }
}

const State = new StateManager();

export default State;