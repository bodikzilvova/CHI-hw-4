
let currentPage = 1;
let isLoading = false;

const getData = async () => {
  if (isLoading) return;
  isLoading = true;

  const url = `https://rickandmortyapi.com/api/character?page=${currentPage}`;
  const charactersDiv = document.getElementById("characters");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    displayCharacters(data.results);
    currentPage++;
  } catch (error) {
    console.error(error.message);
  } finally {
    isLoading = false;
  }
};

const displayCharacters = (characters) => {
  const charactersDiv = document.getElementById("characters");

  characters.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("p-4", "border", "rounded-2xl", "m-5", "text-center", "cursor-pointer");
    characterCard.innerHTML = `
      <img class="mb-2" src="${character.image}" width="200px" height="200px" alt="Character image" />
      <p>Name: ${character.name}</p>
      <p>Status: ${character.status}</p>
    `;

    characterCard.addEventListener("click", (event) => {
      event.stopPropagation();
      openModal(character.id);
    });

    charactersDiv.appendChild(characterCard);
  });
};

const openModal = async (characterId) => {
  const url = `https://rickandmortyapi.com/api/character/${characterId}`;
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  try {
    const response = await fetch(url);
    const character = await response.json();
    modalContent.innerHTML = `
      <img class="mb-4" src="${character.image}" width="300px" alt="Character image" />
      <p>Name: ${character.name}</p>
      <p>Status: ${character.status}</p>
    `;
    modal.classList.remove("hidden");
  } catch (error) {
    console.error("Failed to load character data:", error);
  }
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
};

document.getElementById("modal").addEventListener("click", (event) => {
  if (event.target.id === "modal") closeModal();
});

document.getElementById("closeModal").addEventListener("click", closeModal);

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 200
  ) {
    getData();
  }
});
getData();