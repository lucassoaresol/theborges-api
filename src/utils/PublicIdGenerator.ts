import { AppError } from '../application/errors/appError';
import { prismaClient } from '../libs/prismaClient';

export class PublicIdGenerator {
  async generate(modelName: 'client' | 'booking'): Promise<string> {
    const allowedCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Gera um comprimento aleatório entre 3 e 5
      const length = Math.floor(Math.random() * 3) + 3; // Resultado será 3, 4 ou 5

      let publicId = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
          Math.random() * allowedCharacters.length,
        );
        publicId += allowedCharacters[randomIndex];
      }

      let existingId;

      if (modelName === 'client') {
        existingId = await prismaClient.client.findUnique({
          where: { publicId },
        });
      } else if (modelName === 'booking') {
        existingId = await prismaClient.booking.findUnique({
          where: { publicId },
        });
      }

      if (!existingId) {
        return publicId;
      }
    }

    throw new AppError(
      'Não foi possível gerar um ID único após várias tentativas',
    );
  }
}
