import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MockInterceptor } from './interceptor';
import { IMockConfig, MOCK_CONFIG } from './constants';

@NgModule()
export class MockModule {
    public static forRoot(config: IMockConfig): ModuleWithProviders {
        return {
            ngModule: MockModule,
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
