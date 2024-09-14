import dayLib from '../../../libs/dayjs';
import { prismaClient } from '../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  professionalId: number;
  start: number;
  end: number;
}

type IOutput = void;

interface IWorkingTime {
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

export class UpdateWorkingDayUseCase {
  async execute({ end, professionalId, start }: IInput): Promise<IOutput> {
    const today = dayLib().tz('America/Fortaleza').startOf('day');

    this.validateInput(start, end);

    const workingDay = await prismaClient.workingDay.findUnique({
      where: { professionalId_date: { professionalId, date: today.toDate() } },
    });

    if (!workingDay) {
      throw new AppError('Nenhum dia de trabalho encontrado para a data atual');
    }

    const times = workingDay.time as unknown as IWorkingTime;

    const updatedTimes = this.addBreakToWorkingTimes(times, { start, end });

    await prismaClient.workingDay.update({
      where: { professionalId_date: { professionalId, date: today.toDate() } },
      data: { time: updatedTimes },
    });
  }

  private validateInput(start: number, end: number) {
    if (typeof start !== 'number' || typeof end !== 'number') {
      throw new AppError(
        'Os horários de início e término devem ser números válidos',
      );
    }

    if (start < 0 || start > 1440 || end < 0 || end > 1440) {
      throw new AppError(
        'Os horários de início e término devem estar entre 00:00 e 23:59',
      );
    }

    if (start >= end) {
      throw new AppError(
        'O horário de início deve ser menor que o horário de término',
      );
    }
  }

  private addBreakToWorkingTimes(
    times: IWorkingTime,
    newBreak: { start: number; end: number },
  ) {
    const { breaks } = times;
    const today = dayLib().tz('America/Fortaleza').startOf('day');

    const updatedBreaks = breaks.map((brk) => {
      const breakStart = today.add(brk.start, 'm');
      const breakEnd = today.add(brk.end, 'm');
      const newBreakStart = today.add(newBreak.start, 'm');
      const newBreakEnd = today.add(newBreak.end, 'm');

      if (newBreakStart.isBefore(breakEnd) && newBreakEnd.isAfter(breakStart)) {
        const startDay = dayLib.min(breakStart, newBreakStart);
        const endDay = dayLib.max(breakEnd, newBreakEnd);
        return {
          start: startDay.hour() * 60 + startDay.minute(),
          end: endDay.hour() * 60 + endDay.minute(),
        };
      }
      return brk;
    });

    const isOverlapping = updatedBreaks.some((brk) => {
      const breakStart = today.add(brk.start, 'm');
      const breakEnd = today.add(brk.end, 'm');
      return (
        today
          .add(newBreak.start, 'm')
          .isBetween(breakStart, breakEnd, null, '[)') ||
        today.add(newBreak.end, 'm').isBetween(breakStart, breakEnd, null, '[)')
      );
    });

    if (!isOverlapping) {
      updatedBreaks.push({
        start: newBreak.start,
        end: newBreak.end,
      });
    }

    updatedBreaks.sort((a, b) => {
      const breakAStart = today.add(a.start, 'm');
      const breakBStart = today.add(b.start, 'm');
      return breakAStart.diff(breakBStart);
    });

    return {
      ...times,
      breaks: updatedBreaks,
    };
  }
}
