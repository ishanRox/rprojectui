import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalComponentComponent } from './vehical-component.component';

describe('VehicalComponentComponent', () => {
  let component: VehicalComponentComponent;
  let fixture: ComponentFixture<VehicalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
