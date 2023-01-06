import pl from "./pl-PL.json";

const LOCALE = "pl-PL";

const UNITS = [undefined, pl.one, pl.two, pl.thee, pl.four, pl.five, pl.six, pl.seven, pl.eight, pl.nine];

const TEENS = [
  pl.ten,
  pl.eleven,
  pl.twelve,
  pl.thirteen,
  pl.fourteen,
  pl.fifteen,
  pl.sixteen,
  pl.seventeen,
  pl.eighteen,
  pl.nineteen,
];

const TENS = [
  undefined,
  undefined,
  pl.twenty,
  pl.thirty,
  pl.forty,
  pl.fifty,
  pl.sixty,
  pl.seventy,
  pl.eighty,
  pl.ninety,
];

const HUNDREDS = [
  undefined,
  pl["one hundred"],
  pl["two hundred"],
  pl["three hundred"],
  pl["four hundred"],
  pl["five hundred"],
  pl["six hundred"],
  pl["seven hundred"],
  pl["eight hundred"],
  pl["nine hundred"],
];

const GROUP_SUFFIXES = [undefined, pl.thousand, pl.million, pl.billion, pl.trillion];

const getGroupSpellParts = (threeDigits: number): (string | undefined)[] => {
  if (threeDigits > 999) {
    throw new Error("Number is out if range, should be three digit number.");
  }

  const hundreds = Math.trunc((threeDigits % 1000) / 100);
  const tens = threeDigits % 100;

  if (tens > 10 && tens < 20) {
    return [HUNDREDS[hundreds], TEENS[Math.floor(tens % 10)]];
  } else {
    return [HUNDREDS[hundreds], TENS[Math.floor(tens / 10)], UNITS[Math.floor(tens % 10)]];
  }
};

const getGroupSuffix = (threeDigits: number, groupIndex: number) => {
  if (threeDigits === 0) {
    return undefined;
  }
  const suffix = GROUP_SUFFIXES[groupIndex];
  if (suffix == null) {
    return undefined;
  }

  return threeDigits === 1
    ? suffix.one
    : (threeDigits < 10 || threeDigits > 20) && [2, 3, 4].includes(threeDigits % 10)
    ? suffix.few
    : suffix.many;
};

export type SpellOutOpts = {
  includeFraction: boolean;
};

export const locale = LOCALE;

export const spellOut = (amount: number, { includeFraction = false }: Partial<SpellOutOpts> = {}): string => {
  if (amount === 0) {
    return pl.zero;
  }

  const digitString = Math.abs(Math.trunc(amount)).toString();

  const length = digitString.length;
  const groups = Math.ceil(length / 3);
  const chunks = [];

  if (amount < 0) {
    chunks.push(pl.negative);
  }

  if (groups > GROUP_SUFFIXES.length) {
    throw new Error(`"Numbers bigger than 1e+${GROUP_SUFFIXES.length * 3 + 1} are not supported"`);
  }

  for (let i = groups - 1; i >= 0; i--) {
    const offset = i * 3;
    const group = parseInt(digitString.substring(length - (offset + 3), length - offset));

    chunks.push(...getGroupSpellParts(group), getGroupSuffix(group, i));
  }

  if (includeFraction) {
    const fraction = Math.round((amount % 1) * 100)
      .toString()
      .padStart(2, "0");

    chunks.push(`${fraction}/100`);
  }

  return chunks.filter((chunk) => chunk != null).join(" ");
};
