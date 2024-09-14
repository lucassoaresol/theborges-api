import { JsonValue } from '@prisma/client/runtime/library';
import { Dayjs } from 'dayjs';

import dayLib from '../../../libs/dayjs';
import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  requiredMinutes: number;
  date: string;
  professionalId: number;
  isAuthenticated: boolean;
  isIgnoreBreak: boolean;
}

interface IOutput {
  result: string[];
}

interface ITimeSlot {
  start: Dayjs;
  end: Dayjs;
}

interface IWorkingTime {
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

export class ListFreeTimeSlotsUseCase {
  async execute({
    date,
    professionalId,
    requiredMinutes,
    isAuthenticated,
    isIgnoreBreak,
  }: IInput): Promise<IOutput> {
    const freeSlots: string[] = [];
    const now = dayLib().add(isAuthenticated ? 0 : 15, 'minute');
    const dateDayStart = dayLib(date).startOf('day');

    isIgnoreBreak = isAuthenticated && isIgnoreBreak;

    const workingDay = await prismaClient.workingDay.findUnique({
      where: {
        professionalId_date: { date: dateDayStart.toDate(), professionalId },
      },
    });

    if (!workingDay || workingDay.isClosed) {
      return { result: [] };
    }

    const workingHours = this.getWorkingHours(
      workingDay.time,
      dateDayStart,
      isIgnoreBreak,
    );

    const bookings = await this.getBookingsForDay(dateDayStart);

    const occupiedSlots = this.convertBookingsToTimeSlots(
      bookings,
      dateDayStart,
    );

    workingHours.forEach((shift) => {
      this.findFreeTimeSlots(
        freeSlots,
        shift,
        occupiedSlots,
        now,
        requiredMinutes,
      );
    });

    return {
      result: freeSlots,
    };
  }

  private getWorkingHours(
    timeData: JsonValue,
    dateDayStart: Dayjs,
    isIgnoreBreak: boolean,
  ): ITimeSlot[] {
    const workingTime = timeData as unknown as IWorkingTime;

    const workStart = dateDayStart.add(workingTime.start, 'm');
    const workEnd = dateDayStart.add(workingTime.end, 'm');

    let workPeriods: ITimeSlot[] = [{ start: workStart, end: workEnd }];

    if (isIgnoreBreak) {
      return workPeriods;
    }

    workingTime.breaks.forEach((breakPeriod) => {
      const breakStart = dateDayStart.add(breakPeriod.start, 'm');
      const breakEnd = dateDayStart.add(breakPeriod.end, 'm');

      workPeriods = workPeriods.flatMap((period) => {
        if (breakStart.isBetween(period.start, period.end, null, '[)')) {
          return [
            { start: period.start, end: breakStart },
            { start: breakEnd, end: period.end },
          ];
        }
        return [period];
      });
    });

    return workPeriods;
  }

  private async getBookingsForDay(dateDayStart: Dayjs) {
    return prismaClient.booking.findMany({
      where: {
        date: {
          gte: dateDayStart.toDate(),
          lte: dateDayStart.endOf('day').toDate(),
        },
        status: 'CONFIRMED',
      },
      orderBy: { date: 'asc' },
    });
  }

  private convertBookingsToTimeSlots(
    bookings: any[],
    dateDayStart: Dayjs,
  ): ITimeSlot[] {
    return bookings.map<ITimeSlot>((el) => ({
      start: dateDayStart.add(el.startTime, 'm'),
      end: dateDayStart.add(el.endTime, 'm'),
    }));
  }

  private findFreeTimeSlots(
    freeSlots: string[],
    shift: ITimeSlot,
    occupiedSlots: ITimeSlot[],
    now: Dayjs,
    requiredMinutes: number,
  ) {
    let currentStart = shift.start;
    const shiftEnd = shift.end;

    if (currentStart.isBefore(now)) {
      currentStart = now;
    }

    const currentMinutes = currentStart.minute();
    if (currentMinutes % 10 !== 0) {
      currentStart = currentStart.add(10 - (currentMinutes % 10), 'minute');
    }
    currentStart = currentStart.second(0);

    // Filtrar os horários ocupados que estão dentro deste turno
    const relevantOccupiedSlots = occupiedSlots
      .filter(
        (slot) =>
          slot.start.isBetween(shift.start, shift.end, null, '[)') ||
          slot.end.isBetween(shift.start, shift.end, null, '[)'),
      )
      .sort((a, b) => a.start.diff(b.start));

    // Verificar intervalos livres entre ocupações
    while (
      currentStart.add(requiredMinutes, 'minute').isBefore(shiftEnd) ||
      currentStart.add(requiredMinutes, 'minute').isSame(shiftEnd)
    ) {
      const conflictingSlot = relevantOccupiedSlots.find((slot) =>
        currentStart.isBetween(slot.start, slot.end, null, '[)'),
      );

      if (conflictingSlot) {
        currentStart = conflictingSlot.end;
      } else {
        freeSlots.push(currentStart.format('HH:mm'));
        currentStart = currentStart.add(requiredMinutes, 'minute');
      }
    }
  }
}
