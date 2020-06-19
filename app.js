// Define our constants
const search = document.getElementById ('search');
const submit = document.getElementById ('submit');
const random = document.getElementById ('random');
const mealsEl = document.getElementById ('meals');
const resultsHeading = document.getElementById ('results');
const singleMealEl = document.getElementById ('single-meal');
const resultsOnload = document.getElementById ('resultsOnload');

// Different Functions for our Event Listeners
// function search Meal and fetch from API
function searchMeal (e) {
  e.preventDefault ();

  // Clear single meal
  singleMealEl.innerHTML = '';

  // Get the search meal and get the meal from the api
  const meal = search.value;

  // get the meal list from the api and check if there search meal exists in the DB
  if (meal.trim ()) {
    fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
      .then (res => res.json ())
      .then (data => {
        console.log (data);
        resultsHeading.innerHTML = `
        <h2>Search Results for <span>'${meal}'</span>:</h2>`;

        if (data.meals === null) {
          resultsHeading.innerHTML = `<p>There are no search results. Try again</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map (
              repas => `
                        <div class="meal">
                            <img src="${repas.strMealThumb}" alt="${repas.strMeal}">
                            <div class="meal-info" data-mealId="${repas.idMeal}">
                                <h3>${repas.strMeal}</h3>
                            </div>
                        </div>`
            )
            .join ('');
        }
      });
    //Clear search Text
    search.value = '';
  } else {
    resultsHeading.innerHTML =
      '<p class="heading">Your search Field is empty</p>';
    mealsEl = '';
  }
}

// Get meal By Id
function getMealById (mealID) {
  fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then (res => res.json ())
    .then (data => {
      const meal = data.meals[0];

      addMealToDOM (meal);
    });
}

// Add Meal to DOM
function addMealToDOM (meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push (
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div >
            <div class="name">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients
                      .map (ingredient => `<li>${ingredient}</li>`)
                      .join ('')}
                </ul>
            </div>
        </div >
        `;
}

// get meal Info
function getMealInfo (e) {
  const mealInfo = e.path.find (item => {
    if (item.classList) {
      return item.classList.contains ('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealId = mealInfo.getAttribute ('data-mealid');

    getMealById (mealId);
  }
}

// fetch random Meal from the api
function getRandomMeal () {
  // clear meals and heading
  mealsEl.innerHTML = '';
  resultsHeading.innerHTML = '';

  fetch (`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then (res => res.json ())
    .then (data => {
      const meal = data.meals[0];

      addMealToDOM (meal);
    });
}

// Event Listener for what we search

submit.addEventListener ('submit', searchMeal);

mealsEl.addEventListener ('click', getMealInfo);

random.addEventListener ('click', getRandomMeal);
