import { HttpRequest, HttpResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export interface DataObject<T> {
    [key: string]: T;
}

export type MockQuery = DataObject<string>;

export type MockRequest = HttpRequest<any> & {query: MockQuery};

export interface MockRoute {
    url: string;
    delay?: number;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    handler: (request: MockRequest) => any;
}

export type MockRoutes = MockRoute[];

export interface MockConfig {
    routes: MockRoutes;
    delay?: number;
    prefix?: string;
    logResponse?: (route: MockRoute, request: MockRequest, response: HttpResponse<any>) => void;
}

export const MOCK_CONFIG = new InjectionToken<MockConfig>('mock.config',
    {
        providedIn: 'root',
        factory: () => ({routes: []})
    }
);

export const DEFAULT_DELAY = 100;
