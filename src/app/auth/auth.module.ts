import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './ngrx/auth.reducers';
import { AuthEffects } from './ngrx/auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { ResetComponent } from './reset/reset.component';

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
        ResetComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects])
    ]
})
export class AuthModule { }
