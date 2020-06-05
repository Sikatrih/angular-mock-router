/* tslint:disable */
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockRouterModule } from './mock.module';
import { MockRoutes, MockConfig } from './constants';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { timer, of } from 'rxjs';

describe('Interceptor', () => {

    describe('Routing', () => {
        let component: HostComponent;
        let fixture: ComponentFixture<HostComponent>;

        const routes: MockRoutes = [
            {
                url: 'user',
                method: 'GET',
                handler: () => 'userToken'
            },
            {
                url: '/user/:id',
                method: 'GET',
                handler: (req) => `${req.query.id}`
            },
            {
                url: '/:userId/info',
                method: 'GET',
                handler: req => `userId: ${req.query.userId}`
            },
            {
                url: '/:userId/:info',
                method: 'GET',
                handler: req => `user => id: ${req.query.userId}, info: ${req.query.info}`
            },
            {
                url: '/user/info',
                method: 'GET',
                handler: () => `user info`
            },
            {
                url: '/error',
                method: 'GET',
                handler: () => new HttpErrorResponse({status: 404})
            },
            {
                url: '/no-content',
                method: 'GET',
                handler: () => new HttpResponse({status: 204})
            },
            {
                url: '/post',
                method: 'POST',
                handler: (req) => req.body
            },
            {
                url: '/delete',
                method: 'DELETE',
                handler: () => new HttpResponse({status: 200})
            },
            {
                url: '/patch',
                method: 'PATCH',
                handler: (req) => req.body
            },
            {
                url: '/put',
                method: 'PUT',
                handler: (req) => req.body
            }
        ];

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    HostModule
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(HostComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('"/user"', done => {
            component.http.get('user')
                .pipe(
                    catchError(err => {
                        expect(err instanceof HttpErrorResponse).toBeFalsy();

                        done();
                        return 'error message';
                    })
                )
                .subscribe(data => {
                    expect(data).toBe('userToken');
                    done();
                });
        });

        it('"/users"', done => {
            component.http.get('users')
                .pipe(
                    catchError(err => {
                        expect(err instanceof HttpErrorResponse).toBeTruthy();

                        done();
                        return 'error message'
                    })
                )
                .subscribe((data) => {
                    expect(data).not.toBe('userToken');
                    done();
                });
        });

        it('"/user/:id"', done => {
            component.http.get('/user/userId').subscribe(data => {
                expect(data).toBe('userId');
                done();
            })
        });

        it('"/user/:id"', done => {
            component.http.get('/user/userId').subscribe(data => {
                expect(data).toBe('userId');
                done();
            })
        });

        it('"/user/info"', done => {
            component.http.get('/user/info').subscribe(data => {
                expect(data).toBe('user info');
                done();
            })
        });

        it('"/user-id/info"', done => {
            component.http.get('/user-id/info').subscribe(data => {
                expect(data).toBe('userId: user-id');
                done();
            })
        });

        it('"/user-id/user-info"', done => {
            component.http.get('/user-id/user-info').subscribe(data => {
                expect(data).toBe('user => id: user-id, info: user-info');
                done();
            })
        });

        /* TODO: catch error handler */
        xit('"/error"', done => {
            component.http.get('/error').subscribe(data => {
                expect(data).toEqual(new HttpErrorResponse({status: 404}))
                done();
            })
        });

        it('"/no-content"', done => {
            component.http.get('/no-content').subscribe(data => {
                expect(data).toEqual(null as any)
                done();
            });
        });

        it('"/post"', done => {
            component.http.post('/post', {token: 'postTokenId'}).subscribe(data => {
                expect(data).toEqual({token: 'postTokenId'})
                done();
            });
        });

        it('"/put"', done => {
            component.http.put('/put', {token: 'putTokenId'}).subscribe(data => {
                expect(data).toEqual({token: 'putTokenId'})
                done();
            });
        });

        it('"/patch"', done => {
            component.http.patch('/patch', {token: 'patchTokenId'}).subscribe(data => {
                expect(data).toEqual({token: 'patchTokenId'})
                done();
            });
        });

        it('"/delete"', done => {
            component.http.delete('/delete').subscribe(data => {
                expect(data).toEqual(null as any)
                done();
            });
        });

        @Component({template: ``,})
        class HostComponent {
            constructor(public http: HttpClient) {}
        }

        @NgModule({
            imports: [
                HttpClientModule,
                MockRouterModule.forRoot({routes, delay: 0})
            ],
            declarations: [HostComponent]
        })
        class HostModule {}
    });

    describe('Configs', () => {
        const createHttp = (config: MockConfig) => {
            @Component({template: ``,})
            class HostComponent {
                constructor(public http: HttpClient) {}
            }

            @NgModule({
                imports: [
                    HttpClientModule,
                    MockRouterModule.forRoot(config)
                ],
                declarations: [HostComponent]
            })
            class HostModule {}

            TestBed.configureTestingModule({
                imports: [
                    HostModule
                ]
            }).compileComponents();

            return TestBed.createComponent(HostComponent).componentInstance.http;
        };

        it('default "delay" should be 100ms', async () => {
            const http = createHttp({
                routes: [{
                    url: 'user',
                    method: 'GET',
                    handler: () => null
                }]
            });

            const delaySpy = jasmine.createSpy('delay');

            http.get('user').subscribe(() => {
                delaySpy();
            });

            await timer(75).toPromise();

            expect(delaySpy).toHaveBeenCalledTimes(0);

            await timer(50).toPromise();

            expect(delaySpy).toHaveBeenCalledTimes(1);
        });

        it('should set "delay" from config', async () => {
            const http = createHttp({
                routes: [{
                    url: 'user',
                    method: 'GET',
                    handler: () => null
                }],
                delay: 0
            });

            const delaySpy = jasmine.createSpy('delay');

            http.get('user').subscribe(() => {
                delaySpy();
            });

            await timer(20).toPromise();

            expect(delaySpy).toHaveBeenCalledTimes(1);
        });

        it('should set "delay" from route', async () => {
            const http = createHttp({
                routes: [{
                    url: 'user',
                    method: 'GET',
                    handler: () => null,
                    delay: 50
                }],
                delay: 0
            });

            const delaySpy = jasmine.createSpy('delay');

            http.get('user').subscribe(() => {
                delaySpy();
            });

            await timer(35).toPromise();

            expect(delaySpy).toHaveBeenCalledTimes(0);

            await timer(35).toPromise();

            expect(delaySpy).toHaveBeenCalledTimes(1);
        });

        it('should add "api" to each of prefix', (done) => {
            const http = createHttp({
                routes: [{
                    url: '/user',
                    method: 'GET',
                    handler: () => 'userToken',
                    delay: 0
                }],
                prefix: 'api'
            });

            http.get('api/user').subscribe((data) => {
                expect(data).toBeTruthy();
                done();
            });
        });

        it('should add "api" to each of prefix', async (done) => {
            const logSpy = jasmine.createSpy('log');

            const http = createHttp({
                routes: [{
                    url: '/user',
                    method: 'GET',
                    handler: () => 'userToken',
                    delay: 0
                }],
                logResponse: (...args: any[]) => {
                    expect(args.length).toBe(3);
                    logSpy(args);
                    done();
                }
            });

            http.get('user').subscribe(() => {});

            await timer(20).toPromise();

            expect(logSpy).toHaveBeenCalledTimes(1);
        });
    });
});
