const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;

let carWidth = 70;
let carHeight = 100;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const nLanes = 3;
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, nLanes);

const car = generateCars(1, "AI", 4)[0];
const keyCar = generateCars(1, "KEYS", 4)[0];
let bestBrain = car;

car.brain = {
   levels: [
      {
         inputs: [
            0.7606851643002227, 0.746262434157909, 0.6902309347967898,
            0.16530226162458872, 0, 0, 0, 0.33630972481632715,
            0.7442336281057809, 0.7605447774935772,
         ],
         outputs: [0, 1, 0, 1, 1, 1],
         biases: [
            0.01653163608389091, 0.043283932640606454, -0.012726969056123968,
            0.03929504555152133, -0.041079973330178966, -0.10600362514543904,
         ],
         weights: [
            [
               -0.02777663393208832, 0.041034188223528015, -0.10381803652354833,
               0.12340733592409817, 0.03834287007791186, -0.045983213084497536,
            ],
            [
               -0.030032839011689405, -0.010493888998465293,
               0.030837843666421526, 0.09405296138674739, 0.05596057312823187,
               0.05877580801197767,
            ],
            [
               0.04254775170621399, 0.020498133803819308, 0.061843303298425585,
               0.02363496044811704, 0.013936220190150974, 0.03382518993048924,
            ],
            [
               -0.010294270403514707, 0.005425231218738194, 0.09841881693159352,
               -0.02686725772490912, -0.01446051172487465, 0.012913077153879614,
            ],
            [
               0.021581186610217233, -0.0656867456632832, 0.1352065911079851,
               -0.05543839828939101, 0.048120207214511775, 0.028847136715842398,
            ],
            [
               0.0063928033718285175, -0.04089754843526677,
               0.027201054143129916, -0.018335928831631883, 0.07279969098746433,
               0.028206487481855256,
            ],
            [
               0.024273137170389175, -0.07137591163144826,
               -0.039018636090058595, 0.09650767491032008, 0.009611339300149804,
               -0.0006917527776560293,
            ],
            [
               -0.03612558771900479, 0.04167664469563938, -0.011384680535967856,
               -0.04468558884116707, 0.07239323479415834, 0.058620431587252886,
            ],
            [
               -0.034686170996355896, 0.027627326122769715,
               -0.04719128996802851, 0.08061323235577986, 0.07401538550217043,
               -0.006006374898458433,
            ],
            [
               -0.026876005195815785, 0.02841109588802567, -0.06542580550817038,
               -0.049257229837508444, 0.031033647620335857, 0.03314873718640675,
            ],
         ],
      },
      {
         inputs: [0, 1, 0, 1, 1, 1],
         outputs: [1, 0, 0, 0],
         biases: [
            -0.013209063019054751, 0.027770322073340827, 0.09118554447278834,
            0.005691478149763725,
         ],
         weights: [
            [
               0.014279144845918997, 0.006625003859894096,
               -0.035191484673489065, 0.06176520152132538,
            ],
            [
               -0.04850971268588458, -0.04890103948026694,
               -0.019440216682246648, 0.014696331762315148,
            ],
            [
               0.015290662548022495, -0.0613709375365824, 0.12370272057602362,
               -0.03177131601671183,
            ],
            [
               0.05222145167936909, 0.10987849328032137, 0.01566727836311904,
               -0.008584784539637683,
            ],
            [
               -0.009690969602085112, -0.047930443633613214,
               -0.024280330786281994, -0.1426295396859826,
            ],
            [
               0.05466526454919886, -0.017462740763841016, 0.07010777064100705,
               -0.026078004595869578,
            ],
         ],
      },
   ],
};

let traffic = [
   new Car(road.getLaneCenter(1), -100, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(0), -300, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(1), -300, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(2), -600, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(0), -600, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(3), -900, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(1), -1200, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(2), -1200, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(2), -1500, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(1), -1800, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(0), -2100, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(2), -2100, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(0), -2400, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(1), -2400, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(1), -2700, carWidth, carHeight, "DUMMY", 2),
   new Car(road.getLaneCenter(2), -2700, carWidth, carHeight, "DUMMY", 2),
];
let nWaves = 150;
createWaves(nWaves);

