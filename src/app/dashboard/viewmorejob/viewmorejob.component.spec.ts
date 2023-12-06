import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmorejobComponent } from './viewmorejob.component';

describe('ViewmorejobComponent', () => {
  let component: ViewmorejobComponent;
  let fixture: ComponentFixture<ViewmorejobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewmorejobComponent]
    });
    fixture = TestBed.createComponent(ViewmorejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
