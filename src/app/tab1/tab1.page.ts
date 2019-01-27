import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  text: string;
  locale: string;
  constructor(private tts: TextToSpeech) {  }

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
