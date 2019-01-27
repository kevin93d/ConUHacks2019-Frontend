import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import * as Peer from '../../assets/peer.js'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  text: string;
  locale: string;
  peer: any;
  anotherid: any;
  mypeerid: any;

  constructor(private tts: TextToSpeech) { 

   }

   ngOnInit() {
    this.peer = new Peer({key: '<yourkeyhere>'});
    setTimeout(() => {
    this.mypeerid = this.peer.id;
    },3000);

    this.peer.on('connection', function(conn) {
      conn.on('data', function(data) {
        console.log(data);
      });
    });
   }

   connect() {
     var conn = this.peer.connect(this.anotherid);

     conn.on('open', function() {
       conn.send('Message from that id');
     });
   }

  talk(numb: number) {

    switch (numb) {
      case 1:
        this.text = 'tabarnak';
        break;
      case 2:
        this.text = 'Giet Mamaw';
        break;
      case 3:
        this.text = 'Rosa tes laid';
        break;
      case 4:
        this.text = 'Joke';
        break;
    }

    this.tts.speak({text: this.text, locale: this.locale} )
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
  }



}
