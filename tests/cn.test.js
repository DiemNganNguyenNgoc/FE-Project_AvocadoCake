import { cn } from '../src/utils/cn';

describe('cn', () => {
    test('merges multiple strings', () => {
        expect(cn('class1', 'class2')).toBe('class1 class2');
        expect(cn('btn', 'btn-primary', 'active')).toBe('btn btn-primary active');
    });

    test('filters out falsy values (null, undefined, false, empty string)', () => {
        expect(cn('class1', null, 'class2', undefined, false, '', 'class3')).toBe('class1 class2 class3');
    });

    test('handles single class name', () => {
        expect(cn('only-one')).toBe('only-one');
    });

    test('handles no arguments', () => {
        expect(cn()).toBe('');
    });

    test('handles dynamic/conditional classes', () => {
        const isActive = true;
        const isDisabled = false;
        expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active');
    });
});
