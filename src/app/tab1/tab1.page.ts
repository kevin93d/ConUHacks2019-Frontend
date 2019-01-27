import {Component, OnInit, ViewChild} from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

declare var Peer: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('myvideo') myVideo: any;

  locale: string;
  peer: any;
  anotherid: any;
  mypeerid: any;
  isConnected: boolean;
  constructor(private tts: TextToSpeech, private http: HttpClient) {
    this.locale = 'en-CA';
  }

   ngOnInit() {
    let video = this.myVideo.nativeElement;
    this.peer = new Peer();
    setTimeout(() => {
      this.mypeerid = this.peer.id;
      this.setId(this.mypeerid).subscribe((data) => {

      });
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
     this.getId().subscribe((data) => {
       console.log(data);
       this.anotherid = data;
       var conn = this.peer.connect(this.anotherid);
       let video = this.myVideo.nativeElement;
       let localPeer = this.peer;
       let fname = this.anotherid;
       let status = this.isConnected;
       // on open will be launch when you successfully connect to PeerServer
       conn.on('open', function(){
         // here you have conn.id
         console.log("Connected to PeerServer");
         let n = <any>navigator;
         n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );
         n.getUserMedia({video: true, audio: true}, function(stream) {
           let call = localPeer.call(fname, stream);
           if (status) {
             localPeer.destroy();
             location.reload();
           } else {
             call.on('stream', function(remoteStream) {
               console.log("Stream started");
               video.srcObject = remoteStream;
               video.onloadedmetadata = function (e) {
                 console.log(e);
                 video.play();
               }
             });
           }
         }, function(err) {
           console.log('Failed to get local stream' ,err);
         });
       });
       this.isConnected = !this.isConnected;
     });
   }

  talk(text: string) {
    this.tts.speak({ text: text, locale: this.locale } )
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
  }

  changeLanguage(locale) {
    this.locale = locale;
  }

  connectStatus() {
    return this.isConnected ?  'End Call' : 'Call Peer';
  }

  setId(id: string) {
    return this.http.get(environment.url + "id/0" + "/" + id)
  }

  getId() {
    return this.http.get(environment.url + "id/0/")
  }
}
