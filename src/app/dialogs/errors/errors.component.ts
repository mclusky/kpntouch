import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.sass']
})
export class ErrorsComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

    ngOnInit() {
    }

}
