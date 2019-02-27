import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { IhmModule } from './shared/ihm/ihm/ihm.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IhmModule,
        ToastrModule.forRoot(
          {
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true
          }
        )
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        ToastrService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  it('should create the app', inject([ToastrService], (service: ToastrService) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
