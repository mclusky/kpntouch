import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { GroupListComponent } from './group-list/group-list.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { TopicResolver } from '../home/ngrx/topic-resolver';
import { GroupResolver } from './ngrx/group-resolver';
import { GroupComponent } from './group/group.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { GroupsGuard } from 'src/app/guards/groups.guard';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
    {
        path: 'group-list',
        component: GroupListComponent,
        canActivate: [AuthGuard, GroupsGuard],
        resolve: {
            groups: GroupResolver
        }
    },
    {
        path: 'create',
        component: CreateGroupComponent,
        canActivate: [AuthGuard, GroupsGuard],
        canDeactivate: [GroupsGuard],
        resolve: {
            topics: TopicResolver
        }
    },
    {
        path: 'create/:groupId',
        component: CreateGroupComponent,
        canActivate: [AuthGuard, GroupsGuard],
        canDeactivate: [GroupsGuard],
        resolve: {
            topics: TopicResolver,
        }
    },
    {
        path: 'user-groups',
        component: UserGroupsComponent,
        canActivate: [AuthGuard, GroupsGuard]
    },
    {
        path: ':groupId',
        component: GroupComponent,
        canActivate: [AuthGuard, GroupsGuard],
        resolve: {
            groups: GroupResolver,
        }
    },
    {
        path: ':groupId/chat',
        component: ChatComponent,
        canActivate: [AuthGuard, GroupsGuard],
        resolve: {
            group: GroupResolver
        }
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
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class GroupRoutingModule { }
