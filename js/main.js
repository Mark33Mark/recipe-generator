
/* ============================================================================================
 *                                                                                             *  
 *   JavaSript File                                                                            *
 *                                                                                             *
 *   Modifications by:  | Alexis Mastrodomenico | Luke McMillan | Gustavo Vas  | Mark Watson | *
 *   1st issue Date:    28 September 2021                                                      *
 *                                                                                             *
 *                                                                                             *
 * =========================================================================================== */

const spoonacularAPI  = "3f02a89ca80e407492794df034986041";

const userIngredient  = document.querySelector("#recipeIngredient");
const recipesFound    = document.querySelector("#theRecipes");
const searchForm      = document.querySelector("#search-form");
const mealList        = document.getElementById("meal");
const recipeContent   = document.querySelector(".recipe-content");
const recipeCloseBtn  = document.getElementById("recipe-close-btn");

let ingredient      = [];
let userPref        = [];
let ingredients;


/* ============================================================================================= */


function handleIngredientEntered( event ) {

    event.preventDefault();  

    let keyIngredient = userIngredient.value; 

    getTodaysRecipe( keyIngredient );
    console.log( keyIngredient );

    }


/* == Fetch data ================================================================================= */ 
  
function getTodaysRecipe ( ingredientProvided ) {

  let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${ingredientProvided}&apiKey=${spoonacularAPI}`;

  fetch( apiURL )

    .then(function ( response ) {
      if ( response.ok ) {
        response.json()

        .then(function ( data ) {

            console.log( data );
            listMe( data );

          }); console.log(ingredientProvided);
          } else {
            let html = "";
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
            mealList.innerHTML = html;
          } 
    });
};

/* =========================================================================================== */

function listMe( recipes ) {

  let html = "";

  recipes.results.forEach( function (result){

    console.log(result);

    html += `
        <div class = "w3-card-4 w3-margin w3-center" style="flex: 0 1 30%; width:50%;" data-id = "${result.id}">
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
});
mealList.classList.remove('notFound');

}

/* =========================================================================================== */

function getMealRecipe( event ){

  event.preventDefault();
  
  if( event.target.classList.contains("recipe-btn")){

      let recipeItem = event.target.parentElement.parentElement;

      console.log(recipeItem.dataset.id);
      
      fetch(`https://api.spoonacular.com/recipes/${recipeItem.dataset.id}/information?query=includeNutrition=true&apiKey=${spoonacularAPI}`)
        .then(response => response.json())
        .then(data => mealRecipeModal( data ));
  }
}


function mealRecipeModal( meal ){
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
      recipeContent.parentElement.classList.add('showRecipe');
}


/* == Events ==================================================================================== */

searchForm.addEventListener('submit', handleIngredientEntered);

mealList.addEventListener('click', getMealRecipe);

recipeCloseBtn.addEventListener('click', () => {
  recipeContent.parentElement.classList.remove('showRecipe');
});


/* ============================================================================================ 
   ============================================================================================ */ 