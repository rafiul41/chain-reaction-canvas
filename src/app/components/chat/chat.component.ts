import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  roomId = '';
  displayName = '';
  message = '';

  constructor(
    private websocketService: WebsocketService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.displayName = params['displayname'];
      this.roomId = params['roomid'];
      console.log(this.displayName, this.roomId);
    });

    this.websocketService.listen('updateChat')
      .subscribe((data: any) => {
        const node = document.createElement('div');
        node.innerText = `${data.displayName}: ${data.message}`;
        const chatElement = document.getElementById('chats');
        if(chatElement) {
          chatElement.appendChild(node);
        }
      })
  }

  sendMessage() {
    this.websocketService.emit('chatMessage', {
      displayName: this.displayName,
      message: this.message,
      roomId: this.roomId
    });
    this.message = '';
  }
}
