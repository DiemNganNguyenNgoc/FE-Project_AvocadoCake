import { useMutationHook } from '../src/app/hooks/useMutationHook';
import { useMutation } from '@tanstack/react-query';

jest.mock('@tanstack/react-query');

describe('useMutationHook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.alert = jest.fn();
        console.error = jest.fn();
    });

    test('calls useMutation with provided callback', () => {
        const callback = jest.fn();
        useMutationHook(callback);
        expect(useMutation).toHaveBeenCalledWith(expect.objectContaining({
            mutationFn: callback
        }));
    });

    test('returns mutation object from useMutation', () => {
        const mockMutation = { mutate: jest.fn(), isLoading: false };
        useMutation.mockReturnValue(mockMutation);
        const result = useMutationHook(jest.fn());
        expect(result).toBe(mockMutation);
    });

    test('handles error via alert and console.error in onError callback', () => {
        const callback = jest.fn();
        useMutationHook(callback);

        // Extract the onError handler passed to useMutation
        const { onError } = useMutation.mock.calls[0][0];

        const error = new Error('Test Error');
        onError(error);

        expect(console.error).toHaveBeenCalledWith('Mutation error:', error);
        expect(window.alert).toHaveBeenCalledWith('Test Error');
    });

    test('handles error with fallback message if no message exists', () => {
        useMutationHook(jest.fn());
        const { onError } = useMutation.mock.calls[0][0];

        onError({});

        expect(window.alert).toHaveBeenCalledWith('Đã xảy ra lỗi.');
    });
});
