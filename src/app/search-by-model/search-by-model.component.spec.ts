import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByModelComponent } from './search-by-model.component';

describe('SearchByModelComponent', () => {
  let component: SearchByModelComponent;
  let fixture: ComponentFixture<SearchByModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchByModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
