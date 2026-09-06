import { describe, expect, it } from 'vitest';

import { scheduleTecTasks } from './tec-schedule';

describe('TEC teaching schedules', () => {
  it('preserves the serial path regardless of extra workers', () => {
    for (let workers = 1; workers <= 6; workers++) {
      expect(scheduleTecTasks('chain', workers).duration).toBe(4);
    }
  });
  it('exposes the fork/join ceiling after the second worker', () => {
    expect(scheduleTecTasks('fork', 1).duration).toBe(4);
    for (let workers = 2; workers <= 6; workers++) {
      const result = scheduleTecTasks('fork', workers);
      expect(result.duration).toBe(3);
      expect(result.tasks.find((task) => task.id === 3)?.start).toBe(2);
      expect(result.tasks.filter((task) => task.start === 1).map((task) => task.id)).toEqual([
        1, 2,
      ]);
      expect(new Set(result.tasks.map((task) => `${task.worker}:${task.start}`)).size).toBe(4);
    }
  });
});
