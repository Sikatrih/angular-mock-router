import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MockInterceptor } from './interceptor';
import { MockConfig, MOCK_CONFIG } from './constants';

@NgModule()
export class MockRouterModule {
    public static forRoot(config: MockConfig): ModuleWithProviders<MockRouterModule> {
        return {
            ngModule: MockRouterModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MockInterceptor,
                    multi: true
                },
                {
                    provide: MOCK_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
