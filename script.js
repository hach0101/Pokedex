let numPokDisp = 0;
// let caughtPokemons = {};
const caughtPokemons = JSON.parse(localStorage.getItem("caughtPokemons")) || {};

const caughtText = document.createElement("p");
// caughtText.textContent = "CAUGHT";
caughtText.classList.add("caught-text");

function loadPokemon() {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${numPokDisp}`)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((pokemon) => {
        fetch(pokemon.url)
          .then((response) => response.json())
          .then((pokeData) => {
            const img = document.createElement("img");
            img.src = pokeData.sprites.other["official-artwork"].front_default;
            img.width = 200;
            img.height = 200;
            img.style.margin = "10px";
            img.classList = "pokeImg";
            const imgDiv = document.createElement("div");
            imgDiv.id = `pokemon-${pokeData.id}`;
            imgDiv.appendChild(img);
            imgDiv.className = "img-class";
            const caughtText = document.createElement("p");
            caughtText.textContent = "CAUGHT";
            caughtText.classList.add("caught-text");
            imgDiv.appendChild(caughtText);

            if (caughtPokemons[pokeData.id]) {
              imgDiv.classList.add("caught");
              caughtText.style.display = "block";
            } else {
              caughtText.style.display = "none";
            }

            img.addEventListener("click", function () {
              displayPopup(pokeData, img, !!caughtPokemons[pokeData.id]);
              caughtClass(pokeData.id);
            });

            const name = document.createElement("p");
            name.textContent = pokeData.name;
            name.classList = "h2 text-center";

            const innerDiv = document.createElement("div");
            innerDiv.appendChild(imgDiv);
            innerDiv.appendChild(name);

            const col = document.createElement("div");
            col.className = "col-md p-3 colHover justify-content-center d-flex";
            col.appendChild(innerDiv);

            document.querySelector("#pokeContainer .row").appendChild(col);
          });
      });
    });
  numPokDisp += 20;
}

function caughtClass(pokemonId) {
  const imgDiv = document.getElementById(`pokemon-${pokemonId}`);
  const caughtText = imgDiv.querySelector(".caught-text");
  if (caughtPokemons[pokemonId]) {
    imgDiv.classList.add("caught");
    caughtText.style.display = "block";
  } else {
    imgDiv.classList.remove("caught");
    caughtText.style.display = "none";
  }
}

function displayPopup(pokeData, imgElement, isCaught) {
  console.log("Is Pokemon caught:", isCaught);
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  const popup = document.createElement("div");
  popup.className = "popup img-class";

  const img = document.createElement("img");
  img.src = pokeData.sprites.front_default;
  img.addEventListener("mouseover", function () {
    img.src = pokeData.sprites.back_default;
    img.addEventListener("mouseout", function () {
      img.src = pokeData.sprites.front_default;
    });
  });
  img.width = 200;
  img.height = 200;
  popup.appendChild(img);

  const name = document.createElement("h2");
  name.textContent = pokeData.name;
  name.classList = "text-center";
  popup.appendChild(name);

  const height = document.createElement("p");
  height.textContent = `Height: ${pokeData.height}`;
  popup.appendChild(height);

  const weight = document.createElement("p");
  weight.textContent = `Weight: ${pokeData.weight}`;
  popup.appendChild(weight);

  const abilities = document.createElement("p");
  abilities.textContent = `Abilities: ${pokeData.abilities
    .map((ability) => ability.ability.name)
    .join(", ")}`;
  popup.appendChild(abilities);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const exitButton = document.createElement("button");
  exitButton.textContent = "Close";
  exitButton.classList = "button-paper m-1";
  exitButton.addEventListener("click", function () {
    document.body.removeChild(popup);
    document.body.removeChild(overlay);
  });
  buttonContainer.appendChild(exitButton);

  const catchButton = document.createElement("button");
  // catchButton.textContent = isCaught ? "Release" : "Catch";
  if (isCaught) {
    catchButton.textContent = "Release";
    catchButton.classList = "bg-danger";
  } else {
    catchButton.textContent = "Catch";
    catchButton.classList = "bg-success";
  }
  catchButton.className = "catch-button button-paper m-1";

  catchButton.addEventListener("click", function () {
    if (caughtPokemons[pokeData.id]) {
      delete caughtPokemons[pokeData.id];
      catchButton.textContent = "Catch";
      // caughtText.style.display = "none";
      // catchButton.classList.remove("button-caught");
      // catchButton.classList.add("button-released");
    } else {
      caughtPokemons[pokeData.id] = true;
      catchButton.textContent = "Release";
      catchButton.classList = "bg-danger";
      // caughtText.style.display = "block";
      // catchButton.classList.remove("button-released");
      // catchButton.classList.add("button-caught");
    }
    caughtClass(pokeData.id);
    localStorage.setItem("caughtPokemons", JSON.stringify(caughtPokemons));
    console.log("Caught Pokemons:", caughtPokemons);
    document.body.removeChild(popup);
    document.body.removeChild(overlay);
  });

  buttonContainer.appendChild(catchButton);
  popup.appendChild(buttonContainer);

  document.body.appendChild(popup);
}

loadPokemon();
document.getElementById("loadMore").addEventListener("click", loadPokemon);
