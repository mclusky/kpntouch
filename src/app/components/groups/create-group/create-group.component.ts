import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TopicEntityService } from '../../home/ngrx/topic-entity.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Group } from 'src/app/models/group.model';
import * as UserActions from '../../user/ngrx/user.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';
import { selectUserGroupById } from '../../user/ngrx/user.selectors';
import { isLoading } from 'src/app/store/spinner/spinner.selectors';

@Component({
    selector: 'app-create-group',
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.sass']
})
export class CreateGroupComponent implements OnInit {
    noGroup = false;
    topics$: Observable<Topic[]>;
    desiredTopic: string;
    form: FormGroup;
    groupId: string;
    isEditMode = false;
    swearing: boolean;
    groupToUpdate: Group;
    groupUpdated = false;
    isLoading$: Observable<boolean>;

    constructor(
        private route: ActivatedRoute,
        private topicService: TopicEntityService,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.isLoading$ = this.store.pipe(select(isLoading));
        this.form = new FormGroup({
            'topic': new FormControl(null, { validators: [Validators.required] }),
            'title': new FormControl(null, { validators: [Validators.required] }),
            'content': new FormControl(null, { validators: [Validators.required, Validators.maxLength(100)] }),
            'language': new FormControl(null, { validators: [Validators.required] })
        });

        this.groupId = this.route.snapshot.paramMap.get('groupId');
        if (this.groupId) {
            this.isEditMode = true;
            this.store.pipe(select(selectUserGroupById, { id: this.groupId }))
                .pipe(
                    map(group => group),
                )
                .subscribe(group => {
                    this.groupToUpdate = group;
                    this.swearing = group.swearingAllowed;
                    this.form.setValue({
                        'topic': group.topic,
                        'title': group.name,
                        'content': group.description,
                        'language': group.swearingAllowed
                    });
                });
        }

        // Offer to create a group if there isn't any group yet //
        this.route.queryParams
            .subscribe((params: Params) => {
                this.noGroup = params.empty;
                if (params.topic) {
                    this.desiredTopic = params.topic[0].toUpperCase() + params.topic.slice(1);
                }
            });

        this.topics$ = this.topicService.entities$
            .pipe(
                map(topics => topics)
            );
    }

    onCreateGroup() {
        if (!this.isEditMode) {
            const myGroup: Group = {
                _id: undefined,
                topic: this.form.value.topic.name.toLowerCase(),
                name: this.form.value.title,
                description: this.form.value.content,
                admin: undefined,
                swearingAllowed: this.form.value.language === 'true' ? true : false,
                postsLoaded: false
            };
            this.store.dispatch(UserActions.createGroup({ group: myGroup }));
            this.form.reset();
        } else {
            const updatedGroup: Group = {
                ...this.groupToUpdate,
                name: this.form.value.title,
                description: this.form.value.content,
                swearingAllowed: this.form.value.language === 'true' ? true : false
            };
            this.groupUpdated = true;
            this.store.dispatch(UserActions.updateGroup({ group: updatedGroup }));
            this.form.reset();
        }
        this.store.dispatch(SpinnerActions.startSpinner());
    }
}
