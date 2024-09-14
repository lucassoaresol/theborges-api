import { JsonValue } from '@prisma/client/runtime/library';
import { Dayjs } from 'dayjs';

import dayLib from '../../../libs/dayjs';
import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  date: string | undefined;
  professionalId: number | undefined;
  isAuth: boolean;
}

interface IOutput {
  result: IResult[];
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

export class ListWorkingDayUseCase {
  async execute({ date, professionalId, isAuth }: IInput): Promise<IOutput> {
    const filterConditions = this.buildFilterConditions(date, professionalId);

    const workingDays = await prismaClient.workingDay.findMany({
      where: filterConditions,
      orderBy: { date: 'asc' },
    });

    const now = dayLib();
    const totalMinutes = now.hour() * 60;

    const workingDaysWithBookings = await Promise.all(
      workingDays.map((workingDay) =>
        this.processWorkingDay(workingDay, now, totalMinutes, isAuth),
      ),
    );

    return {
      result: workingDaysWithBookings,
    };
  }

  private buildFilterConditions(date?: string, professionalId?: number) {
    const filterConditions: any = {};
    if (date) {
      const startDate = dayLib(date).startOf('month').toDate();
      const endDate = dayLib(date).endOf('month').toDate();
      filterConditions.date = { gte: startDate, lte: endDate };
    }

    if (professionalId) {
      filterConditions.professionalId = professionalId;
    }

    return filterConditions;
  }

  private async processWorkingDay(
    workingDay: IWorkingDay,
    now: Dayjs,
    totalMinutes: number,
    isAuth: boolean,
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

    bookings = isAuth
      ? await this.getBookings(workingDay, dayDateStartOf, totalMinutes)
      : [];

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
    workingDay: IWorkingDay,
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
