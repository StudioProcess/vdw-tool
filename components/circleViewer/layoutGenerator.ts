import {ILayoutGeneratorCongfig} from "../types";
const seedRandom = require("seed-random");

import {ILayoutItem} from "../types";

const divisionSteps = [2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27, 36, 48, 54, 64, 72, 81, 96, 108, 128, 144, 162, 192, 216, 243, 256];
const minFilled = 1; // minimum number of filled elements

let divisionStep = 6;
// chances
let cellDivide = 0.4; // divide a cell further?
let cellFill = 0.7; // fill a cell? (vs. leaving it empty)
let cellTwoDivisions = 0.5; // use two divisions? (vs. three)


let divisionLimit = divisionSteps[divisionStep]; // init divisionLimit from step
function setDivisionStep(s) {
  if (s < 0) {
    s = 0;
  } else if (s > divisionSteps.length - 1) {
    s = divisionSteps.length - 1;
  }
  divisionStep = s;
  divisionLimit = divisionSteps[s];
}

let skipPartial = true;

let runCount = 0;
// @ts-ignore
let cellCount = 0;
// @ts-ignore
let fillCount = 0;

let baseW = 100;
let baseH = 100;

let halfBaseW = baseW * 0.5;
let halfBaseH = baseH * 0.5;

export function generateLayout(
  bounds: {width: number, height: number},
  seed = 0,
): ILayoutItem[] {
  let result = [];
  seedRandom(seed, {global: true});

  baseW = Math.floor(bounds.width);
  baseH = Math.floor(bounds.height);

  halfBaseW = baseW * 0.5;
  halfBaseH = baseH * 0.5;
  
  fillCount = 0;
  while (fillCount < minFilled) {
    result = [];
    runCount = 0;
    cellCount = 0;
    fillCount = 0;
    runOnCell(result, 0, 0, baseW - 1, baseH - 1);
  }
  console.log(`LAYOUT ${seed} fillCount=${fillCount}`);
  seedRandom.resetGlobal();

  return result;
}

export function updateConfig(config: ILayoutGeneratorCongfig) {
  setDivisionStep(config.divisionStep);
  cellDivide = config.cellDivide;
  cellFill = config.cellFill;
  cellTwoDivisions = config.cellTwoDivisions;
  skipPartial = !config.showPartial;
}

export function runOnCell(
  positionArray: ILayoutItem[],
  left: number,
  top: number,
  width: number,
  height: number,
  depth = 0,
) {
  runCount++;
  // logd(`running on ${Math.floor(left)}, ${Math.floor(top)}, ${Math.floor(width)}, ${Math.floor(height) }`, depth);

  const divs = decide(cellTwoDivisions) ? 2 : 3; // number of divisions
  const canDivide = Math.ceil(width / divs) >= Math.floor(baseW / divisionLimit);
  let shouldDivide = decide(cellDivide);
  if (runCount === 1) { shouldDivide = true; }

  if (canDivide && shouldDivide) { // recur
    // logd("-> divide by " + divs, depth);
    const a = width / divs; // side length of new cell
    for (let j = 0; j < Math.ceil(height / a); j++) {
      for (let i = 0; i < divs; i++) {
        runOnCell(positionArray, left + i * a, top + j * a, a, a, depth + 1);
      }
    }
  } else {
    const shouldFill = decide(cellFill);
    if (skipPartial) {
      if (left + width > baseW || top + height > baseH) {
        return;
      }
    }
    cellCount++;
    if (shouldFill) {
      // logd("-> fill", depth);
      fillCount++;

      const radius = width * 0.5;

      positionArray.push({
        x: (left + radius) - halfBaseW,
        y: (top + radius) - halfBaseH,
        radius,
      });

      // if (showBalls) {
        // fill(c);
        // noStroke();
        // ellipseMode(CORNER);
        // ellipse(left, top, width, width);
      // }
      // if (showGridFilled) {
      //   noFill();
      //   stroke(c);
      //   rect(left, top, width, height)
      // }
    } else {
      // logd("-> leave empty", depth);
      // if (showGridEmpty) {
      //   noFill();
      //   stroke(c);
      //   rect(left, top, width, height)
      // }
    }
  }
}

export function decide(
  chance = 0.5,
) {
  return Math.random() < chance;
}
