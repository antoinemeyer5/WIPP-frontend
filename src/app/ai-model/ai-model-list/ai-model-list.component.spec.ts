import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AIModelListComponent } from './ai-model-list.component';

describe('AIModelListComponent', () => {
  let component: AIModelListComponent;
  let fixture: ComponentFixture<AIModelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AIModelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AIModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
