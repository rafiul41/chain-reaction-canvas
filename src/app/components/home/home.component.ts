import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {v4 as uuidv4} from 'uuid';
import {ActivatedRoute, Router} from "@angular/router";
import {WebsocketService} from "../../services/websocket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayName = '';
  roomId = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private websocketService: WebsocketService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.displayName = params['displayname'];
    })
  }

  createRoom() {
    const roomId = uuidv4().slice(0, 6);
    if (this.displayName && this.displayName !== '') {
      let url = `/chat?displayname=${this.displayName}&roomid=${roomId}`;
      this.router.navigateByUrl(url);
    }
  }

  joinRoom() {
    if(this.roomId.length != 6) {
       return;
    }
    this.websocketService.emit('joinRoom', {displayName: this.displayName, roomId: this.roomId});
  }
}
