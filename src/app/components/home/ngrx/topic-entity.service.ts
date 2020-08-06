import { Injectable } from '@angular/core';
import { EntityCollectionServiceElementsFactory, EntityCollectionServiceBase } from '@ngrx/data';
import { Topic } from '../../../models/topic.model';

@Injectable()
export class TopicEntityService extends EntityCollectionServiceBase<Topic> {

    constructor(serviceLementFactory: EntityCollectionServiceElementsFactory) {
        super('Topic', serviceLementFactory);
    }
}

