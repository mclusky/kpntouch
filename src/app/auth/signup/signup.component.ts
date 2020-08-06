import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/models/signup-data.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import * as AuthActions from '../ngrx/auth.actions';
import { map } from 'rxjs/operators';
import { loading } from '../ngrx/auth.selectors';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authSub: Subscription;
    usernameTaken = false;
    signupForm: FormGroup;

    constructor(
        private store: Store<AppState>) { }

    ngOnInit() {
        this.signupForm = new FormGroup({
            'email': new FormControl(null, { validators: [Validators.email, Validators.required] }),
            'username': new FormControl(null, { validators: [Validators.required, Validators.minLength(5)] }),
            'password': new FormControl(null,
                {
                    validators:
                        [
                            Validators.required,
                            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
                        ]
                }),
            'confirmPassword': new FormControl(null, { validators: [Validators.required] })
        });

        this.authSub = this.store
            .select(loading)
            .pipe(
                map(status => status)
            )
            .subscribe(status => {
                this.isLoading = status;
            });
    }

    onSignup() {
        if (this.signupForm.invalid) {
            return;
        }
        const signupData: SignupData = {
            email: this.signupForm.value.email,
            username: this.signupForm.value.username,
            password: this.signupForm.value.password,
            confirmPassword: this.signupForm.value.confirmPassword
        };
        if (signupData.password !== signupData.confirmPassword) {
            return;
        } else {
            this.store.dispatch(AuthActions.trySignup({ payload: signupData }));
        }
    }

    ngOnDestroy() {
        this.authSub.unsubscribe();
    }


}
