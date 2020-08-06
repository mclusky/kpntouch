import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PostsRoutingModule } from './posts-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { PostEffects } from './ngrx/post.effects';
import { StoreModule } from '@ngrx/store';
import { postReducer } from './ngrx/post.reducer';
import { PostResolver } from './ngrx/post.resolver';

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    exports: [
        PostListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        PostsRoutingModule,
        EffectsModule.forFeature([PostEffects]),
        StoreModule.forFeature('posts', postReducer)
    ],
    providers: [PostResolver]
})
export class PostsModule {
    constructor() { }
}
