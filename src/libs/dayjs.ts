import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import isBetween from 'dayjs/plugin/isBetween.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday.js';

const dayLib = dayjs;

dayLib.locale('pt-br');
dayLib.extend(isBetween);
dayLib.extend(localizedFormat);
dayLib.extend(minMax);
dayLib.extend(relativeTime);
dayLib.extend(timezone);
dayLib.extend(utc)
dayLib.extend(weekday);

export default dayLib;
