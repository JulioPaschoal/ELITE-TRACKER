import dayjs from 'dayjs';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
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
      userId: req.user.id,
    });
    return res.status(201).json(newHabits);
  };

  // LISTANDO OS HÁBITOS \\
  index = async (req: Request, res: Response) => {
    const habits = await habitModel
      .find({ userId: req.user.id })
      .sort({ name: 1 });
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
    const habitExists = await habitModel.findOne({
      _id: habit.data.id,
      userId: req.user.id,
    });
    if (!habitExists) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    // REMOVENDO O HÁBITO \\
    await habitModel.findByIdAndDelete(habit.data.id);
    return res.status(204).send();
  };

  // MARCAR UM HÁBITO COMO COMPLETO \\
  toggle = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      id: z.string(),
    });
    // VALIDANDO OS DADOS \\
    const validated = schema.safeParse(req.params);
    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({ message: errors });
    }
    // VERIFICANDO SE O HÁBITO EXISTE \\
    const findHabit = await habitModel.findOne({
      _id: validated.data.id,
      userId: req.user.id,
    });
    if (!findHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    // VERIFICANDO SE O HÁBITO JÁ FOI MARCADO COMO COMPLETO NESSA DATA \\
    const now = dayjs().startOf('day').toISOString();
    const isHabitCompletedOnDate = findHabit
      .toObject()
      ?.completedDates.find(
        (item) => dayjs(String(item)).toISOString() === now,
      );
    if (isHabitCompletedOnDate) {
      // DESMARCANDO O HÁBITO COMO COMPLETO \\
      const habitUpdated = await habitModel.findByIdAndUpdate(
        {
          _id: validated.data.id,
        },
        {
          $pull: {
            completedDates: now,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      return res.status(200).json(habitUpdated);
    }
    // MARCANDO O HÁBITO COMO COMPLETO \\
    const habitUpdated = await habitModel.findByIdAndUpdate(
      {
        _id: validated.data.id,
      },
      {
        $push: {
          completedDates: now,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    return res.status(200).json(habitUpdated);
  };

  // LISTANDO AS METRICAS DE UM HÁBITO \\
  metrics = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      id: z.string(),
      date: z.coerce.date(),
    });
    // RECEBENDO  OS DADOS \\
    const validated = schema.safeParse({ ...req.params, ...req.query });
    // VALIDANDO OS DADOS \\
    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({ message: errors });
    }
    // PEGANDO O INTERVALO DE DATAS DO MÊS \\
    const dateForm = dayjs(validated.data.date).startOf('month').toDate();
    const dateTo = dayjs(validated.data.date).endOf('month').toDate();

    // AGRUPANDO AS METRICAS \\
    const [habitMetrics] = await habitModel
      .aggregate([])
      .match({
        _id: new mongoose.Types.ObjectId(validated.data.id),
        userId: req.user.id,
      })
      .project({
        _id: 1,
        name: 1,
        completedDates: {
          $filter: {
            input: '$completedDates',
            as: 'completedDate',
            cond: {
              $and: [
                { $gte: ['$$completedDate', dateForm] },
                { $lte: ['$$completedDate', dateTo] },
              ],
            },
          },
        },
      });
    // VERIFICANDO SE O HÁBITO EXISTE \\
    if (!habitMetrics) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    // RETORNANDO AS METRICAS \\
    return res.status(200).json(habitMetrics);
  };
}
