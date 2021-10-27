import { UAParser } from 'ua-parser-js';
const parser = new UAParser();

export const browserData = parser.getResult();
