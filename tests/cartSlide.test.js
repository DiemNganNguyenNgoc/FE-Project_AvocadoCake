import cartReducer, { addToCart, updateQuantity, removeFromCart, clearCart } from '../src/app/redux/slides/cartSlide';

describe('cartSlice', () => {
    const initialState = { products: [] };

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('addToCart', () => {
        test('adds new product to empty cart', () => {
            const product = { id: 1, title: 'Cake 1', price: 100, size: 'M' };
            const nextState = cartReducer(initialState, addToCart(product));
            expect(nextState.products).toHaveLength(1);
            expect(nextState.products[0]).toEqual({ ...product, quantity: 1 });
            expect(JSON.parse(localStorage.getItem('cart')).products).toHaveLength(1);
        });

        test('adds new product to cart with existing items', () => {
            const state = { products: [{ id: 1, title: 'Cake 1', price: 100, size: 'M', quantity: 1 }] };
            const newProduct = { id: 2, title: 'Cake 2', price: 200, size: 'L' };
            const nextState = cartReducer(state, addToCart(newProduct));
            expect(nextState.products).toHaveLength(2);
            expect(nextState.products[1].id).toBe(2);
        });

        test('increases quantity of existing product', () => {
            const state = { products: [{ id: 1, title: 'Cake 1', price: 100, size: 'M', quantity: 1 }] };
            const product = { id: 1, title: 'Cake 1', price: 100, size: 'M' };
            const nextState = cartReducer(state, addToCart(product));
            expect(nextState.products).toHaveLength(1);
            expect(nextState.products[0].quantity).toBe(2);
        });

        test('handles custom quantity', () => {
            const product = { id: 1, title: 'Cake 1', price: 100, size: 'M', quantity: 5 };
            const nextState = cartReducer(initialState, addToCart(product));
            expect(nextState.products[0].quantity).toBe(5);
        });

        test('handles size property', () => {
            const product = { id: 1, title: 'Cake 1', price: 100, size: 'S' };
            const nextState = cartReducer(initialState, addToCart(product));
            expect(nextState.products[0].size).toBe('S');
        });
    });

    describe('updateQuantity', () => {
        test('updates quantity of existing product', () => {
            const state = { products: [{ id: 1, quantity: 1 }] };
            const nextState = cartReducer(state, updateQuantity({ id: 1, quantity: 3 }));
            expect(nextState.products[0].quantity).toBe(3);
        });

        test('does nothing if product not found', () => {
            const state = { products: [{ id: 1, quantity: 1 }] };
            const nextState = cartReducer(state, updateQuantity({ id: 2, quantity: 3 }));
            expect(nextState.products[0].quantity).toBe(1);
        });

        test('does nothing if quantity <= 0', () => {
            const state = { products: [{ id: 1, quantity: 2 }] };
            const nextState = cartReducer(state, updateQuantity({ id: 1, quantity: 0 }));
            expect(nextState.products[0].quantity).toBe(2);
        });

        test('updates localStorage correctly', () => {
            const state = { products: [{ id: 1, quantity: 1 }] };
            cartReducer(state, updateQuantity({ id: 1, quantity: 5 }));
            const stored = JSON.parse(localStorage.getItem('cart'));
            expect(stored.products[0].quantity).toBe(5);
        });
    });

    describe('removeFromCart', () => {
        test('removes product by ID', () => {
            const state = { products: [{ id: 1 }, { id: 2 }] };
            const nextState = cartReducer(state, removeFromCart({ id: 1 }));
            expect(nextState.products).toHaveLength(1);
            expect(nextState.products[0].id).toBe(2);
        });

        test('does nothing if ID not found', () => {
            const state = { products: [{ id: 1 }] };
            const nextState = cartReducer(state, removeFromCart({ id: 2 }));
            expect(nextState.products).toHaveLength(1);
        });

        test('updates localStorage', () => {
            const state = { products: [{ id: 1 }] };
            cartReducer(state, removeFromCart({ id: 1 }));
            expect(JSON.parse(localStorage.getItem('cart')).products).toHaveLength(0);
        });
    });

    describe('clearCart', () => {
        test('clears all products', () => {
            const state = { products: [{ id: 1 }, { id: 2 }] };
            const nextState = cartReducer(state, clearCart());
            expect(nextState.products).toHaveLength(0);
        });

        test('resets localStorage', () => {
            const state = { products: [{ id: 1 }] };
            cartReducer(state, clearCart());
            expect(JSON.parse(localStorage.getItem('cart')).products).toHaveLength(0);
        });
    });
});
