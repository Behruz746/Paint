const canvesEl = document.querySelector("#point-board"),
  sizeSliderEl = document.querySelector("#size-slider");

let ctx = canvesEl.getContext("2d"),
  isDrowing = false,
  brushWidth = 5;
// window yuklandanidan song canvesga width va height olchamlarini berish
window.addEventListener("load", () => {
  canvesEl.width = canvesEl.offsetWidth;
  canvesEl.height = canvesEl.offsetHeight;
});

// mouse down bolgani dan song isDrowing true qiladogan function
const startDrow = () => {
  isDrowing = true;
  // stop bolsa chiziq boshqa postiondan boshlanadi
  ctx.beginPath();
  // chiziq qalinligi
  ctx.lineWidth = brushWidth;
};

// mouse up bolganda isDrowing false boladi va chizish tohtaydi
const stopDrow = () => {
  isDrowing = false;
};

const drowing = (e) => {
  // agar isDrowing false bolsa hechnarsa qaytarma!
  if (!isDrowing) return;
  // yoki!
  // mouseni X va Y harakat pxlarini berish
  ctx.lineTo(e.offsetX, e.offsetY);

  // chiziqni rangi
  ctx.strokeStyle = "red";
  // chiziqni chizish
  ctx.stroke();
  console.log(
    `Mouse-X: ${e.offsetX}px,\nMouse-Y: ${e.offsetY}px,\nLine-width: ${brushWidth}px`
  );
};

// chiziqni width setting qilish
sizeSliderEl.addEventListener("input", (e) => {
  brushWidth = +e.target.value;
  console.log(`Line-width: ${brushWidth}px`);
});
canvesEl.addEventListener("mousedown", startDrow);
canvesEl.addEventListener("mouseup", stopDrow);
canvesEl.addEventListener("mousemove", drowing);
