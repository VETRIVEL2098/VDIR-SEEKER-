import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvbuilderComponent } from './cvbuilder.component';

describe('CvbuilderComponent', () => {
  let component: CvbuilderComponent;
  let fixture: ComponentFixture<CvbuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CvbuilderComponent]
    });
    fixture = TestBed.createComponent(CvbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
