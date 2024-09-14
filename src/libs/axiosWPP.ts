import axios from 'axios';

import { env } from '../application/config/env';

const apiUsingNow = axios.create({
  baseURL: env.urlApiWpp,
  timeout: 100000,
});

export const createMessage = async (data: {
  number: string;
  message: string;
}) => {
  await apiUsingNow.post('messages', data);
};

export const verifyNumber = async (number: string) => {
  const reponse = await apiUsingNow.get<{ _serialized: string } | null>(
    `number/${number}`,
  );
  return reponse.data;
};
