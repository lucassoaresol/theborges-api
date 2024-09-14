import { verifyNumber } from '../../../libs/axiosWPP';
import { AppError } from '../../errors/appError';

interface IInput {
  phone: string;
}

type IOutput = void;

export class VerifyPhoneUseCase {
  async execute({ phone }: IInput): Promise<IOutput> {
    const resultPhone = await verifyNumber(phone);

    if (!resultPhone) {
      throw new AppError('');
    }
  }
}
