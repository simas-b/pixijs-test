const overlay = document.querySelector("#dialog-overlay") as HTMLElement;
const closeButton = document.querySelector("#close-button") as HTMLElement;
const dialogText = document.querySelector("#dialog-text") as HTMLElement;
const dialogCard = document.querySelector(
  "#dialog-overlay .card"
) as HTMLElement;

closeButton.addEventListener("click", () => {
  overlay.style.display = "none";
});

const backgrounds = {
  purple:
    "radial-gradient(circle, rgba(150,54,120,0.9) 0%, rgba(83,24,64,0.9) 100%)",
  orange:
    "radial-gradient(circle, rgba(181,98,0,0.9) 0%, rgba(122,66,0,0.9) 100%)",
  green:
    "radial-gradient(circle, rgba(88,140,62,0.9) 0%, rgba(47,70,36,0.9) 100%)",
  blue: "radial-gradient(circle, rgba(53,73,172,0.9) 0%, rgba(19,27,68,0.9) 100%)",
};

export default function showDialog(
  text: string,
  background: "green" | "blue" | "purple" | "orange"
) {
  dialogText.innerText = text;
  dialogCard.style.background = backgrounds[background];
  overlay.style.display = "flex";
}
