import assert from "node:assert/strict";

import { spellOut } from "./spell-out";

const env = process.env;
const language =
  (env.LANG ?? env.LANGUAGE ?? env.LC_ALL ?? env.LC_MESSAGES)?.split(".")[0].replace("_", "-") ?? "en_US";

const formatter = new Intl.NumberFormat(language);

const SMALL_NUMBERS_TESTS: [number, string][] = [
  [0, "zero"],
  [7, "siedem"],
  [12, "dwanaście"],
  [46, "czterdzieści sześć"],
  [1024, "jeden tysiąc dwadzieścia cztery"],
  [2159, "dwa tysiące sto pięćdziesiąt dziewięć"],
  [5000, "pięć tysięcy"],
  [14_231, "czternaście tysięcy dwieście trzydzieści jeden"],
  [70_000, "siedemdziesiąt tysięcy"],
  [117_965, "sto siedemnaście tysięcy dziewięćset sześćdziesiąt pięć"],
];

const BIG_NUMBERS_TESTS: [number, string][] = [
  [123_456_789, "sto dwadzieścia trzy miliony czterysta pięćdziesiąt sześć tysięcy siedemset osiemdziesiąt dziewięć"],
  [200_000_000_000, "dwieście miliardów"],
  [370_000_000_000, "trzysta siedemdziesiąt miliardów"],
  [418_000_000_000_000, "czterysta osiemnaście biliardów"],
];

describe("Spell Out", () => {
  describe("handle small numbers", () => {
    SMALL_NUMBERS_TESTS.forEach(([amount, expectedSpelledOut]) => {
      it(`should return "${expectedSpelledOut}" when passed amount is ${formatter.format(amount)}`, () => {
        assert.equal(spellOut(amount), expectedSpelledOut);
      });
    });
  });

  describe("handle big numbers", () => {
    BIG_NUMBERS_TESTS.forEach(([amount, expectedSpelledOut]) => {
      it(`should return "${expectedSpelledOut}" when passed amount is ${formatter.format(amount)}`, () => {
        assert.equal(spellOut(amount), expectedSpelledOut);
      });
    });
  });

  it("should render fraction representation", () => {
    assert.equal(spellOut(14, { includeFraction: true }), "czternaście 00/100");
    assert.equal(spellOut(173.513, { includeFraction: true }), "sto siedemdziesiąt trzy 51/100");
    assert.equal(spellOut(173.517, { includeFraction: true }), "sto siedemdziesiąt trzy 52/100");
  });

  it("should render negative amount", () => {
    assert.equal(spellOut(-13), "minus trzynaście");
    assert.equal(spellOut(-1073), "minus jeden tysiąc siedemdziesiąt trzy");
  });
});
