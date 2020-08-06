import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { TopicResolver } from './ngrx/topic-resolver';
import { ReactiveFormsModule } from '@angular/forms';
import { TopicsDataService } from './ngrx/topic-data.service';
import { TopicEntityService } from './ngrx/topic-entity.service';
import { EntityMetadataMap, EntityDefinitionService, EntityDataService } from '@ngrx/data';


const entityMetadata: EntityMetadataMap = {
    Topic: {}
};

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        MaterialModule,
        HomeRoutingModule,
        ReactiveFormsModule
    ],
    providers: [TopicResolver, TopicEntityService, TopicsDataService]
})
export class HomeModule {
    constructor(
        private eds: EntityDefinitionService,
        private entitydataService: EntityDataService,
        private topicDataService: TopicsDataService) {
        eds.registerMetadataMap(entityMetadata);
        entitydataService.registerService('Topic', topicDataService);
    }

}
