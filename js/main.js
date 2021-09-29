
/* ============================================================================================
 *                                                                                             *  
 *   JavaSript File                                                                            *
 *                                                                                             *
 *   Modifications by:  | Alexis Mastrodomenico | Luke McMillan | Gustavo Vas  | Mark Watson | *
 *   1st issue Date:    28 September 2021                                                      *
 *                                                                                             *
 *                                                                                             *
 * =========================================================================================== */

let spoonacularAPI  = "3f02a89ca80e407492794df034986041";

let userIngredient   = document.querySelector("#recipeIngredient");
let recipesFound    = document.querySelector("#theRecipes");
let searchForm      = document.querySelector("#search-form");

let recipeList    = document.createElement( "DIV" );
let table         = document.createElement( "TABLE" );
let tableBody     = document.createElement( "TBODY" );


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
            alert("I can't find that ingredient, check your spelling or possibly I just don't have data for that ingredient.");
          } 
    });
};

/* =========================================================================================== */

function listMe( recipes ) {




  for ( let i = 0; i <= recipes.results.length-1; i++ ){

    console.log(recipes.results[i].title);

    let recipeItem  = document.createElement("div");

    recipeItem.classList    = "w3-btn w3-large w3-dark-grey w3-hover-light-grey w3-col w3-s10";
    recipeItem.setAttribute( "id", "recipe" + i );
    recipeItem.textContent = recipes.results[i].title;
    recipesFound.prepend(recipeItem); 



  }
}



/* =========================================================================================== */


searchForm.addEventListener('submit', handleIngredientEntered);


/* ============================================================================================ 
   ============================================================================================ */ 