function generateUniqueNumbers(n) {
   const arr = [];
   while (arr.length < n) {
      let rand = Math.round(Math.random() * (nLanes - 1));
      while (arr.includes(rand)) {
         rand = Math.round(Math.random() * (nLanes - 1));
      }
      arr.push(rand);
   }
   return arr;
}

function createWaves(nWaves) {
   let distance = traffic.length > 0 ? -traffic[traffic.length - 1].y : 0;
   let minCars = 0.9;
   for (let i = 0; i < nWaves; i++) {
      let maxCars = 2;
      if (i % 7 == 0) {
         minCars += 0.1;
      }
      if (minCars > 1.5) {
         minCars = 2;
      }
      const nCars = Math.round(minCars + Math.random() * (maxCars - minCars));
      const lanes = generateUniqueNumbers(nCars);
      distance = distance + 300 + Math.random() * 50;
      for (let j = 0; j < nCars; j++) {
         const speed = 2;
         const addY = Math.random() * 40 - 20;
         const addCarWidth = Math.random() * 20 - 6;
         const addCarHeight = Math.random() * 26 - 13;
         traffic.push(
            new Car(
               road.getLaneCenter(lanes[j]),
               -distance + addY,
               carWidth + addCarWidth,
               carHeight + addCarHeight,
               "DUMMY",
               speed
            )
         );
      }
   }
   for (let j = 0; j < 3; j++) {
      const speed = 2;
      traffic.push(
         new Car(
            road.getLaneCenter(j),
            -distance - 300,
            carWidth,
            carHeight,
            "DUMMY",
            speed
         )
      );
   }
}

animate();

function save() {
   localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
   localStorage.removeItem("bestBrain");
}

function moveLeft() {
   if (keyCar.speed != 0) {
      const flip = keyCar.speed > 0 ? 1 : -1;
      keyCar.angle += 0.03 * flip;
      if (Math.abs(keyCar.speed) < 1) {
         keyCar.angle -=
            (flip * 0.003 * (keyCar.maxSpeed - keyCar.speed)) /
            (Math.abs(keyCar.speed) > 0.4 ? 7 : 6);
      }
   }
}
function moveRight() {
   if (keyCar.speed != 0) {
      const flip = keyCar.speed > 0 ? 1 : -1;
      keyCar.angle -= 0.03 * flip;
      if (Math.abs(keyCar.speed) < 1) {
         keyCar.angle +=
            (flip * 0.003 * (keyCar.maxSpeed - keyCar.speed)) /
            (Math.abs(keyCar.speed) > 0.4 ? 7 : 6);
      }
   }
}

function generateCars(N, type, topSpeed) {
   let cars = [];
   let height = carHeight;
   let width = carWidth;
   if (type !== "DUMMY") {
      height = carHeight - 22;
      width = carWidth - 15;
   }
   for (let i = 1; i <= N; i++) {
      cars.push(
         new Car(road.getLaneCenter(1), 100, width, height, type, topSpeed)
      );
   }
   return cars;
}

let c = 0;
function animate() {
   for (let i = 0; i < traffic.length; i++) {
      traffic[i].update(road.borders, []);
   }

   if (keyCar.damaged && c == 0) {
      setTimeout(() => window.location.reload(), 2000);
      c++;
   }

   document.addEventListener("touchstart", (e) => {
      if (e.targetTouches[0].clientX > window.innerWidth / 2) {
         keyCar.controls.right = true;
      } else {
         keyCar.controls.left = true;
      }
   });

   document.addEventListener("touchend", (e) => {
      keyCar.controls.right = false;
      keyCar.controls.left = false;
   });

   if (keyCar.y < 0) car.update(road.borders, traffic);
   keyCar.update(road.borders, traffic);

   carCanvas.height = window.innerHeight;
   networkCanvas.height = window.innerHeight;

   bestCar = car.y > keyCar.y ? keyCar : car;

   carCtx.save();
   carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

   road.draw(carCtx);

   for (let i = 0; i < traffic.length; i++) {
      traffic[i].draw(carCtx);
   }

   car.draw(carCtx);
   keyCar.draw(carCtx);

   carCtx.restore();

   Visualizer.drawNetwork(networkCtx, car.brain);
   requestAnimationFrame(animate);
}
