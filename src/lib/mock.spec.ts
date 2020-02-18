/* tslint:disable */
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockModule } from './mock.module';

describe('Mock', () => {
    let component: HostComponent;
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MockModule
            ],
            declarations: [
                HostComponent
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


    it('', () => {

    });

    @Component({
        template: ``,
    })
    class HostComponent {}

    @NgModule({
        imports: [
            MockModule.forRoot({routes: []})
        ]
    })
    class HostModule {

    }
});
