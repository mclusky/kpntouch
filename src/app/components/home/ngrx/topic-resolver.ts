import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TopicEntityService } from './topic-entity.service';
import { Observable } from 'rxjs';
import { tap, filter, first } from 'rxjs/operators';


@Injectable()
export class TopicResolver implements Resolve<boolean> {

    constructor(private topicService: TopicEntityService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.topicService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.topicService.getAll();
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );
    }
}
