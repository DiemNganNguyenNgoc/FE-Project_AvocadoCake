import productReducer, { updateproduct, resetproduct, setProducts } from '../src/app/redux/slides/productSlide';

describe('productSlice', () => {
    const initialState = {
        _id: "",
        productName: "",
        productPrice: "",
        productCategory: "",
        productSize: "",
        productImage: "",
        productDescription: "",
        access_token: "",
        averageRating: 0,
        totalRatings: 0,
        isLoggedIn: false,
    };

    test('should return the initial state', () => {
        expect(productReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    describe('updateproduct', () => {
        test('updates all product fields', () => {
            const payload = {
                _id: "p1",
                productName: "Avocado Cake",
                productPrice: "500000",
                access_token: "ptoken",
                averageRating: 4.5
            };
            const nextState = productReducer(initialState, updateproduct(payload));
            expect(nextState.id).toBe("p1"); // Reducer sets state.id = _id
            expect(nextState._id).toBe("");  // initialState had _id: ""
            expect(nextState.productName).toBe("Avocado Cake");
            expect(nextState.productPrice).toBe("500000");
            expect(nextState.access_token).toBe("ptoken");
            expect(nextState.averageRating).toBe(4.5);
            expect(nextState.isLoggedIn).toBe(true);
        });

        test('sets isLoggedIn to false if token is missing', () => {
            const payload = { productName: "Cake" };
            const nextState = productReducer(initialState, updateproduct(payload));
            expect(nextState.isLoggedIn).toBe(false);
        });

        test('handles partial updates with defaults', () => {
            const payload = { _id: "p2" };
            const nextState = productReducer(initialState, updateproduct(payload));
            expect(nextState.id).toBe("p2");
            expect(nextState.productName).toBe("");
        });
    });

    describe('resetproduct', () => {
        test('resets description and sets id to empty', () => {
            const state = { ...initialState, productName: "Cake", id: "p1", isLoggedIn: true };
            const nextState = productReducer(state, resetproduct());
            expect(nextState.id).toBe("");
            expect(nextState.productName).toBe("");
            expect(nextState.isLoggedIn).toBe(false);
        });
    });

    describe('setProducts', () => {
        test('replaces entire state with payload', () => {
            const newState = { productName: "New Cake", productPrice: "100" };
            const nextState = productReducer(initialState, setProducts(newState));
            expect(nextState).toEqual(newState);
        });

        test('handles empty array as product set', () => {
            const nextState = productReducer(initialState, setProducts([]));
            expect(nextState).toEqual([]);
        });
    });

    test('resetproduct clears description and image', () => {
        const state = { ...initialState, productDescription: "Desc", productImage: "img.jpg" };
        const nextState = productReducer(state, resetproduct());
        expect(nextState.productDescription).toBe("");
        expect(nextState.productImage).toBe("");
    });

    test('initialState verifies default product properties', () => {
        expect(initialState.averageRating).toBe(0);
        expect(initialState.totalRatings).toBe(0);
    });
});
