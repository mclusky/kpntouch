import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { ErrorsComponent } from './dialogs/errors//errors.component';
import { MaterialModule } from './material.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './components/groups/group.module';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './store/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

import { EntityDataModule, DefaultDataServiceConfig } from '@ngrx/data';
import { HomeModule } from './components/home/home.module';
import { MessagesComponent } from './dialogs/messages/messages.component';
import { PostsModule } from './components/posts/posts.module';
import { UserModule } from './components/user/user.module';
import { CheckComponent } from './dialogs/check/check.component';

const pluralNames = {
    Topic: 'Topics'
};

const defaultDataServiceConfig: DefaultDataServiceConfig = {
    root: environment.api_url,
};

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ErrorsComponent,
        MessagesComponent,
        CheckComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        MaterialModule,
        AuthModule,
        GroupModule,
        HomeModule,
        PostsModule,
        UserModule,
        StoreModule.forRoot(appReducers),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router',
            routerState: RouterState.Minimal
        }
        ),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot({
            pluralNames
        }),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorsComponent]
})
export class AppModule { }
