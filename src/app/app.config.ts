import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"join-c681c","appId":"1:400675412426:web:cb85b11123b40713ad5733","storageBucket":"join-c681c.appspot.com","apiKey":"AIzaSyCflbtIlrAaEW9GUrkeEnSBJdqVwtPYquQ","authDomain":"join-c681c.firebaseapp.com","messagingSenderId":"400675412426"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
