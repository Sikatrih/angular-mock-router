import { HttpResponse } from '@angular/common/http';

import { MockRoute, MockRequest, DataObject } from './constants';

export const resolvePath = (...args: string[]) => {
    return args.join('/').replace(/\/+/g, '/');
};

export const firstValidNumber = (...objects: any[]) => {
    for (const object of objects) {
        if (typeof(object) === 'number') {
            return object;
        }
    }

    return 0;
};

export const isObject = (object: any): boolean => {
    const isObj = typeof object === 'object' && object !== null;

    if (!isObj) {
        return false;
    }

    for (const key in object) {
        if (Object.keys(object).length === 0) {
            return false;
        }
    }

    return true;
};

export const cloneObject = <T extends any[] | {[key: string]: any}>(object: T) => {
    return Array.isArray(object) ? [...object] : {...object};
};

export const fetchQuery = (target: string, pattern: string) => {
    const requestUrlObject = target.replace(/\s/g, '').replace(/^\/|\/$/gi, '').split('/');
    const routeUrlObject = pattern.replace(/\s/g, '').replace(/^\/|\/$/gi, '').split('/');

    if (requestUrlObject.length !== routeUrlObject.length) {
        return null;
    }

    const query: {[key: string]: string} = {};

    for (let i = 0; i <= routeUrlObject.length - 1; i++) {
        if (routeUrlObject[i].search(/^:/gi) === 0) {
            const propertyKey = routeUrlObject[i].replace(/^:/gi, '');

            query[propertyKey] = requestUrlObject[i];
        } else if (requestUrlObject[i] !== routeUrlObject[i]) {
            return null;
        }
    }

    return query;
};

export const fetchParams = (pattern: string) => {
    const cleanParams = pattern.replace(/\s|\//g, '');
    const params: DataObject<string | undefined> = {};
    const props = cleanParams.split('&');

    for (const prop of props) {
        const part = prop.split('=');

        if (part[0]) {
            params[part[0]] = part[1];
        }
    }

    return params;
};

export const createHttpResponse = (object: any) => {
    if (object instanceof HttpResponse) {
        return object;
    }

    if (object === null || object === undefined) {
        return new HttpResponse({status: 204});
    }

    return new HttpResponse({
        body: isObject(object) ? cloneObject(object) : object,
        status: 200
    });
};

export const logResponse = (route: MockRoute, request: MockRequest, response: HttpResponse<any>) => {
    console.groupCollapsed(`${route.method} - ${route.url}`);
    console.log('Request:', request);
    console.log('Response:', response);
    console.groupEnd();
};
