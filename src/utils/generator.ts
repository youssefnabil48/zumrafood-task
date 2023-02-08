import * as crypto from 'crypto';

export const generateMixedCaseToken = (charactersCount: number, chars?: string): string => {
  const characters = chars || 'abcdefghjmnpqrstuwxyzABCDEFGHJMNPQRSTUWXYZ123456789';
  const rnd = crypto.randomBytes(charactersCount);
  const value = new Array(charactersCount);
  const len = Math.min(256, characters.length);
  const d = 256 / len;
  for (let i = 0; i < charactersCount; i++) {
    // @ts-ignore
    value[i] = characters[Math.floor(rnd[i] / d)];
  }
  return value.join('');
};

export const generateMixedCaseTokenArray = (arrLength: number, charactersCount: number, chars?: string): Array<string> => {
  return [...Array(arrLength)].map(() => {
    return generateMixedCaseToken(charactersCount, chars);
  });
};
