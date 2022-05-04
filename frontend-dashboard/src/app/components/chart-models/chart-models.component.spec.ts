import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartModelsComponent } from './chart-models.component';

describe('ChartModelsComponent', () => {
  let component: ChartModelsComponent;
  let fixture: ComponentFixture<ChartModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
