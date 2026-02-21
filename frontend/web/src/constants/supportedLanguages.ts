import * as EnglishFlag from '@assets/english-flag.svg';
import * as PolishFlag from '@assets/polish-flag.svg';
import { ESupportedLanguages } from '@shared/constants/enums';

export const supportedLanguages = Object.values(ESupportedLanguages);

export const supportedLanguagesObj = {
  [ESupportedLanguages.PL]: {
    id: 'language-pl',
    iconPath: PolishFlag,
    label: 'pl'
  },
  [ESupportedLanguages.EN]: {
    id: 'language-en',
    iconPath: EnglishFlag,
    label: 'en'
  }
};
