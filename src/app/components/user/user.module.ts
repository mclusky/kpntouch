import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './ngrx/user.reducers';
import { USerEffects } from './ngrx/user.effects';
import { EffectsModule } from '@ngrx/effects';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [UserComponent],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        UserRoutingModule,
        EffectsModule.forFeature([USerEffects]),
        StoreModule.forFeature('user', userReducer)
    ]
})
export class UserModule { }
