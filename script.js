const cardsEl = document.getElementById("cards");
const renderStars = (num) => "⭐".repeat(num);

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

//Dummy-recept (påhittade recept). Array med namnet recipes med alla recept
//recepies är en variabel som innehåller en array (lista). const används då listan inte kommer ändra värden
//Varje receptkort har tre egenskaper "title" "cuisine" och "time"
//Använder det här ssättet då det kommer bli lättare att loopa över listan sen
const recipes = [
  {
    title: "Cheat’s cheesy Focaccia",
    cuisine: "italy",
    diet: "vegetarian",
    time: 40,
    popularity: 1,
    img: "./images/pizza.jpg",
    ingredients: [
      "500 pack bread mix",
      "2tbsp. olive oil, plus a little extra for drizzling",
      "25g parmesan (or vegetarian alternative), grated",
      "75g dolcelatte cheese (or vegetarian alternative)",
    ],
  },
  {
    title: "Burnt-Scallion Fish",
    cuisine: "usa",
    diet: "None",
    popularity: 5,
    time: 25,
    img: "./images/fish.jpg",
    ingredients: [
      "2 bunches scollions",
      "8 tbsp. butter</li",
      "2 8-oz. fish filets",
    ],
  },
  {
    title: "Baked Chicken",
    cuisine: "china",
    diet: "Gluten-free",
    popularity: 5,
    time: 35,
    img: "./images/meat.jpg",
    ingredients: [
      "   6 bone-in chicken breast halves, pr 6 chicken thighs and wings skin-on",
      "1/2 tsp. coarse salt",
      "1/2 tsp. Mrs.Dash seasoning",
      "1/4 tsp. freshly grounded black pepper",
    ],
  },
  {
    title: "Deep Fried Fish Bones",
    cuisine: "South-East Asia",
    diet: "dairy-free",
    popularity: 2,
    time: 10,
    img: "./images/chips.jpg",
    ingredients: ["8 small whiting fish or smelt", "4 cups vegetable oil"],
  },
  {
    title: "Sweet and Sour Tofu",
    cuisine: "china",
    diet: "vegan",
    popularity: 3,
    time: 25,
    img: "./images/tofu.jpg",
    ingredients: [
      "2 cloves of garlic (minced)",
      "1 onion (diced)",
      "2 carrots (sliced)",
      "1 green bell pepper (diced)",
      "a package of tofu",
    ],
  },
  {
    title: "American pancakes",
    cuisine: "usa",
    diet: "gluten-free",
    popularity: 2,
    time: 20,
    img: "./images/pancake.jpg",
    ingredients: [
      "2 1/4 dl gluten-free flour mix",
      "2 tsp baking powder",
      "2 tbsp granulated sugar",
      "2 1/2 dl milk",
      "30 g butter",
    ],
  },
];

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
    list = list.filter((r) => (r.diet || "").toLowerCase() === selectedDiet);
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
    cardsEl.innerHTML = `<p>"No recipes found. Try another filter</p>`;
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

//Funktion som körs när användaren klickar på knappen
const getRandomRecipe = () => {
  //Slumpar fram ett heltal mellan 0 och antal recept – 1.
  const randomIndex = Math.floor(Math.random() * recipes.length);
  //Hämtar det slumpade receptet från listan recipes.
  const recipe = recipes[randomIndex];
  //Gör om receptet till HTML (med hjälp av renderSingleResult) och visar det i sidan, i elementet cardsEl.
  cardsEl.innerHTML = renderSingleResult(recipe);
};
//När användaren klickar på knappen körs getRandomRecipe, och ett nytt slumpat recept visas.
randomButton.addEventListener("click", getRandomRecipe);

//filtrering av land
document
  .getElementById("btn-all")
  .addEventListener("click", () => setCuisine("all"));
document
  .getElementById("btn-italy")
  .addEventListener("click", () => setCuisine("italy"));
document
  .getElementById("btn-usa")
  .addEventListener("click", () => setCuisine("usa"));
document
  .getElementById("btn-china")
  .addEventListener("click", () => setCuisine("china"));

//filtrering av diet
document
  .getElementById("btn-diet-all")
  .addEventListener("click", () => setDiet("diet-all"));
document
  .getElementById("btn-vegan")
  .addEventListener("click", () => setDiet("vegan"));
document
  .getElementById("btn-vegetarian")
  .addEventListener("click", () => setDiet("vegetarian"));
document
  .getElementById("btn-glutenfree")
  .addEventListener("click", () => setDiet("gluten-free"));
document
  .getElementById("btn-dairyfree")
  .addEventListener("click", () => setDiet("dairy-free"));

//Tidsortering
document.getElementById("btn-asc").addEventListener("click", () => {
  selectedSortType = "time";
  setSort("asc");
});
document.getElementById("btn-desc").addEventListener("click", () => {
  selectedSortType = "time";
  setSort("desc");
});

// popularitet-sortering
document.getElementById("btn-mostPopular").addEventListener("click", () => {
  selectedSortType = "popular";
  setPopular("most");
});
document.getElementById("btn-leastPopular").addEventListener("click", () => {
  selectedSortType = "popular";
  setPopular("least");
});

renderResult();

//===Randombutton========================
//document.getElementById("btn-random").addEventListener("click", () => {
//const list = getCurrentList(); // hämta alla recept (med filter/sortering)
//const random = list[Math.floor(Math.random() * list.length)];
// plocka ett slumpat recept ur listan
//cardsEl.innerHTML = renderSingleResult(random);
// visa ENDAST det slumpade receptet
//});

//==============KNAPPARNA======================

const cuisineButtons = document.querySelectorAll(".kitchen");
const sortButtons = document.querySelectorAll(".time");
const dietButtons = document.querySelectorAll(".diet");
const popularButtons = document.querySelectorAll(".popular");

//style för knapparna
cuisineButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    cuisineButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    setCuisine(btn.dataset.cuisine);
  });
});

sortButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sortButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    setSort(btn.dataset.sort);
  });
});

dietButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    dietButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    setDiet(btn.dataset.diet);
  });
});

popularButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    popularButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedSortType = "popular"; // <-- lägg till detta
    setPopular(btn.dataset.popular);
  });
});

// hur funktionerna hänger ihop:
// Användaren klickar på en knapp → setCuisine("italy").
//setCuisine ändrar selectedCuisine → kallar på renderResult.
//renderResult hämtar listan via getCurrentList → bygger upp HTML → visar den.

//En funktion = en uppgift!!!!!!!!!!!

//getCurrentList → ta fram listan.

//renderResult → rita ut listan.

//setCuisine / setSort → uppdatera val.
