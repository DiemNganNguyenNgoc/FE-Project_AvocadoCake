import { isJsonString, isAdmin, getBase64 } from '../src/utils';

// Mock jwtDecode for isAdmin tests
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}));

import { jwtDecode } from 'jwt-decode';

describe('isJsonString', () => {
    test('returns true for valid JSON object string', () => {
        expect(isJsonString('{"name": "Avocado Cake"}')).toBe(true);
    });

    test('returns true for valid JSON array string', () => {
        expect(isJsonString('[1, 2, 3]')).toBe(true);
    });

    test('returns false for invalid JSON string', () => {
        expect(isJsonString('not a json')).toBe(false);
    });

    test('returns false for empty string', () => {
        expect(isJsonString('')).toBe(false);
    });

    test('returns false for null', () => {
        expect(isJsonString(null)).toBe(false);
    });

    test('returns false for object (not string)', () => {
        expect(isJsonString({ key: 'value' })).toBe(false);
    });

    test('returns false for number', () => {
        expect(isJsonString(123)).toBe(false);
    });
});

describe('isAdmin', () => {
    test('returns true if token contains isAdmin: true', () => {
        jwtDecode.mockReturnValue({ isAdmin: true });
        expect(isAdmin('valid-token')).toBe(true);
    });

    test('returns false if token contains isAdmin: false', () => {
        jwtDecode.mockReturnValue({ isAdmin: false });
        expect(isAdmin('valid-token')).toBe(false);
    });

    test('returns false if isAdmin field is missing', () => {
        jwtDecode.mockReturnValue({ name: 'User' });
        expect(isAdmin('valid-token')).toBe(false);
    });

    test('returns false if isAdmin is a string "true"', () => {
        jwtDecode.mockReturnValue({ isAdmin: 'true' });
        expect(isAdmin('valid-token')).toBe(false);
    });

    test('returns false if decoding fails', () => {
        jwtDecode.mockImplementation(() => {
            throw new Error('Invalid token');
        });
        expect(isAdmin('invalid-token')).toBe(false);
    });
});

describe('getBase64', () => {
    test('resolves with base64 string on success', async () => {
        const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

        // Mocking FileReader
        const mockFileReader = {
            readAsDataURL: jest.fn(),
            result: 'data:text/plain;base64,aGVsbG8=',
        };

        window.FileReader = jest.fn(() => mockFileReader);

        const promise = getBase64(file);

        // Simulate onload event
        mockFileReader.onload();

        const result = await promise;
        expect(result).toBe('data:text/plain;base64,aGVsbG8=');
        expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
    });

    test('rejects on error', async () => {
        const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

        const mockFileReader = {
            readAsDataURL: jest.fn(),
            onerror: null,
        };

        window.FileReader = jest.fn(() => mockFileReader);

        const promise = getBase64(file);

        const error = new Error('Read failed');
        mockFileReader.onerror(error);

        await expect(promise).rejects.toBe(error);
    });
});
