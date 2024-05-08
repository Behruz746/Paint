// Global saqlovchilar
const canvesEl = document.querySelector("#point-board"),
  sizeSliderEl = document.querySelector("#size-slider"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColorEl = document.querySelector("#fill-color"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearBtn = document.querySelector(".clear-canvas"),
  saveImgBtn = document.querySelector(".save-img");

// Canves uchun saqlovchilar
let ctx = canvesEl.getContext("2d"),
  isDrowing = false,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#000000",
  prevMouseX,
  prevMouseY,
  snapshot;

// set canvas background color
const setCanvasBackound = () => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvesEl.width, canvesEl.height);
  // ctx.fillStyle = selectColor;
};

// window yuklandanidan song canvesga width va height olchamlarini berish
window.addEventListener("load", () => {
  canvesEl.width = canvesEl.offsetWidth;
  canvesEl.height = canvesEl.offsetHeight;
  setCanvasBackound();
});

// chizish uchun colorlarni olish
const selectColor = (btn) => {
  let myDivObjBgColor = window.getComputedStyle(btn).backgroundColor;
  document.querySelector(".options .selected").classList.remove("selected");
  btn.classList.add("selected");
  selectedColor = myDivObjBgColor;
};

// chizish uchun colorlarni olish input orqali
const selectColorInput = (e) => {
  console.log(colorPicker.value);

  if (colorPicker.value === "#ffffff") {
    colorPicker.parentElement.style.border = "1px solid #bfbfbf";
  } else {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.style.border = "0";
  }

  selectedColor = e.target.value;
};

// mouse down bolgani dan song isDrowing true qiladogan function
const startDrow = (e) => {
  isDrowing = true;
  // mouse positioni olish
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  // stop bolsa chiziq boshqa postiondan boshlanadi
  ctx.beginPath();
  // chiziq qalinligi
  ctx.lineWidth = brushWidth;
  snapshot = ctx.getImageData(0, 0, canvesEl.width, canvesEl.height);
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  console.log(snapshot);
};

// mouse up bolganda isDrowing false boladi va chizish tohtaydi
const stopDrow = () => {
  isDrowing = false;
};

// to'rt burchak chizish
const drowRectangle = (e) => {
  // agar fillColorEl false bolsa unda fill color bo'lmasin strokeRect()
  if (!fillColorEl.checked) {
    ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  } else {
    // agar fillColorEl true bolsa unda fill color bo'lsin fillRect()
    // ctx.fillStyle = "red";
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
};

// doyra chizish
const drowCircle = (e) => {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  if (!fillColorEl.checked) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
};

// uchburchak chizish
const drowTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke();
  if (!fillColorEl.checked) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
};

const drowing = (e) => {
  // agar isDrowing false bolsa hechnarsa qaytarma!
  if (!isDrowing) return;
  // yoki!
  ctx.putImageData(snapshot, 0, 0);
  // to'rt burchak

  switch (selectedTool) {
    case "brush":
      // mouseni X va Y harakat pxlarini berish
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;

    case "rectangle":
      // to'rt burchak chizish
      drowRectangle(e);
      break;

    case "circle":
      // doira chizish
      drowCircle(e);
      break;

    case "triangle":
      // uch burchak chizish
      drowTriangle(e);
      break;

    // uchurg'ich
    case "eraser":
      ctx.strokeStyle = "#ffffff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;

    default:
      break;
  }

  // parametorlar
  console.log(
    `Mouse-X: ${e.offsetX}px,\nMouse-Y: ${e.offsetY}px,\nLine-width: ${brushWidth}px,\nPoint-tool: ${selectedTool},\nFill-color: ${fillColorEl.checked}\nStroke-style: ${selectedColor},\nFill-style: ${selectedColor}`
  );
};

// tool btnlarni active class va remove class qilsh
const activeToolBtns = (btn) => {
  console.log(btn.id);
  document.querySelector(".options .active").classList.remove("active");
  btn.classList.add("active");
  selectedTool = btn.id;
};

const saveImage = () => {
  let canvasUrl = canvesEl.toDataURL("image/jpeg", 1);
  saveImgBtn.href = canvasUrl;
  if (window.navigator.msSaveBlod) {
    window.navigator.msSaveBlod(canvesEl.msSaveBlod(), "canvas-image.png");
  }
};

saveImgBtn.addEventListener("click", saveImage);

// chiziqlarni hammasini ochirish
const clearCanves = () => {
  ctx.clearRect(0, 0, canvesEl.width, canvesEl.height);
  setCanvasBackound();
};

toolBtns.forEach((btn) =>
  btn.addEventListener("click", () => activeToolBtns(btn))
);

// chiziqni width setting qilish
sizeSliderEl.addEventListener("change", (e) => (brushWidth = +e.target.value));
colorBtns.forEach((btn) =>
  btn.addEventListener("click", () => selectColor(btn))
);
colorPicker.addEventListener("input", selectColorInput);
canvesEl.addEventListener("mousedown", startDrow);
canvesEl.addEventListener("mouseup", stopDrow);
// canvesEl.addEventListener("mouseout", stopDrow);
canvesEl.addEventListener("mousemove", drowing);
clearBtn.addEventListener("click", clearCanves);
