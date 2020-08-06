import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-check',
    templateUrl: './check.component.html',
    styleUrls: ['./check.component.sass']
})
export class CheckComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<CheckComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: string, message: string, action: string }
    ) { }

    ngOnInit() {
    }

}
