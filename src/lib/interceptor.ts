import { Injectable, Inject } from '@angular/core';
import { HttpHandler, HttpInterceptor } from '@angular/common/http';
import { delay, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MOCK_CONFIG, MockConfig, MockRequest, DEFAULT_DELAY } from './constants';
import { resolvePath, firstValidNumber, fetchQuery, createHttpResponse, logResponse } from './utils';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

    constructor(@Inject(MOCK_CONFIG) private config: MockConfig) {}

    intercept(request: MockRequest, next: HttpHandler) {
        for (const route of this.config.routes) {
            const pattern = resolvePath(this.config.prefix || '', route.url);
            const query = fetchQuery(request.url, pattern);

            if (query && request.method === route.method) {
                request.query = query;

                const response = createHttpResponse(route.handler(request));
                const responseDelay = firstValidNumber(
                    route.delay,
                    this.config.delay,
                    DEFAULT_DELAY
                );

                return of(response).pipe(
                    delay(responseDelay),
                    tap(() => {
                        (this.config.logResponse || logResponse)(route, request, response);
                    })
                );
            }
        }

        return next.handle(request);
    }
}
