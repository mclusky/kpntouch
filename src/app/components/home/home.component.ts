import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TopicEntityService } from './ngrx/topic-entity.service';
import { map, take, delay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/store/app.reducers';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
    form: FormGroup;
    username$: Observable<string>;
    topics$: Observable<Topic[]>;
    queryTopic: string;
    desriedTopic: string;
    isLoading$: Observable<boolean>;

    constructor(
        private router: Router,
        private topicService: TopicEntityService,
        private route: ActivatedRoute,
        private store: Store<AppState>) { }

    ngOnInit() {
        this.form = new FormGroup({
            'topic': new FormControl('', { validators: [Validators.required] })
        });

        this.username$ = this.store.select('auth')
            .pipe(
                take(1),
                map(authState => authState.username)
            );

        this.topics$ = this.topicService
            .entities$
            .pipe(
                map(topics => topics)
            );

        this.isLoading$ = this.topicService
            .loading$
            .pipe(
                delay(0)
            );
    }

    onSubmit() {
        // Only get the 1st 20 groups from server //
        this.router.navigate(['/groups/group-list'],
            {
                queryParams: {
                    topic: this.form.value.topic.name.toLowerCase(),
                }
            });
    }


}
