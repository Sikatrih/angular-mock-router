import { HttpResponse } from '@angular/common/http';

import { MockRoute, MockRequest } from './constants';

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

export const fetchQuery = (target: string, pattern: string) => {
    const requestUrlObject = target.replace(/^\/|\/$/gi, '').split('/');
    const routeUrlObject = pattern.replace(/^\/|\/$/gi, '').split('/');

    if (requestUrlObject.length !== routeUrlObject.length) {
        return null;
    }

    const query: {[key: string]: string} = {};

    for (let i = 0; i <= routeUrlObject.length - 1; i++) {
        if (routeUrlObject[i].search(/^:/gi) === 0) {
            const propertyKey = routeUrlObject[i].replace(/^:/gi, '');

            query[propertyKey] = requestUrlObject[i];
        } else if (requestUrlObject[i] !== routeUrlObject[i]) {
            break;
        }
    }

    return query;
};

export const createHttpResponse = (object: any) => {
    if (object instanceof HttpResponse) {
        return object;
    }

    if (object === null || object === undefined) {
        return new HttpResponse({body: object, status: 500});
    }

    return new HttpResponse({body: object, status: 200});
};

export const logResponse = (route: MockRoute, request: MockRequest, response: HttpResponse<any>) => {
    console.groupCollapsed(`${route.method} - ${route.url}`);
    console.log('Request:', request);
    console.log('Response:', response);
    console.groupEnd();
};
