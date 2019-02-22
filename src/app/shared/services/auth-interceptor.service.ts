import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {


  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token Utilisateur
    const currentUser: any = {};
    currentUser.token = 'aaazzzuuutttjaioublieletoken';

    console.log('Ajoute l\'entête avec le token utilisateur');
    request = request.clone({
      setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
      }
    });
    return next.handle(request);
  }
}
