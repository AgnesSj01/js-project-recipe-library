const cardsEl = document.getElementById("cards");
const API_KEY = "023721190a824bc5b967171438a1f9af";
const renderStars = (num) => "⭐".repeat(num);
const showAllButton = document.getElementById("btn-show-all");
const CACHE_KEY = "recipesCache"; // namn på lagringen
const CACHE_TIME = 6 * 60 * 60 * 1000; // giltig i 6 timmar
const RANDOM_URL = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`;

//Använder let istället för const för att värdena kommer att ändras.
//skapar en variabel som heter "selectedCuisine"
// variabeln innehåller just nu värdet "all", detta betyder att alla recept visas
let selectedCuisine = "all";
//Skapar en variabel som heter selectedSort
// Variabeln innehåller nu värder "asc" som betyder att just nu sorterar vi i stigande ordning
let selectedSort = "asc";

let selectedDiet = "diet-all";

let selectedPopular = "most";

let selectedSortType = "time";

let searchQuery = ""; // vad användaren har skrivit i sökrutan

const recipes = []; // tom array som fylls med API-data

//=======FUNKTIONER FÖR ATT ÄNDRA VAL, SÄGER ÅT SIDAN ATT RITAS OM ====================

//Tar emot parametern c som ståf för cuisine och s för sort. Uppdaterar variabeln selectedCuisine pch selectedSort med det värdet
//Denna funktion gör att selectedCuisines uppdateras och inte bara står på all och asc
const setCuisine = (c) => {
  selectedCuisine = c; //sparar valet
  renderResult(); //När filtret uppdateras körs denna funktion
};

const setSort = (s) => {
  selectedSort = s; //sparar valet
  renderResult();
};

const setDiet = (d) => {
  selectedDiet = d;
  renderResult();
};

const setPopular = (p) => {
  selectedPopular = p;
  renderResult();
};

//==================FUNKTION FÖR ATT HÄMTA RÄTT RECEPTLISTA=================

//Skapar en funktion som heter get getcurrentlist
const getCurrentList = () => {
  let list; //tom variabel skapas. Här lagras alla recept som ska visas

  if (selectedCuisine === "all") {
    list = recipes.slice(); //kopia på hela listan. Använder den inbyggda metoden slice som finns för arrayer och stängar.
  } else {
    //filter är en metod som går igenom alla recept på listan
    list = recipes.filter((r) => r.cuisine === selectedCuisine);
  }

  if (selectedDiet !== "diet-all") {
    list = list.filter((r) => {
      const d = (r.diet || "").toLowerCase();
      return d === selectedDiet;
    });
  }
  const query = searchQuery.trim().toLowerCase();
  if (query) {
    list = list.filter((r) => {
      const inTitle = (r.title || "").toLowerCase().includes(query);
      const inIngredients = (r.ingredients || []).some((i) =>
        (i || "").toLowerCase().includes(query)
      );
      return inTitle || inIngredients;
    });
  }

  //Sortera
  if (selectedSortType === "time") {
    if (selectedSort === "asc") {
      list.sort((a, b) => a.time - b.time); //Sort är en innbyggd metod för arrayer. list.sort används, list innehåller recepten från recipies sedan tidigare
    } else {
      list.sort((a, b) => b.time - a.time); // långsammast först
    }
  } else if (selectedSortType === "popular") {
    if (selectedPopular === "most") {
      list.sort((a, b) => b.popularity - a.popularity);
    } else {
      list.sort((a, b) => a.popularity - b.popularity);
    }
  }
  return list;
};

//==========FUNKTION FÖR ATT SKRIVA UT RECEPTEN PÅ SIDAN====================

const renderResult = () => {
  const list = getCurrentList(); //Kallar på funktionen pickRecipe

  if (list.length === 0) {
    cardsEl.innerHTML = `<p>No recipes found. Try another filter</p>`;
    return;
  }

  let html = ""; //Bygger ihop html koden för alla recept
  list.forEach((r) => {
    //list= listan på recept från currentlist. forEach (gå igenom varje recept på listan)
    const cuisineText = r.cuisine[0].toUpperCase() + r.cuisine.slice(1);
    const timeText = r.time + " minutes"; //konstanta variabler skapas
    const dietText = r.diet;
    const popularText = renderStars(r.popularity);
    const ingHtml = r.ingredients.map((i) => `<li>${i}</li>`).join(""); //Här görs igridienslistan om från array till html

    html += `
      <article class="recipe">
        <img src="${r.img}" alt="${r.title}" />
        <h3 class="title">${r.title}</h3>
        <div class="meta">
          <p><strong>Cuisine:</strong> <span class="cuisine">${cuisineText}</span></p>
          <p><strong>Diet:</strong> <span>${dietText}</span></p>
          <p><strong>Popularity:</strong>${popularText}</span></p>
          <p><strong>Time:</strong> <span>${timeText}</span></p>
        </div>
        <h4>Ingredients</h4>
        <ul>${ingHtml}</ul>
      </article>
    `;
  });

  cardsEl.innerHTML = html;
};

//=============Random funktion===============

//En funktion som tar in ett objekt (r)
const renderSingleResult = (r) => {
  //Ser till att första bokstaven är stor
  const cuisineText = r.cuisine[0].toUpperCase() + r.cuisine.slice(1);
  const timeText = r.time + " minutes"; //konstanta variabler skapas.. En visningstext för minuter
  const dietText = r.diet || "-"; // om diet finns skrivs den ut annars "-"
  const popularText = renderStars(r.popularity);
  const ingHtml = r.ingredients.map((i) => `<li>${i}</li>`).join(""); //Här görs igridienslistan om från array till html

  //Här byggs en receptkort bild. Stoppar in variabler i html
  return `
       <article class="recipe">
      <img src="${r.img}" alt="${r.title}" />
      <h3 class="title">${r.title}</h3>
      <div class="meta">
        <p><strong>Cuisine:</strong> <span class="cuisine">${cuisineText}</span></p>
        <p><strong>Diet:</strong> <span>${dietText}</span></p>
        <p><strong>Popularity:</strong>${popularText}</p>
        <p><strong>Time:</strong> <span>${timeText}</span></p>
      </div>
      <h4>Ingredients</h4>
      <ul>${ingHtml}</ul>
    </article>
  `;
};
//Knappen för slumpartad recept
const randomButton = document.getElementById("btn-random");

// Den här funktionen tar emot ett recept från Spoonaculars API (som har ett eget format)
// och gör om det till samma struktur som mina gamla "låtsasrecept".
// På så sätt kan jag återanvända all min gamla kod (renderResult, filter, sortering osv.)
// utan att behöva ändra något.
// Funktionen plockar ut titel, bild, tid, diet, ingredienser och popularitet
// och ser till att alltid ha ett värde även om något saknas.
const mapApiRecipe = (r) => ({
  title: r.title || "Untitled",
  cuisine: (r.cuisines?.[0] || "unknown").toLowerCase(),
  diet: (r.diets?.[0] || "none").toLowerCase(),
  popularity: Math.max(
    1,
    Math.min(5, Math.round((r.aggregateLikes || 0) / 100))
  ),
  time: r.readyInMinutes || 0,
  img: r.image || "https://via.placeholder.com/600x400?text=No+image",
  ingredients: (r.extendedIngredients || []).map(
    (i) => i.original || i.name || ""
  ),
});

//När vi klickar på randomknappen
randomButton.addEventListener("click", () => {
  const list = getCurrentList();
  if (!list.length) {
    cardsEl.innerHTML = "<p>No recipes to randomize. Adjust the filters!</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  const recipe = list[randomIndex];
  cardsEl.innerHTML = renderSingleResult(recipe);

  // visa knappen efter random

  showAllButton.style.display = "inline-block";
});

// Visa alla: rendera listan igen + dölj knappen
showAllButton.addEventListener("click", () => {
  renderResult();
  showAllButton.style.display = "none";
});

//Försöker hämta cache först
const fetchRecipes = async () => {
  cardsEl.innerHTML = "<p>Fetching recipes…</p>";

  // 1) Försök cache först
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const saved = JSON.parse(cached);
    const tooOld = Date.now() - saved.timestamp > CACHE_TIME;
    if (!tooOld) {
      cardsEl.innerHTML = "<p>Showing recipes from cache</p>";
      recipes.length = 0;
      recipes.push(...saved.items);
      renderResult();
      return;
    }
  }

  // 2) Hämta via RANDOM (GARANTERAR extendedIngredients)
  try {
    const res = await fetch(RANDOM_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));

    const json = await res.json();
    const mapped = (json.recipes || []).map(mapApiRecipe);

    // Debug: se att vi verkligen har ingredienser
    console.log("Första receptet:", mapped[0]);
    console.log("Mapped ingredients count:", mapped[0]?.ingredients?.length);

    recipes.length = 0;
    recipes.push(...mapped);
    renderResult();

    // 3) Spara i localStorage
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), items: mapped })
    );
  } catch (error) {
    console.error("Fetch error:", error);
    let message;
    switch (error.message) {
      case "401":
        message = "<p>Invalid or missing API key (401).</p>";
        break;
      case "402":
      case "429":
        message = `
          <p>You have reached your daily API quota or are rate-limited (402/429).</p>
          <p>Try again tomorrow, reduce requests, or use cached data.</p>
        `;
        break;
      default:
        message =
          "<p>Could not fetch recipes right now. Please try again later.</p>";
    }
    cardsEl.innerHTML = message;
  }
};

// Dropdown: cuisine
document.getElementById("cuisine").addEventListener("change", (e) => {
  setCuisine(e.target.value); // uppdaterar state
  renderResult(); // rita om listan (eller hämta från API om du vill)
});

// Dropdown: diet
document.getElementById("diet").addEventListener("change", (e) => {
  setDiet(e.target.value);
  renderResult();
});

// Dropdown: sort by time
document.getElementById("sortTime").addEventListener("change", (e) => {
  selectedSortType = "time";
  setSort(e.target.value); // "asc" eller "desc"
});

// Dropdown: sort by popularity
document.getElementById("sortPop").addEventListener("change", (e) => {
  selectedSortType = "popular";
  setPopular(e.target.value); // "most" eller "least"
});
document.getElementById("btn-show-all").addEventListener("click", () => {
  renderResult();
});
document.getElementById("search").addEventListener("input", (e) => {
  searchQuery = e.target.value; // uppdatera state
  renderResult(); // rita om listan
});

//En funktion = en uppgift!!!!!!!!!!!

// Se till att dropdowns visar dina startvärden
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cuisine").value = selectedCuisine; // "all"
  document.getElementById("diet").value = selectedDiet; // "diet-all"
  document.getElementById("sortTime").value = selectedSort; // "asc"
  document.getElementById("sortPop").value = selectedPopular; // "most"
  fetchRecipes();
});

//Extra Comments on code
//getCurrentList → ta fram listan.

//renderResult → rita ut listan.
