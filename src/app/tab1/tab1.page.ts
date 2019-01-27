import {Component, OnInit, ViewChild} from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import {log} from 'util';
declare var Peer: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('myvideo') myVideo: any;

  text: string;
  locale: string;
  peer: any;
  anotherid: any;
  mypeerid: any;
  constructor(private tts: TextToSpeech) {
    this.locale = 'en-CA';
  }

   ngOnInit() {
    this.anotherid = '4l1wkas3tn700000';
    let video = this.myVideo.nativeElement;
    this.peer = new Peer();
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    },3000);
    this.mypeerid = this.peer.id;

     let n = <any>navigator;
     n.getUserMedia =  ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia );

     this.peer.on('call', function(call) {
       console.log("You have a call!");
       n.getUserMedia({video: true, audio: true}, function(stream) {
         call.answer(stream);
         call.on('stream', function(remoteStream){
           console.log("Stream started");
           video.srcObject = remoteStream;
           video.onloadedmetadata = function (e) {
             console.log(e);
             video.play();
           }
         })
       }, function(err) {
         console.log('Failed to get stream', err);
       })
     })

   }

   // out going
   connect() {
     var conn = this.peer.connect(this.anotherid);
     let video = this.myVideo.nativeElement;
     let localPeer = this.peer;
     let fname = this.anotherid;
      // on open will be launch when you successfully connect to PeerServer
     conn.on('open', function(){
       // here you have conn.id
       console.log("Connected to PeerServer");

       let n = <any>navigator;
       n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );
       n.getUserMedia({video: true, audio: true}, function(stream) {
         let call = localPeer.call(fname, stream);
         call.on('stream', function(remoteStream) {
           console.log("Stream started");
           video.srcObject = remoteStream;
           video.onloadedmetadata = function (e) {
             console.log(e);
             video.play();
           }
         });
       }, function(err) {
         console.log('Failed to get local stream' ,err);
       });
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

    this.tts.speak({ text: this.text, locale: this.locale } )
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
  }

  changeLanguage(locale) {
    this.locale = locale;
  }



}
