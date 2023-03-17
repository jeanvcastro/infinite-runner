import "../sass/index.scss";
import Game from "./game";

const game = new Game("#game");
game.run();

window.onload = () => {
  document.querySelector(".container").classList.remove("loading");
};

console.clear();
console.log("\n\nESTÁ PROCURANDO ALGUMA COISA? 🤔\n\n\n");
