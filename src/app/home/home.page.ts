import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  segment = 'scan'
  qrText = ''
  scanResult=''

  constructor(private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController) { }


  ngOnInit(): void {

    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then()
      BarcodeScanner.checkPermissions().then()
      BarcodeScanner.removeAllListeners()

    }
  }

    async startScan() {
      const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass:'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: { 
        formats:[],
        lensFacing: LensFacing.Back,
       }
      });
    
      await modal.present();

      const {data}= await modal.onWillDismiss()

      if(data){
        this.scanResult = data?.barcode?.displayValue
      }
    
    }

  // captura html element, convert it to canvas and get an image
  captureScreen() {

    const element = document.getElementById('qrImage') as HTMLElement
    html2canvas(element).then((canvas: HTMLCanvasElement) => {

      if (this.platform.is('capacitor')) this.shareImage(canvas)
      else this.downloadImage(canvas)
    })
  }

  // download image(web)
  downloadImage(canvas: HTMLCanvasElement) {

    const link = document.createElement('a')
    link.href = canvas.toDataURL();
    link.download = 'qr.png'
    link.click()

  }

  // Share image(mobile)
  async shareImage(canvas: HTMLCanvasElement) {


    let base64 = canvas.toDataURL();
    let path = 'qr.png'

    const loading = await this.loadingController.create({
      //   message: 'Hellow',
      // duration: 2000,
      spinner: 'crescent'
    })

    await loading.present()


    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,

    }).then(async (res) => {

      let uri = res.uri

      await Share.share({ url: uri })

      await Filesystem.deleteFile({
        path, directory: Directory.Cache

      })

    }).finally(() => {

      loading.dismiss()


    })



  }

}
