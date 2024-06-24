import { TestBed, inject } from '@angular/core/testing';

import { AIModelService } from './ai-model.service';

describe('AIModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AIModelService]
    });
  });

  it('should be created', inject([AIModelService], (service: AIModelService) => {
    expect(service).toBeTruthy();
  }));
});
