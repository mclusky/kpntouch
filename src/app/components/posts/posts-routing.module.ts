import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostsGuard } from 'src/app/guards/posts.guard';
import { PostResolver } from './ngrx/post.resolver';

const routes: Routes = [
    {
        path: ':groupId/create',
        component: PostCreateComponent,
        canActivate: [AuthGuard, PostsGuard],
        canDeactivate: [PostsGuard]
    },
    {
        path: ':groupId/create/:postId',
        component: PostCreateComponent,
        canActivate: [AuthGuard, PostsGuard],
        canDeactivate: [PostsGuard],
        resolve: {
            post: PostResolver
        }
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class PostsRoutingModule { }
