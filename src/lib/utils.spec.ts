/* tslint:disable */

import { resolvePath, firstValidNumber, fetchQuery, createHttpResponse, logResponse, isObject, cloneObject, fetchParams, clearUrl } from './utils';
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

    describe('isObject', () => {
        it('should return true', () => {
            expect(isObject([])).toBeTruthy();
            expect(isObject({})).toBeTruthy();
        });

        it('should return false', () => {
            expect(isObject(HTMLDivElement)).toBeFalsy();
            expect(isObject(null)).toBeFalsy();
            expect(isObject(undefined)).toBeFalsy();
            expect(isObject(10)).toBeFalsy();
            expect(isObject(0)).toBeFalsy();
            expect(isObject('')).toBeFalsy();
            expect(isObject('null')).toBeFalsy();
            expect(isObject(false)).toBeFalsy();
            expect(isObject(new Blob())).toBeFalsy();
        });
    });

    describe('cloneData', () => {
        it('should gets array and return clone', () => {
            const array: number[] = [10];
            const clone = cloneObject(array);

            expect(clone).toEqual(array);
            expect(clone).not.toBe(array);

            array.push(20);

            expect(array).toEqual([10, 20]);
            expect(clone).toEqual([10]);
        });

        it('should gets object and return clone', () => {
            const object: {[key: string]: any} = {id: '10'};
            const clone = cloneObject(object);

            expect(clone).toEqual(object);
            expect(clone).not.toBe(object);

            object.name = 'origin';

            expect(object).toEqual({id: '10', name: 'origin'});
            expect(clone).toEqual({id: '10'});
        });
    });

    describe('clearUrl', () => {
        it('should clean string with url', () => {
            expect(clearUrl('/')).toBe('');
            expect(clearUrl('/ / //')).toBe('');
            expect(clearUrl('/user/')).toBe('user');
            expect(clearUrl('/user/id')).toBe('user/id');
            expect(clearUrl('/user/id/')).toBe('user/id');
            expect(clearUrl('///da/ff // fc')).toBe('da/ff/fc');
        });
    });

    describe('fetchQuery', () => {
        it('should return "null" if paths has different length', () => {
            expect(fetchQuery('', ':id')).toBe(null);
            expect(fetchQuery('myusers', 'users')).toBe(null);
            expect(fetchQuery('users/', 'users/10')).toBe(null);
            expect(fetchQuery('users/10/info', 'users/:id')).toBe(null);
            expect(fetchQuery('users/10', 'users/:id/info')).toBe(null);
            expect(fetchQuery('users/10', 'users/id')).toEqual(null);
        });

        it('should return objects', () => {
            expect(fetchQuery('user', 'user')).toEqual({});
            expect(fetchQuery('/user/', 'user')).toEqual({});
            expect(fetchQuery('user ', 'user/')).toEqual({});
            expect(fetchQuery('/user /  ', '/ user ')).toEqual({});
            expect(fetchQuery('/ user  /  ', '  user ')).toEqual({});
            expect(fetchQuery('user', '/user/')).toEqual({});
            expect(fetchQuery('user/10', 'user/:id')).toEqual({id: '10'});
            expect(fetchQuery('user/10/info', 'user/:id/:section'))
                .toEqual({id: '10', section: 'info'});
        });
    });

    describe('fetchParams', () => {
        it('should return objects with params', () => {
            expect(fetchParams('name=ferret&color=purple+red+blur'))
                .toEqual({name: 'ferret', color: 'purple+red+blur'});

            expect(fetchParams('name=ferret & col / or = pur ple'))
                .toEqual({name: 'ferret', color: 'purple'});


            expect(fetchParams('name'))
                .toEqual({name: undefined});

            expect(fetchParams(''))
                .toEqual({});
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
                .toEqual(new HttpResponse({body: null, status: 204}));

            expect(createHttpResponse(undefined))
                .toEqual(new HttpResponse({body: undefined, status: 204}));
        });

        it('should return response with Blob', () => {
            const blob = new Blob(['text'], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            expect(createHttpResponse(blob))
                .toEqual(new HttpResponse({body: blob, status: 200}));
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
