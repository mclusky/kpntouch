import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.sass']
})
export class MessagesComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { header: string, message: string }) { }

    ngOnInit() {
    }

}
