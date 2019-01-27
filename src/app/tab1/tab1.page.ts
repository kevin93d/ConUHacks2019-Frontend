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
    this.anotherid = 'x6inb0403pl00000';
     let video = this.myVideo.nativeElement;
    this.peer = new Peer();
    setTimeout(() => {
    this.mypeerid = this.peer.id;
    },3000);
    console.log(this.peer);
    this.mypeerid = this.peer.id;

    // receiving
    this.peer.on('connection', function(conn) {
      conn.on('data', function(data) {
        console.log(data);
      });
    });

     var n = <any>navigator;

     n.getUserMedia =  ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia );

     this.peer.on('call', function(call) {

       n.getUserMedia({video: true, audio: true}, function(stream) {
         call.answer(stream);
         console.log('gmm');
         call.on('stream', function(remotestream){
           video.src = URL.createObjectURL(remotestream);
           video.play();
           console.log(remotestream);
           console.log('gmm');
         })
       }, function(err) {
         console.log('Failed to get stream', err);
       })
     })

   }

   // out going
   connect() {
     var conn = this.peer.connect(this.anotherid);
     console.log(conn);
     let video = this.myVideo.nativeElement;
     var localvar = this.peer;
     var fname = this.anotherid;
     conn.on('open', function() {
       console.log('gmm');
       conn.send('Message from that id');
       var n = <any>navigator;
       console.log(video);

       n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );
       n.getUserMedia({video: true, audio: true}, function(stream) {
         var call = localvar.call(fname, stream);
         call.on('stream', function(remoteStream) {
           video.srcObject = remoteStream;
           console.log(video.srcObject);
           video.onloadedmetadata = function (e) {
             video.play();
           }
         });
       }, function(err) {
         console.log('Failed to get local stream' ,err);
       });
     });
   }

  videoconnect(){
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;

    var n = <any>navigator;
    console.log(video);

    n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );

    n.getUserMedia({video: true, audio: true}, function(stream) {
      var call = localvar.call(fname, stream);
      call.on('stream', function(remotestream) {
        console.log(remotestream);
        console.log('gmm');
        video.src = URL.createObjectURL(remotestream);
        video.play();
      })
    }, function(err){
      console.log('Failed to get stream', err);
    })
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
