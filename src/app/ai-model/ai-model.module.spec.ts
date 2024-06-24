import { AIModelModule } from './ai-model.module';

describe('AIModelModule', () => {
  let aiModelModule: AIModelModule;

  beforeEach(() => {
    aiModelModule = new AIModelModule();
  });

  it('should create an instance', () => {
    expect(aiModelModule).toBeTruthy();
  });
});
