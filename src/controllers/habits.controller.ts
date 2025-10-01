import { Request, Response } from 'express';

import { habitModel } from '../models/habit.model';

export class HabitsController {
  store = async (req: Request, res: Response) => {
    const { name } = req.body;
    const newHabits = await habitModel.create({
      name,
      completedDates: [],
    });
    return res.status(201).json(newHabits);
  };
}
