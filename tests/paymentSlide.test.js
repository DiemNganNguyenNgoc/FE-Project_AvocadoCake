jest.mock('../src/app/api/services/PaymentService', () => ({
    createPayment: {
        pending: { type: 'payment/createPayment/pending' },
        fulfilled: { type: 'payment/createPayment/fulfilled' },
        rejected: { type: 'payment/createPayment/rejected' },
    },
}));

import paymentReducer, { createPayment } from '../src/app/redux/slides/paymentSlide';

describe('paymentSlice', () => {
    const initialState = { payments: [], status: null, error: null };

    test('should return the initial state', () => {
        expect(paymentReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    describe('createPayment async thunk handles states', () => {
        test('sets status to loading when pending', () => {
            const action = { type: createPayment.pending.type };
            const nextState = paymentReducer(initialState, action);
            expect(nextState.status).toBe('loading');
        });

        test('sets status to succeeded and adds payment when fulfilled', () => {
            const paymentPayload = { id: 'pay1' };
            const action = { type: createPayment.fulfilled.type, payload: paymentPayload };
            const nextState = paymentReducer(initialState, action);
            expect(nextState.status).toBe('succeeded');
            expect(nextState.payments).toContain(paymentPayload);
        });

        test('sets status to failed and adds error when rejected', () => {
            const errorPayload = { message: 'Error' };
            const action = { type: createPayment.rejected.type, payload: errorPayload };
            const nextState = paymentReducer(initialState, action);
            expect(nextState.status).toBe('failed');
            expect(nextState.error).toEqual(errorPayload);
        });
    });
});
