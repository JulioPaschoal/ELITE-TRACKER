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
    const timeFrom = dayjs(focusTime.data.timeFrom);
    const timeTo = dayjs(focusTime.data.timeTo);

    // VERIFICANDO SE timeFrom É MAIOR QUE timeTo \\
    const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);
    if (isTimeToBeforeTimeFrom) {
      return res.status(400).json({ message: 'timeTo cannot be in the past.' });
    }

    // CRIANDO O FOCO \\
    const createFocusTime = await focusTimeModel.create({
      timeFrom: timeFrom.toDate(),
      timeTo: timeTo.toDate(),
    });
    return res.status(201).json(createFocusTime);
  };
}
