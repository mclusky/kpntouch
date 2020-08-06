import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Topic } from 'src/app/models/topic.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.api_url;

@Injectable()
export class TopicsDataService extends DefaultDataService<Topic> {

    constructor(http: HttpClient, httpUrl: HttpUrlGenerator) {
        super('Topic', http, httpUrl);
    }
    getAll(): Observable<any> {
        return this.http.get<Topic[]>(`${BACKEND_URL}/topics`)
            .pipe(
                map(res => res)
            );
    }
}
