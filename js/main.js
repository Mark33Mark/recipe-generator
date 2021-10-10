/* ============================================================================================
 *                                                                                             *
 *   JavaSript File                                                                            *
 *                                                                                             *
 *   Modifications by:  | Alexis Mastrodomenico | Luke McMillan | Gustavo Vas  | Mark Watson | *
 *   1st issue Date:    28 September 2021                                                      *
 *                                                                                             *
 *                                                                                             *
 * =========================================================================================== */


 const spoonacularAPI = "3f02a89ca80e407492794df034986041"; // mark@watsonised.com
// const spoonacularAPI = "0f8b03de54ab4bab815f3490682e4182";  // mark.watsonised@gmail.com
// const spoonacularAPI = "919b3550399d4761aced47f4afec99ca"


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
const ingredientList = document.getElementById("ingredients");

let storedPreferences = JSON.parse(localStorage.getItem("preferences"));

let ingredient = [];
let userPref = [];
let userPrefIntol = [];
let ingredients, keyIngredient, recipeNumber, selectRecipe;

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
  
  console.log("recipes to find = " + recipeNumber);


  let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=${ingredientProvided}
  &number=${recipeNumber}&type=${mealType}&intolerances=${intolerances}&diet=${diet}&apiKey=${spoonacularAPI}`;

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
      response.json()

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

// Running this once to avoid delay from the setInterval for the 1st run.
// User should see a quote as quickly as possible from opening the page.

fetch("https://uselessfacts.jsph.pl/random.json?language=en")  
  .then(response => {
  if (response.ok) {
    response
      .json()

      .then(function (data) {
        let html = `<blockquote class="w3-animate-fading">${data.text}</blockquote>`;
        aQuote.innerHTML = html;
      });
    }
  });

  setInterval(function (){
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
  .then(response => {
  if (response.ok) {
    response
      .json()

      .then(function (data) {
        let html = `<blockquote class="w3-animate-fading">${data.text}</blockquote>`;
        aQuote.innerHTML = html;
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
        <div class = "w3-card-4 w3-margin w3-center recipe-card" style="flex: 0 1 30%; width:50%; border-radius: 20px;" data-id = "${result.id}">
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

  mealResults.style.display = "none";
  aQuote.style.display = "none";

  // passing to global variable to build the ingredients list in a separate function.
  selectRecipe = meal;  

  let cuisinesSpaced = selectRecipe.cuisines.toString();
  let cuisinesHyphen = cuisinesSpaced.split(",").join(" - ");

  let winePairMessage;
  if(!selectRecipe.winePairing.pairingText){ 
    winePairMessage = "Sorry, we are unable to recommend a wine for you with this dish."; 
  } else {
    winePairMessage = selectRecipe.winePairing.pairingText;
  }

  let html = `

      <div class = "recipe-meal-img">
        <img src = "${selectRecipe.image}" alt = "" >
      </div>

      <h2 class = "recipe-title">${selectRecipe.title.toUpperCase()}</h2>

      <div class = "recipe-summary">
          <h3>Recipe idea:</h3>
          <h4>Cuisines: ${cuisinesHyphen} </h4>
          <p>${selectRecipe.summary}</p>
      </div>

      <div id="toggleIngredients">

        <button id="ingredients" 
          class="w3-button w3-white w3-border w3-border-blue w3-round-large w3-margin-top w3-margin-bottom"
          onclick = "ingredientsWindow()">
          Ingredients
        </button>

        <button id="shopping-list" 
          class="w3-button w3-border w3-border-blue w3-round-large w3-margin" 
          onclick="copyIngredientsToText()" style="display:none">
          Shopping List (text file)
        </button>
      
        <div class = "recipe-ingredients" style="display:none"></div>  

        <div class = "recipe-instruct" style="display:block">
          <h3>Instructions:</h3>
          <p>${selectRecipe.instructions}</p>
        </div>
      </div>

      <div id="wine-pairing">
        <h3>Wine pairing:</h3>
        <p> ${winePairMessage}</p>
      </div>
      `;

  recipeContent.innerHTML = html;
  recipeContent.parentElement.classList.add("showRecipe");  
}

/* == Ingredients window ======================================================================== */

function ingredientsWindow(){

  const ingredientsToggle = document.getElementById("toggleIngredients");

  if (ingredientsToggle.children[2].style.display === "none") {
    
    ingredientsToggle.children[0].style.display = "inline-block";
    ingredientsToggle.children[0].style.backgroundColor = "rgb(202, 146, 101)";
    ingredientsToggle.children[0].style.color = "rgb(255, 255, 255)";
    ingredientsToggle.children[1].style.display = "inline-block";
    ingredientsToggle.children[1].style.backgroundColor = "rgb(202, 146, 101)";
    ingredientsToggle.children[2].style.display = "block";
    ingredientsToggle.children[3].style.display = "none";
    ingredientsToggle.style.backgroundColor = "white";
    document.getElementById("wine-pairing").style.display = "none";
    document.getElementById("ingredients").innerHTML="Instructions";
    
    let html = "";
    for (let i = 0; i < selectRecipe.extendedIngredients.length; i++){
      if(selectRecipe.extendedIngredients[i].image===null){
        html += `
        <div class = "w3-padding">
        <table class="w3-table-all">
          <tr>
            <td style = "width:6.5rem;"><img src="./img/noImagePlaceholder.jpg" /></td>
            <td style = "vertical-align:middle;"><div class="w3-left-align necessary-ingredient">${selectRecipe.extendedIngredients[i].originalString}</div></td>
          </tr>
        </table>
        </div>`;
        ingredientsToggle.children[2].innerHTML = html;
      } else {
        html += `
            <div class = "w3-padding">
              <table class="w3-table-all">
                <tr>
                  <td style = "width:6.5rem;"><img src="https://spoonacular.com/cdn/ingredients_100x100/${selectRecipe.extendedIngredients[i].image}"/></td>
                  <td style = "vertical-align:middle;"><div class="w3-left-align necessary-ingredient">${selectRecipe.extendedIngredients[i].originalString}</div></td>
                </tr>
              </table>
            </div>`;
        ingredientsToggle.children[2].innerHTML = html;
      }
    }
   
  } else {
    ingredientsToggle.children[0].style.display = "inline-block";
    ingredientsToggle.children[0].style.backgroundColor = "rgb(255, 255, 255)";
    ingredientsToggle.children[0].style.color = "rgb(0, 0, 0)";
    ingredientsToggle.children[1].style.display = "none";
    ingredientsToggle.children[2].style.display = "none";
    ingredientsToggle.children[3].style.display = "block";
    ingredientsToggle.style.backgroundColor = "rgba(202, 146, 101)";
    document.getElementById("wine-pairing").style.display = "block";
    document.getElementById("ingredients").innerHTML="Ingredients";
  }
}
/* ============================================================================================ */

function copyIngredientsToText(){

  let recipeCardIngredient = document.querySelectorAll(".necessary-ingredient");
  let recipeCardIngredients = [];

  for (let i = 0; i < recipeCardIngredient.length; i++){
  
    recipeCardIngredients.push(recipeCardIngredient[i].innerHTML);
  }

  let text = recipeCardIngredients.toString();
  text = text.split(",").join("\n");

  let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${selectRecipe.title}_ingredients-list.txt`);

}

/* == Events ==================================================================================== */

searchForm.addEventListener("submit", openModal);

mealList.addEventListener("click", getMealRecipe);

recipeCloseBtn.addEventListener("click", () => {
  recipeContent.parentElement.classList.remove("showRecipe");
  mealResults.style.display = "block";
  aQuote.style.display = "block";
});

/* == User Preferences Events ============================================================== */

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

  console.log(userIntolerances[12].checked);

  // worked out a way to stop users having 'none' checked with other 
  // intolerances.  Works ok although users can uncheck none and 
  // parse all unchecked / empty into the URL.  Not perfect solution.
  if(userIntolerances[12].checked){
    for (let i=0; i<=11; i++){
      userIntolerances[i].checked = false; 
    }    
  } 
  userIntolerances.forEach( function recordIntolerances(intol, index){
    userPrefIntol.push( intol.id +"-"+ intol.checked );
  })

  userPref[2] = userPrefIntol;  
  localStorage.setItem("preferences", JSON.stringify(userPref));
  delete userPrefIntol;  // clearing array when user next opens filter window.
}

/* ============================================================================================ 
   ============================================================================================ */
