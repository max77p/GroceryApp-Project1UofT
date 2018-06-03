// API Integration
// Get console.log to work
// Create a new row -- getting the things to just add, and then seeing

$("button").on("keypress click", function myFunction() {


    //  Emptying out the container
    $('.grid').empty();
  
    // Storing what is typed into the search bar
    var searchTerm = $("#searchForm").val();
    console.log(searchTerm);
  
    if (event.keyCode === 13 || event.type === 'click') {
      // Consturcting the query URL for the API
      var queryURL = "https://api.edamam.com/search?q=" + searchTerm + "&app_id=b0ffc540&app_key=a41b1a4d8560dbb27bbf0ef650ec9bf0";
      console.log(queryURL);
      // API call
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        // For loop going through for 9 recipes
        for (var i = 0; i < 10; i++) {
          console.log(response);
          // Getting the image from the API
          console.log(response.hits[i].recipe.url);
  
  
          // Creating the big square for the grid (main)
          var recipeDiv = $("<div>").attr("class", "card").attr("class", "mainCard").attr("class","col-md-4");
  
          // Image
          var recipeImage = $('<img src="' + response.hits[i].recipe.image + '" >').attr("class", "image").attr("data", response.hits[i].recipe.url);
          recipeDiv.append(recipeImage);
  
  
          // The card body contains the title of the recipe
          var recipeBodyDiv = $("<div>").attr("class", "card-body");
          recipeDiv.append(recipeBodyDiv);
  
          // Title of Recipe
          var recipeTitle = $("<h5>").text(response.hits[i].recipe.label).attr("class", "title").attr("data", response.hits[i].recipe.url);
          recipeBodyDiv.append(recipeTitle);
  
          // console.log(recipeDiv);
          $(".grid").append(recipeDiv);
  
  
  
        }
  
  
        // Takes you to the recipe url webpage
  
        $(document).on('click', '.image', function () {
          window.open($(this).attr('data'));
          console.log(this);
        });
  
        $(document).on('click', '.title', function () {
          window.open($(this).attr('data'));
          console.log(this);
        });
  
  
      });
  
  
    }
  
  });
  
  
  $(document).ready(function () {
    //  Emptying out the container
    $('.grid').empty();
  
    // Storing what is typed into the search bar
    var searchTerm = "random";
    console.log(searchTerm);
    // Consturcting the query URL for the API
    var queryURL = "https://api.edamam.com/search?q=" + searchTerm + "&app_id=b0ffc540&app_key=a41b1a4d8560dbb27bbf0ef650ec9bf0";
    console.log(queryURL);
    // API call
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // For loop going through for 9 recipes
      for (var i = 0; i < 10; i++) {
        console.log(response);
        // Getting the image from the API
        console.log(response.hits[i].recipe.url);
  
  
        // Creating the big square for the grid (main)
        var recipeDiv = $("<div>").attr("class", "card").attr("class", "mainCard").attr("class","col-md-4");
  
        // Image
        var recipeImage = $('<img src="' + response.hits[i].recipe.image + '" >').attr("class", "image").attr("data", response.hits[i].recipe.url);
        recipeDiv.append(recipeImage);
  
  
        // The card body contains the title of the recipe
        var recipeBodyDiv = $("<div>").attr("class", "card-body");
        recipeDiv.append(recipeBodyDiv);
  
        // Title of Recipe
        var recipeTitle = $("<h5>").text(response.hits[i].recipe.label).attr("class", "title").attr("data", response.hits[i].recipe.url);;
        recipeBodyDiv.append(recipeTitle);
  
        // console.log(recipeDiv);
        $(".grid").append(recipeDiv);
  
  
  
      }
  
      // Takes you to the recipe url webpage
  
      $(document).on('click', '.image', function () {
        window.open($(this).attr('data'));
        console.log(this);
      });
  
      $(document).on('click', '.title', function () {
        window.open($(this).attr('data'));
        console.log(this);
      })
  
  
    });
  
  })
  



