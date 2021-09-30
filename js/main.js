/* ============================================================================================
 *                                                                                             *
 *   JavaSript File                                                                            *
 *                                                                                             *
 *   Modifications by:  | Alexis Mastrodomenico | Luke McMillan | Gustavo Vas  | Mark Watson | *
 *   1st issue Date:    28 September 2021                                                      *
 *                                                                                             *
 *                                                                                             *
 * =========================================================================================== */

const spoonacularAPI = "3f02a89ca80e407492794df034986041";

const userIngredient = document.querySelector("#recipeIngredient");
const recipesFound = document.querySelector("#theRecipes");
const searchForm = document.querySelector("#search-form");
const recipeContent = document.querySelector(".recipe-content");
const mealResults = document.querySelector(".meal-result");
const mealList = document.getElementById("meal");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

let storedPreferences = JSON.parse(localStorage.getItem("preferences"));

let ingredient = [];
let userPref = [];
let userPrefIntol = [];
let ingredients, keyIngredient;

/* ============================================================================================= */

function openModal(event) {
  event.preventDefault();
  storedPrefs();

  keyIngredient = userIngredient.value;
  console.log("keyIngredient = " + keyIngredient);
  document.getElementById("userPref").style.display = "block";
}

function userPrefModalClosed() {
  document.getElementById("userPref").style.display = "none";
  getTodaysRecipe(keyIngredient);
}


/* ====================================================================================== */ 

function storedPrefs (){

  storedPreferences = JSON.parse(localStorage.getItem("preferences"));

  if (storedPreferences !== null) {  
    userPref = storedPreferences;

    if( userPref[0]!== null ){ 
      document.getElementById( userPref[0] ).checked      = true;
    } else {
      document.getElementById( "mealAll" ).checked        = true;
    }

    if( userPref[1]!== null ){ 
      document.getElementById ( userPref[1] ).checked     = true;
    } else {
      document.getElementById( "dietNoDietary" ).checked   = true;
    }

    if( userPref[2]!== null ){ 
      userPref[2].forEach(function populateIntol(intol, index){
        
        let userID = intol.split('-')[0];

        if ( intol.split('-').pop() === "true" ){

          document.getElementById( userID ).checked      = true;
      }
    })

    } else {
      document.getElementById( "intolNone" ).checked       = true;
    }
  } else { 
    createDefaultUserPref ();
  }
}

/* ====================================================================================== */ 

function createDefaultUserPref (){

  userPref[0] = "mealAll";
  document.getElementById( "mealAll" ).checked           = true;
  userPref[1] = "dietNoDietary";
  document.getElementById( "dietNoDietary" ).checked     = true;
  userPref[2] = ["","","","","","","","","","","","","intolNone-true"];
  document.getElementById( "intolNone" ).checked         = true;
  
  localStorage.setItem("preferences", JSON.stringify(userPref)); 
}

/* ====================================================================================== */ 

/* == Fetch data ================================================================================= */

function getTodaysRecipe(ingredientProvided) {
  let mealType = "";
  let intolerances = "";
  let diet = "";
  let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${ingredientProvided}
  &number=100&type=${mealType}&intolerances=${intolerances}&diet=${diet}&apiKey=${spoonacularAPI}`;

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response
        .json()

        .then(function (data) {
          console.log(data);
          listMe(data);
        });
      console.log("ingredientProvided = " + ingredientProvided);
    } else {
      let html = "";
      html = "Sorry, we didn't find any meal!";
      mealList.classList.add("notFound");
      mealList.innerHTML = html;
    }
  });
}

/* =========================================================================================== */

function listMe(recipes) {
  let html = "";

  recipes.results.forEach(function (result) {
    console.log(result);

    html += `
        <div class = "w3-card-4 w3-margin w3-center recipe-card" style="flex: 0 1 30%; width:50%;" data-id = "${result.id}">
            <div class = "meal-img">
                <img src = "${result.image}" alt = "food">
            </div>
            <div class = "meal-name">
                <h3>${result.title}</h3>
                <a href = "#" class = "recipe-btn">Get Recipe</a>
            </div>
        </div>
    `;
    mealList.innerHTML = html;
    mealResults.style.display = "block";
  });
  mealList.classList.remove("notFound");
}

/* =========================================================================================== */

function getMealRecipe(event) {
  event.preventDefault();

  if (event.target.classList.contains("recipe-btn")) {
    let recipeItem = event.target.parentElement.parentElement;

    console.log(recipeItem.dataset.id);

    fetch(
      `https://api.spoonacular.com/recipes/${recipeItem.dataset.id}/information?query=includeNutrition=true&apiKey=${spoonacularAPI}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data));
  }
}

function mealRecipeModal(meal) {
  console.log(meal);

  let html = `
      <h2 class = "recipe-title">${meal.title}</h2>
      <div class = "recipe-summary">
          <h3>Recipe idea:</h3>
          <p>${meal.summary}</p>
      </div>
      <div class = "recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.instructions}</p>
      </div>
      <div class = "recipe-meal-img">
          <img src = "${meal.image}" alt = "">
      </div> `;
  recipeContent.innerHTML = html;
  recipeContent.parentElement.classList.add("showRecipe");
}

/* == Events ==================================================================================== */

searchForm.addEventListener("submit", openModal);

mealList.addEventListener("click", getMealRecipe);

recipeCloseBtn.addEventListener("click", () => {
  recipeContent.parentElement.classList.remove("showRecipe");
});

/* == User Preference Events ============================================================ */

function userMealPref(clicked_object) {
  userPref[0] = clicked_object.id;
  localStorage.setItem("preferences", JSON.stringify(userPref));
  return;
}

function userDietaryPref(clicked_object) {
  userPref[1] = clicked_object.id;
  localStorage.setItem("preferences", JSON.stringify(userPref));
  return;
}


function userIntolPref(clicked_object) {

  // userPref[2] = clicked_object.id;

  let userIntolerances = document.getElementsByName("intolerances");
  userPrefIntol.splice(0,13);
  userPref[2] = userPrefIntol;  
  localStorage.setItem("preferences", JSON.stringify(userPref));

  userIntolerances.forEach( function recordIntolerances(intol, index){
    userPrefIntol.push(intol.id +"-"+ intol.checked, );
  })

  userPref[2] = userPrefIntol;  
  localStorage.setItem("preferences", JSON.stringify(userPref));
  delete userPrefIntol;
}

/* ============================================================================================ 
   ============================================================================================ */
