import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginGGComponent } from './login-gg.component';

describe('LoginGGComponent', () => {
  let component: LoginGGComponent;
  let fixture: ComponentFixture<LoginGGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginGGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginGGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
