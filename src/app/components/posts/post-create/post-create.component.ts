import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { validateImage } from './mime-type.validator';
import { Store, select } from '@ngrx/store';

import { AppState } from 'src/app/store/app.reducers';
import { Post } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/auth.service';
import * as PostActions from '../ngrx/post.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';
import { selectPostById } from '../ngrx/post.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isLoading } from 'src/app/store/spinner/spinner.selectors';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.sass']
})
export class PostCreateComponent implements OnInit {
    userContent = '';
    userTitle = '';
    post: Post;
    isLoading$: Observable<boolean>;
    form: FormGroup;
    imagePreview: any;
    author: string;
    private groupId: string;
    private mode = 'create';
    private postId: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.isLoading$ = this.store.pipe(select(isLoading));
        this.author = this.authService.getUser().userId;
        // Init Form
        this.form = new FormGroup({
            'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            'content': new FormControl(null, { validators: [Validators.required] }),
            'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [validateImage] })
        });

        this.route.paramMap
            .subscribe((paramMap: ParamMap) => this.groupId = paramMap.get('groupId'));

        // RETRIEVE POST FROM STORE TO POPULATE FORM //
        this.route.paramMap
            .subscribe((paramMap: ParamMap) => {
                if (paramMap.get('postId')) {
                    this.mode = 'edit';
                    this.postId = paramMap.get('postId').toString();
                    this.store.pipe(select(selectPostById, { postId: this.postId }))
                        .pipe(
                            map(post => post)
                        )
                        .subscribe(post => {
                            this.form.setValue({
                                title: post.title,
                                content: post.content,
                                image: post.imagePath
                            });
                            this.imagePreview = post.imagePath;
                        });
                } else {
                    this.mode = 'create';
                    this.postId = undefined;
                }
            });
    }

    onSavePost() {
        /*
        CHECK IF USER IS CREATING A NEW POST OR UPDATING ONE
        IF UPDATING, CHECK IF THE IMAGE HAS BEEN UPDATED
        IF SO, CREATE NEW FORM DATA
        ELSE JUST SEND A POST OBJECT
        */
        if (this.form.invalid) {
            return;
        }
        if (this.mode === 'create') {
            const post = new FormData();
            post.append('_id', undefined);
            post.append('title', this.form.value.title);
            post.append('content', this.form.value.content);
            post.append('image', this.form.value.image);
            post.append('author', this.author);
            post.append('group', this.groupId);

            this.store.dispatch(PostActions.createPost({ post }));

        } else if (this.mode === 'edit') {
            if (typeof this.form.value.image === 'object') {

                const post = new FormData();
                post.append('_id', this.postId);
                post.append('title', this.form.value.title);
                post.append('content', this.form.value.content);
                post.append('group', this.groupId);
                post.append('author', this.author);
                post.append('image', this.form.value.image, this.form.value.title);

                this.store.dispatch(PostActions.updatePost({ post, id: this.postId }));

            } else {
                const post = {
                    _id: this.postId,
                    title: this.form.value.title,
                    content: this.form.value.content,
                    imagePath: this.form.value.image,
                    group: this.groupId,
                    author: this.author
                };
                this.store.dispatch(PostActions.updatePost({ post, id: this.postId }));
            }
        }
        this.form.reset();
        this.store.dispatch(SpinnerActions.startSpinner());
        this.router.navigate(['/groups', `${this.groupId}`]);
    }

    onSelectFile(e: Event) {
        const file = (e.target as HTMLInputElement).files[0];
        this.form.patchValue({
            'image': file
        });
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            // this.imagePreview = this.sanitizer.bypassSecurityTrustResourceUrl(<string>reader.result);
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

}
