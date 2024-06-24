import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AIModelTemplateComponent } from './ai-model-template.component';

describe('AIModelTemplateComponent', () => {
  let component: AIModelTemplateComponent;
  let fixture: ComponentFixture<AIModelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AIModelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AIModelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
