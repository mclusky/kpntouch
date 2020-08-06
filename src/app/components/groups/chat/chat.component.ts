import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Group } from 'src/app/models/group.model';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducers';
import { Store, select } from '@ngrx/store';
import { selectGroupById } from '../ngrx/group.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
    group$: Observable<Group>;
    msgForm: FormGroup;
    messages = [];
    userJoin$: Observable<any>;
    userLeft$: Observable<any>;
    subscription: Subscription;
    swearing: boolean;
    username: string;
    room: string;



    @ViewChild('msgWrapper', { static: false }) wrapper: ElementRef;
    @ViewChildren('msg') msg: QueryList<any>;

    private msgContainer: any;
    private isNearBottom = true;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private socketService: SocketService,
        private authService: AuthService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.username = this.authService.getUser().username;
        this.msgForm = new FormGroup({
            'msg': new FormControl(null, { validators: [Validators.required] }),
        });

        // socket io server
        const groupId = this.route.snapshot.paramMap.get('groupId');
        this.group$ = this.store
            .pipe(
                select(selectGroupById, { id: groupId }),
                tap((group: Group) => {
                    this.swearing = group.swearingAllowed;
                    this.room = group.name;
                    this.socketService
                        .emit('join', { username: this.username, room: this.room });
                })
            );
        // New User
        this.userJoin$ = this.socketService
            .listen('userJoin')
            .pipe(
                map(msg => `${moment().format('LT')} : ${msg.toString()}`));

        // When Leaving room
        this.userLeft$ = this.socketService
            .listen('userLeft')
            .pipe(
                map(msg => `${moment().format('LT')} : ${msg.toString()}`));

        // Messages socket
        this.subscription = this.socketService
            .listen('userMsg')
            .subscribe(({ username, msg }) => {
                this.messages.push(`${moment().format('LT')} ${username} : ${msg.toString()}`)
            });
    }

    onSendMsg(form: Form) {
        this.socketService
            .emit('sendMessage', { msg: this.msgForm.value.msg, swearing: this.swearing });
        // Clear message form
        this.msgForm.reset();
    }

    leaveRoom() {
        // Leave room on server
        this.socketService.emit('leave', this.room);
        this.router.navigate([`/groups/${this.route.snapshot.paramMap.get('groupId')}`]);
    }

    // Check for new messages in DOM
    ngAfterViewInit() {
        this.msgContainer = this.wrapper.nativeElement;
        this.msg.changes.subscribe(() => this.msgChanged());
    }

    ngOnDestroy() {
        this.socketService.emit('leave', this.room);
        this.subscription.unsubscribe();
    }

    // Scroll to Bottom of msg container
    private autoScroll() {
        this.msgContainer.scroll({
            top: this.msgContainer.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    // Check if user has scrolled up or is near the bottom
    // before scrolling user down
    private msgChanged() {
        if (this.isNearBottom) {
            this.autoScroll();
        }
    }

    private isBottom(): boolean {
        const threshold = 25;
        const position = this.msgContainer.scrollTop + this.msgContainer.offsetHeight;
        const height = this.msgContainer.scrollHeight;
        return position > height - threshold;
    }

    // update scroll position on scroll
    onScroll(evt: Event) {
        this.isNearBottom = this.isBottom();
    }
}
