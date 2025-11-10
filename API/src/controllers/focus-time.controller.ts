import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { z } from 'zod';

import { focusTimeModel } from '../models/focus-time-model';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';

export class FocusTimeController {
  store = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      timeFrom: z.coerce.date(),
      timeTo: z.coerce.date(),
    });

    // RECEBENDO  OS DADOS \\
    const focusTime = schema.safeParse(req.body);

    // VALIDANDO OS DADOS \\
    if (!focusTime.success) {
      const errors = buildValidationErrorMessage(focusTime.error.issues);
      return res.status(422).json({ message: errors });
    }

    // CONVERTENDO PARA DAYJS \\
    const timeFrom = dayjs(focusTime.data?.timeFrom);
    const timeTo = dayjs(focusTime.data?.timeTo);

    // VERIFICANDO SE timeFrom É MAIOR QUE timeTo \\
    const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);
    if (isTimeToBeforeTimeFrom) {
      return res.status(400).json({ message: 'timeTo cannot be in the past.' });
    }

    // CRIANDO O FOCO \\
    const createFocusTime = await focusTimeModel.create({
      timeFrom: timeFrom.toDate(),
      timeTo: timeTo.toDate(),
      userId: req.user.id,
    });
    return res.status(201).json(createFocusTime);
  };

  index = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      date: z.coerce.date(),
    });
    // RECEBENDO  OS DADOS \\
    const validated = schema.safeParse(req.query);
    // VALIDANDO OS DADOS \\
    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({ message: errors });
    }
    // INICIANDO O DIA INFORMADO \\
    const startOfDay = dayjs(validated.data.date).startOf('day');
    const endOfDay = dayjs(validated.data.date).endOf('day');
    // BUSCANDO OS FOCO DO DIA INFORMADO \\
    const focusTimes = await focusTimeModel
      .find({
        timeFrom: {
          $gte: startOfDay.toDate(),
          $lte: endOfDay.toDate(),
        },
        userId: req.user.id,
      })
      .sort({ timeFrom: 1 });
    return res.status(200).json(focusTimes);
  };

  metricsbyMonth = async (req: Request, res: Response) => {
    // SCHEMA DE VALIDAÇÃO \\
    const schema = z.object({
      date: z.coerce.date(),
    });
    // RECEBENDO  OS DADOS \\
    const validated = schema.safeParse(req.query);
    // VALIDANDO OS DADOS \\
    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({ message: errors });
    }
    // INICIANDO O DIA 1 DO MÊS E ANO INFORMADOS \\
    const startDate = dayjs(validated.data.date).startOf('month');
    const endDate = dayjs(validated.data.date).endOf('month');
    // AGREGANDO OS DADOS \\
    const focusTimeMetrics = await focusTimeModel
      .aggregate()
      .match({
        timeFrom: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
        userId: req.user.id,
      })
      .project({
        year: { $year: '$timeFrom' },
        month: { $month: '$timeFrom' },
        day: { $dayOfMonth: '$timeFrom' },
      })
      .group({
        _id: ['$year', '$month', '$day'],
        count: { $sum: 1 },
      })
      .sort({ _id: 1 });
    return res.status(200).json(focusTimeMetrics);
  };
}
