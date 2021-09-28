
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


let ingredient      = [];
let userPref        = [];
let ingredients;

/* ========================================================================================== */

initialise();

getTodaysRecipe ();

/* ========================================================================================== */

function initialise(){
  

  }

/* ========================================================================================== */

function storedPrefs (){

  storedPreferences = JSON.parse(localStorage.getItem("preferences"));
  document.getElementById('id01').style.display="block";

  if (storedPreferences !== null) {  
    userPref = storedPreferences;

    if( userPref[2]!== null ){ 
      document.getElementById( userPref[2] ).checked      = true;
    } else {
      document.getElementById( "date-day" ).checked       = true;
    }
  } else { 
    createDefaultUserPref ();
  }
}

/* ====================================================================================== */ 

function createDefaultUserPref (){


}

/* ====================================================================================== */ 




/* == Fetch data ================================================================================= */ 
  
function getTodaysRecipe ( ) {

  // let apiURL = `https://api.spoonacular.com/recipes/visualizeRecipe?appid=${spoonacularAPI}`;
  
  let apiURL = `https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2&apiKey=${spoonacularAPI}`;

  fetch( apiURL )

    .then(function ( response ) {
      if ( response.ok ) {
      response.json()

        .then(function ( data ) {

            console.log( data );


          });
          } else {
            alert("I can't find that ingredient, check your spelling or possibly I just don't have data for that ingredient.");
          } 
    });
};



/* ====================================================================================== */ 





/* ====================================================================================== */ 



/* ====================================================================================== */ 



/* ====================================================================================== */ 



/* ====================================================================================== */ 




/* == User Preference Events ============================================================ */ 

function userDatePref( clicked_object ) {
  userPref[2] = clicked_object.id;   
  localStorage.setItem( "preferences", JSON.stringify(  userPref  )); 
  return;
};

/* ====================================================================================== */ 



function storeUserPref(){
  localStorage.setItem("preferences", JSON.stringify( UserPref ));
}




/* ====================================================================================== 
   ====================================================================================== */ 