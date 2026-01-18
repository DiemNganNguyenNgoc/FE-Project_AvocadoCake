import userReducer, { updateUser, resetUser, setAllUser, setDetailUser, updateUserCoins } from '../src/app/redux/slides/userSlide';

describe('userSlice', () => {
    const initialState = {
        id: "",
        familyName: "",
        userName: "",
        userPhone: "",
        userEmail: "",
        userAddress: "",
        userWard: "",
        userDistrict: "",
        userCity: "",
        userImage: "",
        access_token: "",
        isLoggedIn: false,
        allUser: [],
        detailUser: {},
        isAdmin: false,
        coins: 0,
        currentRank: null,
        totalSpending: 0,
    };

    test('should return the initial state', () => {
        expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    describe('updateUser', () => {
        test('updates all user fields from payload', () => {
            const payload = {
                _id: "123",
                userName: "John",
                userEmail: "john@example.com",
                access_token: "token123",
                isAdmin: true,
                coins: 100
            };
            const nextState = userReducer(initialState, updateUser(payload));
            expect(nextState.id).toBe("123");
            expect(nextState.userName).toBe("John");
            expect(nextState.userEmail).toBe("john@example.com");
            expect(nextState.access_token).toBe("token123");
            expect(nextState.isAdmin).toBe(true);
            expect(nextState.coins).toBe(100);
            expect(nextState.isLoggedIn).toBe(true);
        });

        test('sets userName to userEmail if userName is missing', () => {
            const payload = { userEmail: "test@example.com" };
            const nextState = userReducer(initialState, updateUser(payload));
            expect(nextState.userName).toBe("test@example.com");
        });

        test('sets isLoggedIn to false if token is missing', () => {
            const payload = { userName: "John" };
            const nextState = userReducer(initialState, updateUser(payload));
            expect(nextState.isLoggedIn).toBe(false);
        });
    });

    describe('resetUser', () => {
        test('resets all user fields to initial state', () => {
            const state = { ...initialState, userName: "John", isLoggedIn: true };
            const nextState = userReducer(state, resetUser());
            expect(nextState).toEqual(initialState);
        });
    });

    describe('setAllUser', () => {
        test('sets the list of all users', () => {
            const users = [{ id: 1 }, { id: 2 }];
            const nextState = userReducer(initialState, setAllUser(users));
            expect(nextState.allUser).toEqual(users);
        });
    });

    describe('setDetailUser', () => {
        test('sets detailed user info', () => {
            const detail = { id: 1, bio: "Hello" };
            const nextState = userReducer(initialState, setDetailUser(detail));
            expect(nextState.detailUser).toEqual(detail);
        });
    });

    describe('updateUserCoins', () => {
        test('updates user coins count', () => {
            const nextState = userReducer(initialState, updateUserCoins(500));
            expect(nextState.coins).toBe(500);
        });

        test('handles negative coins (if allowed by logic)', () => {
            const nextState = userReducer(initialState, updateUserCoins(-100));
            expect(nextState.coins).toBe(-100);
        });
    });

    test('resetUser clears coins and rank', () => {
        const state = { ...initialState, coins: 100, currentRank: 'Gold' };
        const nextState = userReducer(state, resetUser());
        expect(nextState.coins).toBe(0);
        expect(nextState.currentRank).toBe(null);
    });

    test('handles partial updates with defaults', () => {
        const payload = { _id: "456" };
        const nextState = userReducer(initialState, updateUser(payload));
        expect(nextState.id).toBe("456");
        expect(nextState.familyName).toBe("");
    });
});
