export class AooRoutingModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResetComponent } from './auth/reset/reset.component';

const routes: Routes = [
    {
        path: '',
        component: SignupComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'reset-password/:token',
        component: ResetComponent,
    },
    {
        path: 'groups',
        loadChildren: () => import('./components/groups/group.module').then(m => m.GroupModule)
    },
    {
        path: 'posts',
        loadChildren: () => import('./components/posts/posts.module').then(m => m.PostsModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'user',
        loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [RouterModule],
    providers: [AuthGuard, LoginGuard]
})


export class AppRoutingModule { }

