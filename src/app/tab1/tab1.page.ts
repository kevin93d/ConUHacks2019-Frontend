import {Component, OnInit, ViewChild} from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {environment} from '../../environments/environment';

declare var Peer: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('myvideo') myVideo: any;
  @ViewChild('canvas') canvas: any;

  locale: string;
  peer: any;
  anotherid: any;
  mypeerid: any;
  isConnected: boolean;
  text: String;
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
       var canvas = this.canvas.nativeElement;
       let video = this.myVideo.nativeElement;
       let localPeer = this.peer;
       let fname = this.anotherid;
       let status = this.isConnected;
       // on open will be launch when you successfully connect to PeerServer
       conn.on('open',() => {
         // here you have conn.id
         console.log("Connected to PeerServer");
         let n = <any>navigator;
         n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );
         n.getUserMedia({video: true, audio: true}, (stream) => {
           let call = localPeer.call(fname, stream);
           if (status) {
             localPeer.destroy();
             location.reload();
           } else {
             call.on('stream', (remoteStream) => {
               console.log("Stream started");
               video.srcObject = remoteStream;
               video.onloadedmetadata = (e) => {
                 console.log(e);
                 video.play();
                   var context = canvas.getContext('2d');
                   let width = 300;
                   let height = 250;
                   if (width && height) {
                     canvas.width = width;
                     canvas.height = height;
                     context.drawImage(video, 0, 0, width, height);

                     var data = canvas.toDataURL('image/png');
                     this.sendImageRecursive(data);
                   }
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
    return this.http.get(environment.url + "id/0/", { responseType: 'text' })
  }

  sendImageRecursive(image) {
    let t = this.text;
    setTimeout(() => {
      this.sendImage(image).subscribe(data => {
        let canvas = this.canvas.nativeElement;
        var context = canvas.getContext('2d');
        context.drawImage(this.myVideo.nativeElement, 0, 0, 300, 250);

        var d = canvas.toDataURL('image/png');
        console.log(data);
        t = t + ' ' + data + '\n';
        this.sendImageRecursive(d);
      });
    }, 500);
  }

  sendImage(image) {
    // Split the base64 string in data and contentType
        var block = image.split(";");
    // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
        var blob = this.b64toBlob(realData, contentType, 0);

    // Create a FormData and append the file with "image" as parameter name
        var formDataToUpload = new FormData();
        formDataToUpload.append("image", blob);
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(environment.url + "aslf", formDataToUpload, {headers: headers, responseType: 'text'})
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
