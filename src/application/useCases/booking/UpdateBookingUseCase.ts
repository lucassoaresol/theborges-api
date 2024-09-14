import { Dayjs } from 'dayjs';

import { createMessage } from '../../../libs/axiosWPP';
import dayLib from '../../../libs/dayjs';
import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  bookingId: number;
  forPersonName: string | undefined;
  status: 'CANCELLED' | 'COMPLETED' | undefined;
}

type IOutput = void;

export class UpdateBookingUseCase {
  constructor(private readonly templateName: string) {}

  async execute({
    bookingId,
    forPersonName,
    status,
  }: IInput): Promise<IOutput> {
    const booking = await prismaClient.booking.update({
      where: { id: bookingId },
      data: {
        forPersonName,
        status,
      },
      select: {
        date: true,
        startTime: true,
        client: { select: { email: true, name: true } },
      },
    });

    if (status === 'CANCELLED') {
      const startDateTime = dayLib(booking.date)
        .startOf('day')
        .add(booking.startTime, 'm');
      const customerName = this.capitalizeFirstName(booking.client.name.trim());
      const formattedDate = this.getFormattedDate(startDateTime);

      const message = await this.generateDbMsg(customerName, formattedDate);

      await createMessage({ message, number: booking.client.email });
    }
  }

  private capitalizeFirstName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .shift() as string;
  }

  private getFormattedDate(startDateTime: Dayjs): string {
    const now = dayLib().tz('America/Fortaleza');

    if (startDateTime.isSame(now, 'day')) {
      return `hoje às ${startDateTime.format('HH:mm')}`;
    } else if (startDateTime.isSame(now.add(1, 'day'), 'day')) {
      return `amanhã às ${startDateTime.format('HH:mm')}`;
    } else if (startDateTime.diff(now, 'day') <= 6) {
      return `${startDateTime.format('dddd')} às ${startDateTime.format('HH:mm')}`;
    } else {
      return `${startDateTime.format('DD/MM/YYYY')} às ${startDateTime.format('HH:mm')}`;
    }
  }

  private async generateDbMsg(
    customerName: string,
    formattedDate: string,
  ): Promise<string> {
    const objFormat = {
      nome_cliente: customerName,
      data: formattedDate,
    };

    let template = '';

    const resultTemplate = await prismaClient.messageTemplate.findUnique({
      where: { name: this.templateName },
    });

    if (resultTemplate) {
      template = resultTemplate.body.replace(
        /{(\w+)}/g,
        (_, match: keyof typeof objFormat) => {
          return objFormat[match] || '';
        },
      );
    }

    return template.replace(/\\n/g, '\n');
  }
}
