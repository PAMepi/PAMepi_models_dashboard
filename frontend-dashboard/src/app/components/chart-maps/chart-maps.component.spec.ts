import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMapsComponent } from './chart-maps.component';

describe('ChartMapsComponent', () => {
  let component: ChartMapsComponent;
  let fixture: ComponentFixture<ChartMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
