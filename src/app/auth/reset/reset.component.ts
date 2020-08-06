import { Component, OnInit } from '@angular/core';
import { FormGroup, Form, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { isResetToken } from '../ngrx/auth.selectors';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import * as AuthActions from '../ngrx/auth.actions';

@Component({
    selector: 'app-reset',
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.sass']
})
export class ResetComponent implements OnInit {
    resetToken: string;
    resetForm: FormGroup;
    isLoading = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Make sure user has a valid reset token //
        this.store.
            pipe(
                select(isResetToken),
                first()
            )
            .subscribe(token => {
                this.resetToken = token;
            });

        this.resetForm = new FormGroup({
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
    }

    onReset(form: Form) {
        if (this.resetForm.invalid) {
            return;
        }

        if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
            return;
        } else {
            this.store
                .dispatch(AuthActions.setNewPassword(
                    {
                        resetToken: this.resetToken,
                        password: this.resetForm.value.password,
                        confirmPassword: this.resetForm.value.confirmPassword
                    }));
        }
    }

}
