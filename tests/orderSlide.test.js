import orderReducer, {
    addOrder,
    updateOrderStatus,
    updateOrder,
    removeOrder,
    clearOrders,
    setOrders,
    setOrderDetails,
    clearSelectedProductDetails,
    clearOrder
} from '../src/app/redux/slides/orderSlide';

describe('orderSlice', () => {
    const initialState = {
        orders: [],
        selectedProductDetails: [],
        shippingAddress: {},
        totalPrice: 0,
    };

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('addOrder', () => {
        test('adds new order and saves to localStorage', () => {
            const order = { orderId: 'ord1', status: 'PENDING' };
            const nextState = orderReducer(initialState, addOrder(order));
            expect(nextState.orders).toHaveLength(1);
            expect(nextState.orders[0]).toEqual(order);
            expect(JSON.parse(localStorage.getItem('orders')).orders).toHaveLength(1);
        });
    });

    describe('updateOrderStatus', () => {
        test('updates status of existing order', () => {
            const state = { ...initialState, orders: [{ orderId: 'ord1', status: 'PENDING' }] };
            const nextState = orderReducer(state, updateOrderStatus({ orderId: 'ord1', status: 'SHIPPED' }));
            expect(nextState.orders[0].status).toBe('SHIPPED');
        });

        test('does nothing if orderId not found', () => {
            const state = { ...initialState, orders: [{ orderId: 'ord1', status: 'PENDING' }] };
            const nextState = orderReducer(state, updateOrderStatus({ orderId: 'ord2', status: 'SHIPPED' }));
            expect(nextState.orders[0].status).toBe('PENDING');
        });
    });

    describe('updateOrder', () => {
        test('merges updated data into existing order', () => {
            const state = { ...initialState, orders: [{ orderId: 'ord1', status: 'PENDING', total: 100 }] };
            const nextState = orderReducer(state, updateOrder({ orderId: 'ord1', updatedData: { total: 150 } }));
            expect(nextState.orders[0].total).toBe(150);
            expect(nextState.orders[0].status).toBe('PENDING');
        });
    });

    describe('removeOrder', () => {
        test('removes order by ID', () => {
            const state = { ...initialState, orders: [{ orderId: 'ord1' }, { orderId: 'ord2' }] };
            const nextState = orderReducer(state, removeOrder('ord1'));
            expect(nextState.orders).toHaveLength(1);
            expect(nextState.orders[0].orderId).toBe('ord2');
        });
    });

    describe('clearOrders', () => {
        test('empties order list', () => {
            const state = { ...initialState, orders: [{ orderId: 'ord1' }] };
            const nextState = orderReducer(state, clearOrders());
            expect(nextState.orders).toHaveLength(0);
        });
    });

    describe('setOrders', () => {
        test('replaces order list', () => {
            const orders = [{ orderId: 'ord3' }];
            const nextState = orderReducer(initialState, setOrders(orders));
            expect(nextState.orders).toEqual(orders);
        });
    });

    describe('setOrderDetails', () => {
        test('sets breakdown info (address, total price)', () => {
            const details = {
                selectedProductDetails: [{ id: 1 }],
                shippingAddress: { city: 'Hanoi' },
                totalPrice: 1000
            };
            const nextState = orderReducer(initialState, setOrderDetails(details));
            expect(nextState.selectedProductDetails).toEqual(details.selectedProductDetails);
            expect(nextState.shippingAddress).toEqual(details.shippingAddress);
            expect(nextState.totalPrice).toBe(1000);
        });

        test('handles missing fields in payload', () => {
            const nextState = orderReducer(initialState, setOrderDetails({}));
            expect(nextState.selectedProductDetails).toEqual([]);
            expect(nextState.shippingAddress).toEqual({});
            expect(nextState.totalPrice).toBe(0);
        });
    });

    describe('clearSelectedProductDetails', () => {
        test('clears selected product info', () => {
            const state = { ...initialState, selectedProductDetails: [{ id: 1 }] };
            const nextState = orderReducer(state, clearSelectedProductDetails());
            expect(nextState.selectedProductDetails).toHaveLength(0);
        });
    });

    describe('clearOrder', () => {
        test('resets all temporary order info', () => {
            const state = {
                ...initialState,
                selectedProductDetails: [{ id: 1 }],
                shippingAddress: { city: 'Hanoi' },
                totalPrice: 1000
            };
            const nextState = orderReducer(state, clearOrder());
            expect(nextState.selectedProductDetails).toHaveLength(0);
            expect(nextState.shippingAddress).toEqual({});
            expect(nextState.totalPrice).toBe(0);
        });

        test('clearOrder updates localStorage', () => {
            const state = { ...initialState, totalPrice: 1000 };
            orderReducer(state, clearOrder());
            expect(JSON.parse(localStorage.getItem('orders')).totalPrice).toBe(0);
        });
    });

    test('removeOrder does not crash on empty state', () => {
        const nextState = orderReducer(initialState, removeOrder('none'));
        expect(nextState.orders).toHaveLength(0);
    });

    test('updateOrderStatus does not crash on empty state', () => {
        const nextState = orderReducer(initialState, updateOrderStatus({ orderId: 'none', status: 'X' }));
        expect(nextState.orders).toHaveLength(0);
    });

    test('initialState verifies default properties', () => {
        expect(initialState.orders).toEqual([]);
        expect(initialState.totalPrice).toBe(0);
    });
});
