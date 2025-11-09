import { Router } from 'express';

import packageJson from '../package.json';
import { AuthController } from './controllers/auth.controller';
import { FocusTimeController } from './controllers/focus-time.controller';
import { HabitsController } from './controllers/habits.controller';
import { authMiddleware } from './middleware/auth.middleware';

export const routes = Router();

const habitsController = new HabitsController();
const focusTimeController = new FocusTimeController();
const authController = new AuthController();

routes.get('/', (req, res) => {
  const { name, description, version } = packageJson;
  return res.status(200).json({ name, description, version });
});

// Autenticação com o GitHub \\
routes.get('/auth', authController.auth);
routes.get('/auth/callback', authController.authCallback);

// Middleware de autenticação \\
routes.use(authMiddleware);

// Habits Endpoints \\
routes.get('/habits', habitsController.index);
routes.get('/habits/:id/metrics', habitsController.metrics);
routes.post('/habits', habitsController.store);
routes.delete('/habits/:id', habitsController.remove);
routes.patch('/habits/:id/toggle', habitsController.toggle);

// Focus Time Endpoints \\
routes.post('/focus-time', focusTimeController.store);
routes.get('/focus-time/metrics', focusTimeController.metricsbyMonth);
routes.get('/focus-time', focusTimeController.index);
