import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEmptyComponent } from './task-empty.component';

describe('TaskEmptyComponent', () => {
  let component: TaskEmptyComponent;
  let fixture: ComponentFixture<TaskEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEmptyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
