import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { GroupRoutingModule } from './group-routing.module';

import {
    EntityMetadataMap,
    EntityDefinitionService,
    EntityDataService,
    EntityCollectionReducer,
    EntityCollectionReducerRegistry
} from '@ngrx/data';
import { TopicsDataService } from '../home/ngrx/topic-data.service';
import { TopicEntityService } from '../home/ngrx/topic-entity.service';
import { TopicResolver } from '../home/ngrx/topic-resolver';
import { GroupResolver } from './ngrx/group-resolver';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { PostsModule } from '../posts/posts.module';
import { EffectsModule } from '@ngrx/effects';
import { GroupEffects } from './ngrx/group.effects';
import { StoreModule } from '@ngrx/store';
import { groupReducer } from './ngrx/group.reducers';
import { ChatComponent } from './chat/chat.component';

const entityMetadata: EntityMetadataMap = {
    Topic: {}
};

// const myReduceer: EntityCollectionReducer = (collection, action) => {
//     console.log('Collection : ', collection);
//     console.log('Action : ', action);
//     if (action.type === '[Group] @ngrx/data/query-many/success') {
//         const arr = [];
//         action.payload.data.map((g, i) => arr.push(g.id));
//         return {
//             ...collection,
//             entities: Object.values(action.payload.data),
//             ids: [...arr],
//             loaded: true
//         };
//     }
// };

@NgModule({
    declarations: [
        CreateGroupComponent,
        GroupListComponent,
        GroupComponent,
        UserGroupsComponent,
        ChatComponent,
    ],
    providers: [
        TopicResolver,
        GroupResolver,
        TopicEntityService,
        TopicsDataService,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterModule,
        GroupRoutingModule,
        PostsModule,
        EffectsModule.forFeature([GroupEffects]),
        StoreModule.forFeature('groups', groupReducer)
    ]
})
export class GroupModule {
    constructor(
        private eds: EntityDefinitionService,
        private entitydataService: EntityDataService,
        private topicDataService: TopicsDataService,
        private ecrr: EntityCollectionReducerRegistry
    ) {
        eds.registerMetadataMap(entityMetadata);
        entitydataService.registerService('Topic', topicDataService);
        // ecrr.registerReducer('Group', myReduceer);
    }
}
