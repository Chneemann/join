import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IMAGE_CONFIG } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideHttpClient(),
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'join-c681c',
          appId: '1:400675412426:web:cb85b11123b40713ad5733',
          storageBucket: 'join-c681c.appspot.com',
          apiKey: 'AIzaSyCflbtIlrAaEW9GUrkeEnSBJdqVwtPYquQ',
          authDomain: 'join-c681c.firebaseapp.com',
          messagingSenderId: '400675412426',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
  ],
};
