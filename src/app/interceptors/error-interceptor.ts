import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorsComponent } from '../dialogs/errors/errors.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next
            .handle(req)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    let errMsg;
                    errMsg = err.error.message ? err.error.message : 'An uknown error occuured';
                    this.dialog.open(ErrorsComponent, {
                        data: {
                            message: errMsg
                        }
                    });
                    if ([401, 403].indexOf(err.status) !== -1) {
                        // Logout User if not authorised //
                        this.authService.clearLogoutTimeout();
                        localStorage.removeItem('userData');
                        localStorage.removeItem('authData');
                        this.router.navigate(['/']);
                    }
                    if (err.status === 404) {
                        this.dialog.open(ErrorsComponent, { data: { message: errMsg } });
                    }
                    return throwError(err);
                }
                ));
    }
}
