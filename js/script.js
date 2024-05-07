// Global saqlovchilar
const canvesEl = document.querySelector("#point-board"),
  sizeSliderEl = document.querySelector("#size-slider"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColorEl = document.querySelector("#fill-color");

// Canves uchun saqlovchilar
let ctx = canvesEl.getContext("2d"),
  isDrowing = false,
  brushWidth = 5,
  selectedTool = "brush",
  prevMouseX,
  prevMouseY,
  snapshot;

// window yuklandanidan song canvesga width va height olchamlarini berish
window.addEventListener("load", () => {
  canvesEl.width = canvesEl.offsetWidth;
  canvesEl.height = canvesEl.offsetHeight;
});

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
    ctx.fillStyle = "red";
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
    ctx.fillStyle = "red";
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
    ctx.fillStyle = "red";
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

    default:
      break;
  }

  // chiziqni rangi
  ctx.strokeStyle = "red";
  // parametorlar
  console.log(
    `Mouse-X: ${e.offsetX}px,\nMouse-Y: ${e.offsetY}px,\nLine-width: ${brushWidth}px,\nPoint-tool: ${selectedTool},\nFill-color: ${fillColorEl.checked}`
  );
};

// tool btnlarni active class va remove class qilsh
const activeToolBtns = (btn) => {
  console.log(btn.id);
  document.querySelector(".options .active").classList.remove("active");
  btn.classList.add("active");
  selectedTool = btn.id;
};

toolBtns.forEach((btn) =>
  btn.addEventListener("click", () => activeToolBtns(btn))
);
// chiziqni width setting qilish
sizeSliderEl.addEventListener("change", (e) => (brushWidth = +e.target.value));
canvesEl.addEventListener("mousedown", startDrow);
canvesEl.addEventListener("mouseup", stopDrow);
canvesEl.addEventListener("mousemove", drowing);
