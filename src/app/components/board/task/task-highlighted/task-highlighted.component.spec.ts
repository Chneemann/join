import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHighlightedComponent } from './task-highlighted.component';

describe('TaskHighlightedComponent', () => {
  let component: TaskHighlightedComponent;
  let fixture: ComponentFixture<TaskHighlightedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskHighlightedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskHighlightedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
