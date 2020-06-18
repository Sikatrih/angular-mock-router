import { Injectable, Inject } from '@angular/core';
import { HttpHandler, HttpInterceptor } from '@angular/common/http';
import { delay, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MOCK_CONFIG, MockConfig, MockRequest, DEFAULT_DELAY, MockRoute, MockQuery } from './constants';
import { resolvePath, firstValidNumber, fetchQuery, createHttpResponse, logResponse, fetchParams } from './utils';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

    constructor(@Inject(MOCK_CONFIG) private config: MockConfig) {}

    intercept(request: MockRequest, next: HttpHandler) {
        const suitableRoutes: {route: MockRoute, query: MockQuery}[] = [];

        for (const route of this.config.routes) {
            const pattern = resolvePath(this.config.prefix || '', route.url);
            const urlParts = request.url.split('?');
            const query = fetchQuery(urlParts[0], pattern);

            if (query && request.method === route.method) {
                if (urlParts.length > 1) {
                    Object.assign(query, fetchParams(urlParts[1]));
                }

                suitableRoutes.push({route, query});
            }
        }

        if (suitableRoutes.length === 0) {
            return next.handle(request);
        }

        let minQueryProps = Infinity;
        let suitableRoute!: {route: MockRoute, query: MockQuery};

        for (const currentRoute of suitableRoutes) {
            const queryProps = Object.keys(currentRoute.query).length;

            if (queryProps < minQueryProps) {
                minQueryProps = queryProps;
                suitableRoute = currentRoute;
            }
        }

        request.query = suitableRoute.query;

        const response = createHttpResponse(suitableRoute.route.handler(request));
        const responseDelay = firstValidNumber(
            suitableRoute.route.delay,
            this.config.delay,
            DEFAULT_DELAY
        );

        return of(response).pipe(
            delay(responseDelay),
            tap(() => {
                (this.config.logResponse || logResponse)(suitableRoute.route, request, response);
            })
        );
    }
}
