import { JsonValue } from '@prisma/client/runtime/library';
import { Dayjs } from 'dayjs';

import dayLib from '../../../libs/dayjs';
import { prismaClient } from '../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  key: number;
}

interface IOutput {
  result: IResult;
}

interface IWorkingDay {
  key: number;
  professionalId: number;
  date: Date;
  time: JsonValue | IWorkingTime | null;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IBooking {
  id: number;
  start: number;
  end: number;
  client: string;
  services: string;
  color: string;
}

interface IWorkingTime {
  start: number;
  end: number;
  breaks: { start: number; end: number }[];
}

interface IResult extends IWorkingDay {
  bookings: IBooking[];
}

export class RetrieveWorkingDayUseCase {
  async execute({ key }: IInput): Promise<IOutput> {
    const workingDay = await prismaClient.workingDay.findFirst({
      where: { key },
    });

    if (!workingDay) {
      throw new AppError('');
    }

    const now = dayLib().tz('America/Fortaleza');
    const totalMinutes = now.hour() * 60;

    const workingDaysWithBookings = await this.processWorkingDay(
      workingDay,
      now,
      totalMinutes,
    );

    return {
      result: workingDaysWithBookings,
    };
  }

  private async processWorkingDay(
    workingDay: IWorkingDay,
    now: Dayjs,
    totalMinutes: number,
  ) {
    let bookings: IBooking[] = [];
    const dayDate = dayLib(workingDay.date);
    const dayDateStartOf = dayDate.startOf('day');
    let workingTime = workingDay.time as unknown as IWorkingTime | null;
    let isClosed = workingDay.isClosed;

    if (isClosed || !workingTime) {
      return { ...workingDay, bookings };
    }

    const isToday = dayDate.isSame(now, 'day');

    totalMinutes = isToday ? totalMinutes : 0;

    bookings = await this.getBookings(workingDay, dayDateStartOf, totalMinutes);

    if (isToday) {
      workingTime = this.updateWorkingTime(workingTime, totalMinutes);
      isClosed = workingTime.end < totalMinutes;
    }

    return {
      ...workingDay,
      time: workingTime,
      isClosed,
      bookings,
    };
  }

  private async getBookings(
    workingDay: any,
    dayDateStartOf: any,
    totalMinutes: number,
  ) {
    const bookingsData = await prismaClient.booking.findMany({
      where: {
        date: dayDateStartOf.toDate(),
        professionalId: workingDay.professionalId,
        status: 'CONFIRMED',
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        client: { select: { name: true } },
        forPersonName: true,
        services: {
          select: { service: { select: { name: true, color: true } } },
          orderBy: { order: 'asc' },
        },
      },
    });

    return bookingsData
      .filter((el) => totalMinutes < el.endTime)
      .map((el) => ({
        id: el.id,
        start: Math.max(totalMinutes, el.startTime),
        end: el.endTime,
        client: el.forPersonName || el.client.name,
        services: el.services.map((srv) => srv.service.name).join(' + '),
        color: el.services[0]?.service.color || '',
      }));
  }

  private updateWorkingTime(
    workingTime: IWorkingTime,
    totalMinutes: number,
  ): IWorkingTime {
    workingTime.start = Math.max(workingTime.start, totalMinutes);

    workingTime.breaks = workingTime.breaks
      .filter((brk) => totalMinutes < brk.end)
      .map((brk) => ({
        start: Math.max(brk.start, totalMinutes),
        end: brk.end,
      }));

    return workingTime;
  }
}
