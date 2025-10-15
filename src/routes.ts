import { Router } from 'express';

import packageJson from '../package.json';
import { FocusTimeController } from './controllers/focus-time.controller';
import { HabitsController } from './controllers/habits.controller';

export const routes = Router();

const habitsController = new HabitsController();
const focusTimeController = new FocusTimeController();

routes.get('/', (req, res) => {
  const { name, description, version } = packageJson;
  return res.status(200).json({ name, description, version });
});

// Habits Endpoints \\
routes.get('/habits', habitsController.index);
routes.get('/habits/:id/metrics', habitsController.metrics);
routes.post('/habits', habitsController.store);
routes.delete('/habits/:id', habitsController.remove);
routes.patch('/habits/:id/toggle', habitsController.toggle);

// Focus Time Endpoints \\
routes.post('/focus-time', focusTimeController.store);
routes.get('/focus-time/metrics-by-month', focusTimeController.metricsbyMonth);
