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
const aQuote = document.getElementById("quote-me");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const slider = document.getElementById("recipeRange");
const output = document.getElementById("recipeCount");
const modalFilter = document.getElementById("userPref");

let storedPreferences = JSON.parse(localStorage.getItem("preferences"));

let ingredient = [];
let userPref = [];
let userPrefIntol = [];
let ingredients, keyIngredient, recipeNumber;

quoteGenerator();


/* ============================================================================================= */

function openModal(event) {
  event.preventDefault();
  storedPrefs();

  keyIngredient = userIngredient.value;
  console.log("keyIngredient = " + keyIngredient);
  document.getElementById("userPref").style.display = "block";
}


function userPrefModalClosed() {
  mealResults.style.display = "none";
  document.getElementById("userPref").style.display = "none";
  getTodaysRecipe(keyIngredient);
}


output.innerHTML = slider.value; // Display the default slider value

slider.value = userPref[3];

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML =  this.value;
  recipeNumber = this.value;

  userPref[3] = recipeNumber;
  localStorage.setItem("preferences", JSON.stringify(userPref));
}

// allows you to close modal by clicking off to side of modal window,
// alternative to using the close button.
window.onclick = function( event ) {
  if (event.target === modalFilter) {
    modalFilter.style.display = "none";
    userPrefModalClosed( );
  }
}

/* =========================================================================================== */ 

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
        
        let userID = intol.split('-')[0];  // extract 1st part of string - the ID name.

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
  userPref[3] = 50;
  
  localStorage.setItem("preferences", JSON.stringify(userPref)); 
}

/* == Fetch data ================================================================================= */

function getTodaysRecipe(ingredientProvided) {
  let mealType, intolerances, diet;
  
  if (userPref[0] === null){ 
    mealType = "";
  } if (userPref[0] === "mealALL"){
    mealType = "";
  } else {
    mealType = userPref[0];
    mealType = mealType.slice(4,mealType.length);  //remove 'meal' from string.
    mealType = mealType.toLowerCase();
    console.log("user preference passed into URL = " + mealType)
  }
  
  if (userPref[1] === null){ 
    mealType = "";
  } if (userPref[1] === "dietNoDietary"){
    mealType = "";
  } else {
    diet = userPref[1];
    diet = diet.slice(4,diet.length)
    diet = diet.toLowerCase();
    console.log("user diet pref passed into URL = " + diet)
  }

  if( userPref[2]!== null ){ 
    intolerances="";
    userPref[2].forEach(function selectedIntol(intol){  
      if ((intol !=="")&&(intol.split('-').pop() === "true")){

        let intolType = intol.split('-')[0] + ",";
        intolType = intolType.slice(5, intolType.length);
        intolType = intolType.toLowerCase();
        
        intolerances += intolType;
        }
      })
      intolerances = intolerances.slice(0, intolerances.length-1) // remove last comma.
  } 
  
  console.log("user intolerance pref passed into URL = " + intolerances);

  if (recipeNumber===null || recipeNumber === undefined ){ recipeNumber = 50;}

  console.log("recipes to find = " + recipeNumber)

  let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${ingredientProvided}
  &number=${recipeNumber}&type=${mealType}&intolerances=${intolerances}&diet=${diet}&apiKey=${spoonacularAPI}`;

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response
        .json()

        .then(function (data) {
          console.log(data);
          listMe(data);

          if (data.results.length === 0) {
      
            console.log("nothing found");

            mealResults.style.display = "block";
            let html = "";
            html = "Sorry, I couldn't find a meal for you.<br />Please try again";
            mealList.classList.add("notFound");
            mealList.innerHTML = html;
          }
        });
      console.log("ingredientProvided = " + ingredientProvided);
    } else {
      let html = "";
      html = "There's a problem with your search, please try again.";
      mealList.classList.add("notFound");
      mealList.innerHTML = html;
    }
  });
}

/* =========================================================================================== */

function quoteGenerator(){

  setInterval(function quoteMe(){
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
  .then(response => {
  if (response.ok) {
    response
      .json()

      .then(function (data) {
        aQuote.innerText = `" ${data.text} "`;
      });
    }
  })
}, 8000);
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
