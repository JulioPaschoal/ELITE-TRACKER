import { Request, Response } from 'express';
import { z } from 'zod';

import { habitModel } from '../models/habit.model';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';

export class HabitsController {
  store = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      name: z.string().min(3),
    });
    // RECEBENDO  OS DADOS \\
    const habit = schema.safeParse(req.body);
    // VALIDANDO OS DADOS \\
    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);
      return res.status(422).json({ message: errors });
    }
    // VERIFICANDO SE O HÁBITO JÁ EXISTE \\
    const habitExists = await habitModel.findOne({ name: habit.data.name });
    if (habitExists) {
      return res.status(400).json({ message: 'Habit already exists' });
    }
    // CRIANDO O HÁBITO \\
    const newHabits = await habitModel.create({
      name: habit.data.name,
      completedDates: [],
    });
    return res.status(201).json(newHabits);
  };

  // LISTANDO OS HÁBITOS \\
  index = async (req: Request, res: Response) => {
    const habits = await habitModel.find().sort({ name: 1 });
    return res.status(200).json(habits);
  };

  // REMOVENDO UM HÁBITO \\
  remove = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      id: z.string(),
    });
    // RECEBENDO  OS DADOS \\
    const habit = schema.safeParse(req.params);
    // VALIDANDO OS DADOS \\
    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);
      return res.status(422).json({ message: errors });
    }
    // VERIFICANDO SE O HÁBITO EXISTE \\
    const habitExists = await habitModel.findOne({ _id: habit.data.id });
    if (!habitExists) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    // REMOVENDO O HÁBITO \\
    await habitModel.findByIdAndDelete(habit.data.id);
    return res.status(204).send();
  };

  // MARCAR UM HÁBITO COMO COMPLETO \\
  toggle = async (req: Request, res: Response) => {};
}
