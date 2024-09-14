import dayLib from '../../../libs/dayjs';
import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  date: string;
  isClosed: boolean;
  time:
    | {
        start: number;
        end: number;
      }[]
    | undefined;
}

type IOutput = void;

export class CreateHolidayExceptionUseCase {
  async execute({ date, isClosed, time }: IInput): Promise<IOutput> {
    await prismaClient.holidayException.create({
      data: {
        date: dayLib(date).startOf('day').toDate(),
        isClosed,
        time,
      },
    });
  }
}
