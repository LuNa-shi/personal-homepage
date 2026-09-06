/** Deterministic, unit-duration teaching DAGs; not a model performance estimator. */
export function scheduleTecTasks(structure: 'chain' | 'fork', workers: number) {
  const available = Math.max(1, Math.min(6, Math.floor(workers)));
  const dependencies = structure === 'chain' ? [[], [0], [1], [2]] : [[], [0], [0], [1, 2]];
  const completed = new Set<number>();
  const tasks: Array<{ id: number; worker: number; start: number }> = [];
  let time = 0;
  while (completed.size < dependencies.length) {
    const ready = dependencies
      .map((deps, id) => ({ deps, id }))
      .filter(({ deps, id }) => !completed.has(id) && deps.every((dep) => completed.has(dep)))
      .slice(0, available);
    ready.forEach(({ id }, worker) => tasks.push({ id, worker, start: time }));
    ready.forEach(({ id }) => completed.add(id));
    time++;
  }
  return { tasks, duration: time, span: structure === 'chain' ? 4 : 3 };
}
