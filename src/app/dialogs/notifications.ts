import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class UINotifications {
    constructor(private snackBar: MatSnackBar) { }

    showSnackBar(message, action) {
        this.snackBar.open(message, action);
    }

}