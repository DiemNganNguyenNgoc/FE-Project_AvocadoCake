import counterReducer, { increment, decrement, incrementByAmount } from '../src/app/redux/slides/counterSlide';

describe('counterSlice', () => {
    const initialState = { value: 0 };

    test('should return the initial state', () => {
        expect(counterReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    test('handles increment', () => {
        const nextState = counterReducer(initialState, increment());
        expect(nextState.value).toBe(1);
    });

    test('handles decrement', () => {
        const state = { value: 10 };
        const nextState = counterReducer(state, decrement());
        expect(nextState.value).toBe(9);
    });

    test('handles incrementByAmount', () => {
        const nextState = counterReducer(initialState, incrementByAmount(5));
        expect(nextState.value).toBe(5);
    });

    test('handles multiple actions', () => {
        let state = counterReducer(initialState, increment());
        state = counterReducer(state, incrementByAmount(10));
        state = counterReducer(state, decrement());
        expect(state.value).toBe(10);
    });
});
