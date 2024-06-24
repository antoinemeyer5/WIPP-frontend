import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AIModelDetailComponent } from './ai-model-detail.component';

describe('AIModelDetailComponent', () => {
  let component: AIModelDetailComponent;
  let fixture: ComponentFixture<AIModelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AIModelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AIModelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
