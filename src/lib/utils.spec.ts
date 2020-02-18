/* tslint:disable */

import { resolvePath, firstValidNumber, fetchQuery, createHttpResponse, logResponse } from './utils';
import { HttpResponse, HttpRequest } from '@angular/common/http';

import { MockRoute, MockRequest } from './constants';

describe('Utils', () => {

    describe('resolvePath', () => {
        it('should split paths and remove unused slashes', () => {
            expect(resolvePath('src'))
                .toBe('src');

            expect(resolvePath('/src/'))
                .toBe('/src/');

            expect(resolvePath('//src///ap', 'part'))
                .toBe('/src/ap/part');

            expect(resolvePath('src///ap', 'part', '2/'))
                .toBe('src/ap/part/2/');
        });
    });

    describe('firstValidNumber', () => {
        it('should return 0 without arguments', () => {
            expect(firstValidNumber()).toBe(0);
        });

        it('should skip all values if it is not number', () => {
            expect(firstValidNumber('10', null, undefined, [], {}, true)).toBe(0);
        });

        it('should return first valid number', () => {
            expect(firstValidNumber('10', null, 20, [], {}, true, 10)).toBe(20);
        });
    });

    describe('fetchQuery', () => {
        it('should return "null" if paths has different length', () => {
            expect(fetchQuery('users/', 'users/10')).toBe(null);
            expect(fetchQuery('users/10/info', 'users/:id')).toBe(null);
            expect(fetchQuery('users/10', 'users/:id/info')).toBe(null);
        });

        it('should return empty object', () => {
            expect(fetchQuery('users/10', 'users/id')).toEqual({});
            expect(fetchQuery('', '')).toEqual({});
        });

        it('should return object with id 10', () => {
            expect(fetchQuery('user/10', 'user/:id')).toEqual({id: '10'});
            expect(fetchQuery('user/10/info', 'user/:id/:section'))
                .toEqual({id: '10', section: 'info'});
        });
    });

    describe('createHttpResponse', () => {
        it('should get and return the same new HttpResponse', () => {
            const httpResponse = new HttpResponse();

            expect(createHttpResponse(httpResponse)).toBe(httpResponse);
        });

        it('should get data and create HttpResponse with this data', () => {
            expect(createHttpResponse({id: 10}))
                .toEqual(new HttpResponse({body: {id: 10}}));

            expect(createHttpResponse(true))
                .toEqual(new HttpResponse({body: true}));

            expect(createHttpResponse(false))
                .toEqual(new HttpResponse({body: false}));

            expect(createHttpResponse(10))
                .toEqual(new HttpResponse({body: 10}));

            expect(createHttpResponse('success'))
                .toEqual(new HttpResponse({body: 'success'}));

            expect(createHttpResponse(null))
                .not.toEqual(new HttpResponse({body: null}));

            expect(createHttpResponse(undefined))
                .not.toEqual(new HttpResponse({body: undefined}));
        });

        it('should return response with error if it gets', () => {
            expect(createHttpResponse(null))
                .toEqual(new HttpResponse({body: null, status: 500}));

            expect(createHttpResponse(undefined))
                .toEqual(new HttpResponse({body: undefined, status: 500}));
        });
    });

    describe('logResponse', () => {
        it('should log request', () => {
            const originalLog = console.log;
            const logSpy = jasmine.createSpy('log');

            console.log = (...args: any[]) => logSpy(args);

            const route: MockRoute =     {
                url: '/user',
                method: 'GET',
                handler: () => 'token',
            };

            const request: MockRequest = Object.assign(new HttpRequest('GET', '/user'));
            const response: HttpResponse<any> = new HttpResponse();

            logResponse(route, request, response);

            expect(logSpy).toHaveBeenCalledTimes(2);

            console.log = originalLog;
        })
    });

});
