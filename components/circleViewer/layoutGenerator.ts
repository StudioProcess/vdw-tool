const seedRandom = require("seed-random");

import {ILayoutItem} from "../types";

const divisionSteps = [2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27, 36, 48, 54, 64, 72, 81, 96, 108, 128, 144, 162, 192, 216, 243, 256];
let divisionStep = 8;
let divisionLimit = 18;

function setDivisionStep(s) {
  if (s < 0) {
    s = 0;
  } else if (s > divisionSteps.length - 1) {
    s = divisionSteps.length - 1;
  }
  divisionStep = s;
  divisionLimit = divisionSteps[s];
}

// chances
const cellDivide = 0.5; // divide a cell further?
const cellFill = 0.66; // fill a cell? (vs. leaving it empty)
const cellTwoDivisions = 0.5; // use two divisions? (vs. three)

const skipPartial = true;

let runCount = 0;
let cellCount = 0;
let fillCount = 0;

let baseW = 100;
let baseH = 100;

let halfBaseW = baseW * 0.5;
let halfBaseH = baseH * 0.5;

export default function generateLayout(
  bounds: {width: number, height: number},
  seed = 0,
): ILayoutItem[] {
  const result = [];
  seedRandom(seed, {global: true});

  baseW = Math.round(bounds.width);
  baseH = Math.round(bounds.height);

  halfBaseW = baseW * 0.5;
  halfBaseH = baseH * 0.5;

  runCount = 0;
  cellCount = 0;
  fillCount = 0;

  runOnCell(result, 0, 0, baseW - 1, baseH - 1);

  seedRandom.resetGlobal();
  return result;
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
