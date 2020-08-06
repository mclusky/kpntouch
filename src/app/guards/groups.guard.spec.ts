import { TestBed, async, inject } from '@angular/core/testing';

import { GroupsGuard } from './groups.guard';

describe('GroupsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupsGuard]
    });
  });

  it('should ...', inject([GroupsGuard], (guard: GroupsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
