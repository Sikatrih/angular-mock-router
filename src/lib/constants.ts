import { HttpRequest, HttpResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export interface MockQuery {
    [key: string]: string;
}

export type MockRequest = HttpRequest<any> & {
    query: MockQuery
};

export interface MockRoute {
    url: string;
    delay?: number;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    handler: (request: MockRequest) => any;
}

export type MockRoutes = MockRoute[];

export interface IMockConfig {
    routes: MockRoutes;
    delay?: number;
    prefix?: string;
    disabled?: boolean;
    logResponse?: (route: MockRoute, request: MockRequest, response: HttpResponse<any>) => void;
}

export const MOCK_CONFIG = new InjectionToken<IMockConfig>('mock.config', {providedIn: 'root', factory: () => ({routes: []})});
