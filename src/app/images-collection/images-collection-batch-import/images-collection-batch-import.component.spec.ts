import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionBatchImportComponent } from './images-collection-batch-import.component';

describe('ImagesCollectionBatchImportComponent', () => {
  let component: ImagesCollectionBatchImportComponent;
  let fixture: ComponentFixture<ImagesCollectionBatchImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesCollectionBatchImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCollectionBatchImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
