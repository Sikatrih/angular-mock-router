import { InjectionToken } from '@angular/core';

import { MOCK_CONFIG, DEFAULT_DELAY } from './constants';

describe('Constants', () => {

    it('MOCK_CONFIG should be instance of InjectionToken', () => {
        expect(MOCK_CONFIG instanceof InjectionToken).toBeTruthy();
    });

    it('DEFAULT_DELAY should be 100', () => {
        expect(DEFAULT_DELAY).toBe(100);
    });

});
