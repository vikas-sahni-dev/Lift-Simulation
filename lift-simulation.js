const backButton = document.querySelector(".back-button-container img");
const liftSimulationContainer = document.querySelector(
  ".lift-simulation-container"
);
const floorInput = Number(
  new URLSearchParams(window.location.search).get("floor")
);
const liftInput = Number(
  new URLSearchParams(window.location.search).get("lift")
);
let styleElement = document.createElement("style");
document.head.appendChild(styleElement);

//crating dynamic floors
let floorNumber = 0;
for (let i = 1; i <= floorInput; i++) {
  const oneFloor = document.createElement("div");
  oneFloor.classList.add("one-floor");
  oneFloor.classList.add(`${i}`);
  oneFloor.innerHTML = `
  
    <div class="floor-number-and-controls-container">
      <div>Floor&nbsp;<span  class="floor-count">${++floorNumber}</span></div>
      <div class="controls-container">
        <span class="up control-btn">Up</span>
        <span class="down control-btn">Down</span>
      </div>
    </div>
    <div class="lift-container">
    </div>
  

  `;
  
  const controlButtons = oneFloor.querySelectorAll(".control-btn");
 
  
  controlButtons.forEach((controlButton) => {
    controlButton.addEventListener("click", () => {
      const floorNumber = oneFloor.querySelector(".floor-count").innerText;

      moveLift(floorNumber);
    });
  });
  liftSimulationContainer.appendChild(oneFloor);
}

const firstFloor = document.querySelector(".one-floor");
firstFloor.classList.add("floor-1");
const liftContainerOfFirstFloor = firstFloor.querySelector(".lift-container");

//creating dynamic lifts
for (let i = 1; i <= liftInput; i++) {
  liftContainerOfFirstFloor.innerHTML += `
      <div class="lift ${i}">
        <div>
          <div class="lift-doors">
            <div class="left-door-lift"></div>
            <div class="right-door-lift"></div>
          </div>
        </div>
      </div>
  `;
}

function handlingOverflowingLiftsInFirstFloor() {
  const firstFloorWidth = firstFloor.offsetWidth;

  const oneLiftWidth = firstFloor.querySelector(".lift").offsetWidth;

  const controlsWidth = firstFloor.querySelector(
    ".floor-number-and-controls-container"
  ).offsetWidth;

  if (firstFloorWidth < (oneLiftWidth + 16) * liftInput + controlsWidth) {
    liftSimulationContainer.classList.add("show-overflow-lifts");
  }
  let liftContainerWidthOfFirstFloor =
    firstFloor.querySelector(".lift-container").offsetWidth;
  increaseFloorWidth(liftContainerWidthOfFirstFloor + controlsWidth);
}

function increaseFloorWidth(width) {
  const allFloors = document.querySelectorAll(".one-floor");
  allFloors.forEach((floor) => {
    floor.style.width = `${width}px`;
  });
}

//remove extra control button on  first floor and last button
const firstFloorDownButton = firstFloor.querySelector(".down");
const lastFloor = document.querySelectorAll(".one-floor");
const lastFloorUpButton = lastFloor[lastFloor.length - 1].querySelector(".up");
lastFloorUpButton.remove();
firstFloorDownButton.remove();
const allLifts = document.querySelectorAll(".lift");

function selectLift() {
  let availableLift = "";
  for (const lift of allLifts) {
    if (!lift.classList.contains("lift-is-moving-now")) {
      availableLift = lift;
      break;
    }
  }
  return availableLift;
}

let liftMovingAnimationCSSCount = 0;
let allLiftCurrentposition = [...allLifts].map((lift) => 0);


function moveLift(floorNumber) {
  const lift = selectLift();
  if (!lift) {
    return;
  }

  const liftNumber = lift.classList[1];
  lift.classList.add("lift-is-moving-now");
  lift.classList.remove("lift-open");
  let liftMoveDistance = +floorNumber * 100 - 100;
  styleElement.innerHTML += `
  @keyframes moveLift${++liftMovingAnimationCSSCount} {
   0% {
      bottom:${allLiftCurrentposition[liftNumber - 1]}px;
   }
  
   100% {
      bottom:${liftMoveDistance}px
   }
  }
  `;
  lift.style.animation = "none";
  lift.offsetHeight;

  let animationTime = String(
    liftMoveDistance - allLiftCurrentposition[liftNumber - 1]
  );
  let extraZero = animationTime.slice(-2);
  console.log(extraZero);

  animationTime = animationTime.replaceAll(extraZero, "");
  animationTime = Math.abs(animationTime) * 2;
  console.log(animationTime);

  lift.style.animation = `moveLift${liftMovingAnimationCSSCount} ${animationTime}s ease-in-out forwards`;
  console.log(lift.style.animation);

  lift.addEventListener(
    "animationend",
    () => {
      allLiftCurrentposition[liftNumber - 1] = liftMoveDistance;
      lift.classList.add("lift-open");
      setTimeout(() => {
        lift.classList.remove("lift-is-moving-now");
        lift.classList.remove("lift-open");
      }, 5000);
    },
    { once: true }
  );
}

handlingOverflowingLiftsInFirstFloor();
backButton.addEventListener("click", () => {
  history.back();
});
