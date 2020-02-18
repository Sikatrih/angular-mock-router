import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { delay, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { MOCK_CONFIG, IMockConfig, MockRequest } from './constants';
import { resolvePath, firstValidNumber, fetchQuery, createHttpResponse, logResponse } from './utils';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

    constructor(@Inject(MOCK_CONFIG) private config: IMockConfig) {}

    intercept(request: MockRequest, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.config.disabled) {
            for (const route of this.config.routes) {
                const url = resolvePath(this.config.prefix || '', route.url);
                const query = fetchQuery(request.url, url);

                if (query && request.method === route.method) {
                    const result = route.handler(Object.assign(request, query));
                    const response = createHttpResponse(result);

                    return of(response).pipe(
                        delay(firstValidNumber(route.delay, this.config.delay, 100)),
                        tap(() => {
                            (this.config.logResponse || logResponse)(route, request, response);
                        })
                    );
                }
            }
        }

        return next.handle(request);
    }
}
