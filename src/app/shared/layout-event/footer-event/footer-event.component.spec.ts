import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterEventComponent } from './footer-event.component';

describe('FooterEventComponent', () => {
  let component: FooterEventComponent;
  let fixture: ComponentFixture<FooterEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterEventComponent]
    });
    fixture = TestBed.createComponent(FooterEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
