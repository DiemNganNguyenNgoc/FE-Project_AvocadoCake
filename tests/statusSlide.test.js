import statusReducer, {
    updateStatus,
    resetStatus,
    setAllStatus,
    setDetailStatus,
    setSelectedStatus,
    clearSelectedStatus
} from '../src/app/redux/slides/statusSlide';

describe('statusSlice', () => {
    const initialState = {
        id: "",
        statusCode: "",
        statusName: "",
        statusDescription: "",
        access_token: "",
        allStatus: [],
        detailStatus: {},
        selectedStatus: null,
    };

    test('should return the initial state', () => {
        expect(statusReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    describe('updateStatus', () => {
        test('updates all status fields', () => {
            const payload = {
                _id: "s1",
                statusCode: "ACTIVE",
                statusName: "Active Status",
                statusDescription: "Description",
                access_token: "token1"
            };
            const nextState = statusReducer(initialState, updateStatus(payload));
            expect(nextState.id).toBe("s1");
            expect(nextState.statusCode).toBe("ACTIVE");
            expect(nextState.statusName).toBe("Active Status");
            expect(nextState.access_token).toBe("token1");
        });

        test('handles partial updates with defaults', () => {
            const nextState = statusReducer(initialState, updateStatus({ _id: "s2" }));
            expect(nextState.id).toBe("s2");
            expect(nextState.statusCode).toBe("");
        });
    });

    describe('resetStatus', () => {
        test('resets all status fields', () => {
            const state = { ...initialState, statusCode: "X", id: "s1" };
            const nextState = statusReducer(state, resetStatus());
            expect(nextState.id).toBe("");
            expect(nextState.statusCode).toBe("");
        });
    });

    describe('setAllStatus', () => {
        test('sets the list of all statuses', () => {
            const statuses = [{ id: 1 }, { id: 2 }];
            const nextState = statusReducer(initialState, setAllStatus(statuses));
            expect(nextState.allStatus).toEqual(statuses);
        });
    });

    describe('setDetailStatus', () => {
        test('sets detailed status info', () => {
            const detail = { id: 1, info: "test" };
            const nextState = statusReducer(initialState, setDetailStatus(detail));
            expect(nextState.detailStatus).toEqual(detail);
        });
    });

    describe('Selection management', () => {
        test('setSelectedStatus sets selectedStatus', () => {
            const status = { id: 1, name: "Edit Me" };
            const nextState = statusReducer(initialState, setSelectedStatus(status));
            expect(nextState.selectedStatus).toEqual(status);
        });

        test('clearSelectedStatus resets selectedStatus to null', () => {
            const state = { ...initialState, selectedStatus: { id: 1 } };
            const nextState = statusReducer(state, clearSelectedStatus());
            expect(nextState.selectedStatus).toBeNull();
        });
    });
});
