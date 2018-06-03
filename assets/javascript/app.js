

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCgKPddkgj3RhPS1B2Hw_DihvXgZBbxxiE",
    authDomain: "project1team3-39b4f.firebaseapp.com",
    databaseURL: "https://project1team3-39b4f.firebaseio.com",
    projectId: "project1team3-39b4f",
    storageBucket: "project1team3-39b4f.appspot.com",
    messagingSenderId: "74591335518"
};
firebase.initializeApp(config);
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var messaging = firebase.messaging();
var groceryList = database.ref("/groceryList");
// var list=groceryList.child(user.displayName);

$('.pullChevron').on('click', function () {
    $('#sidebar').toggleClass('active');

})
$(document).click(function (e) {
    var sidebar = $("#sidebar, .pullChevron");
    console.log(sidebar);
    if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0) {//length of sidebar>pullchevron is greater than 0, a window object//
        sidebar.removeClass('active')
    }
});


////////////store list items in local storage/////////////////
$(document).ready(function () {
    $('#list-items').html(localStorage.getItem('listItems'));//on load populate with html from local storage

    $('.add-items').submit(function (event) {
        event.preventDefault();
        var item = $('#todo-list-item').val();//get value from user input

        if (item) {
            $('#list-items').append("<li><input class='checkbox' type='checkbox'/>" + item + "<a class='remove' data-name='" + item + "'>x</a><hr></li>");//sets checkbox and remove dynamically


            localStorage.setItem('listItems', $('#list-items').html());//add html data to local storage
            // localStorage.setItem('listArray', JSON.stringify(items));//keep record in localStorage


            var user = firebase.auth().currentUser;
            var userName = user.displayName;
            // var getLocal = JSON.parse(localStorage.getItem('listArray'));

            groceryList.child(userName + "/items").push(item);//push grocery items to firebase
            var listings = groceryList.child(userName + "/items");
            listings.on("value", function (snapshot) {
                console.log(snapshot.val());
                localStorage.setItem('listArray', JSON.stringify(snapshot.val()));//update local storage item array anytime change happens 
            });


            $('#todo-list-item').val("");
        }
    });

    $(document).on('change', '.checkbox', function () {
        if ($(this).attr('checked')) {//if it has checked then clicking it will remove the checked
            $(this).removeAttr('checked');
        }
        else {
            $(this).attr('checked', 'checked');//if it doesn't have the attribute, then clicked it will check it
        }
        $(this).parent().toggleClass('completed');//add completed class to parent
        localStorage.setItem('listItems', $('#list-items').html());//update info in local storage
    });

    $(document).on('click', '.remove', function () {
        $(this).parent().remove();//remove element that was clicked
        var currentListItem = $(this).data('name');
        console.log(currentListItem);
        var user = firebase.auth().currentUser;
        var userName = user.displayName

        localStorage.setItem('listItems', $('#list-items').html());//update local storage with updated html

        var listings = groceryList.child(userName + "/items");
        listings.once("value").then(function (snapshot) {//when remove is clicked remove item from firebase
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val());
                console.log(childSnapshot.key);
                if (childSnapshot.val() === currentListItem) {
                    listings.child(childSnapshot.key).remove();
                }
            });
        });
    });

});


////////////store list items in local storage/////////////////
var provider = new firebase.auth.GoogleAuthProvider();
$(document).on("click", '.signIn', function (e) {


    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log(token);
        // The signed-in user info.
        var user = result.user;
        console.log(user);



        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // User is signed in!

            // Get profile pic and user's name from the Firebase user object.
            var profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
            var userName = user.displayName;        // TODO(DEVELOPER): Get user's name.
            var email = user.email;
            console.log(email);
            console.log(user.photoURL);

            // Hide sign-in button.

            groceryList.child(userName + "/items").on("value", function (snapshot) {
                console.log(snapshot.val());

                localStorage.setItem('listArray', JSON.stringify(snapshot.val()));

            });
            groceryList.child(userName + "/itemsHtml").on("value", function (snapshot) {
                console.log(snapshot.val());
                if (snapshot.val() != null) {
                    localStorage.setItem('listItems', snapshot.val());
                    $('#list-items').html(localStorage.getItem('listItems'));
                }

            });
            // We load currently existing chant messages.

            // We save the Firebase Messaging Device token and enable notifications.
        } else { // User is signed out!
            // $('#profile').attr("src", profilePicUrl);
        }
    });
})


firebase.auth().onAuthStateChanged(function (user) {
    if (user) { // User is signed in!

        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
        var userName = user.displayName;        // TODO(DEVELOPER): Get user's name.
        var email = user.email;
        console.log(email);
        console.log(user.photoURL);

        // Set the user's profile pic and name.

        $('.popoverContent .name').text(userName);
        $('.popoverContent .email').text(email);
        // Show user's profile and sign-out button.
        var img = $('<img src="' + profilePicUrl + '"id="profile">');
        var img2 = $('<img src="' + profilePicUrl + '"id="profileInside">');
        $('.manIcon').hide();
        $('#profile1').append(img);
        $('.firstRow').append(img2);

        // Hide sign-in button.

        // We load currently existing chant messages.


        // We save the Firebase Messaging Device token and enable notifications.

    } else { // User is signed out!
        // $('#profile').attr("src", profilePicUrl);
        // Hide user's profile and sign-out button.
        // $('#profile').hide();

        $('.manIcon').show();
        $('#profile').remove();
        $('.firstRow #profileInside').remove();
        $('.name').text("");
        $('.email').text("");
        // Show sign-in button.

    }
});

$(document).on("click", ".signOut", function () {
    var user1 = firebase.auth().currentUser;
    var userName = user1.displayName;
    console.log(user1);
    var updateFromLocalArray = JSON.parse(localStorage.getItem('listArray'));//on signout save local storage
    groceryList.child(userName + "/items").set(updateFromLocalArray);

    var getLocalHtml = localStorage.getItem('listItems')
    groceryList.child(userName + "/itemsHtml").set(getLocalHtml);
    localStorage.clear();
    $('#list-items').empty();
    // user1.delete().then(function () {
    //     console.log("signed out");
    // }).catch(function (error) {
    //     // An error happened.
    // });
    firebase.auth().signOut().then(function (e) {
        console.log('Signed Out');
        checkUser();/*for testing*/
    }, function (error) {
        console.error('Sign Out Error', error);
    });
});

function checkUser() {/*for testing only*/
    var user = firebase.auth().currentUser;
    console.log(user);
}


$(document).ready(function () {
    $('#profile1').popover({
        html: true,
        content: function () {
            return $('.popoverContent').html();
        }
    });
});


//////toggle options at bottom of list//////
$('input:radio[name=options]').change(function (e) {
    e.preventDefault();
    var radioBtn = $(this)[0].id;
    console.log(radioBtn);
    var get = $('#list-items');
    console.log(get);
    //  console.log(get[0].children);
    var listitems = get[0].children;

    if (radioBtn === "option2") {//for when user clicks completed button, then show only completed
        $('li:not(.completed)').hide();
        console.log(listitems[0].className);
        console.log(get[0].children)
    }
    else if (radioBtn === "option1") {
        $('li').show();
    }
});


// queryURL = "https://api.edamam.com/search?q=chicken&app_id=540719b1&app_key=2d98d59eaf4976edb2d1abd92540e167"



// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
//     console.log(response.hits[0].recipe.image);
//     var testimg = response.hits[0].recipe.image;
//     $('.card-img-top').attr("src",testimg);
// }
// );

//TODO-api random images to carousal
//TODO-add left side bar to carousal page
//TODO-add top navbar to all pages
//TODO-implement api search for recipes
//-add images to recipe page
//-add quick blurb of recipe into recipe card
//TODO-implement favorites for recipe
//TODO-toggle all on todolist-all
//-toggle favorites
//-toggle tbd

//TODO-random jokes api on carousal page- top
//TODO-create same fire object to compare to todo list. if same item, reject

//TODO-luxury- able to click recipe item and add to list

//TODO-calories,diet labels, nutrition label,health label,


//////////inspire javascript///////////////////////////////////////////////////////////
var carouselPinterestData = database.ref("pintData");

function randomize() {
    carouselPinterestData.on("value", function (snapshot) {
        console.log(snapshot.val());
        var recipeImages = snapshot.val();
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        var chosen = [];
        for (var i = 0; i < 20; i++) {
            var index = Math.floor((Math.random() * numbers.length) + 1) - 1;
            chosen.push(numbers[index]);
            numbers.splice(index, 1);
        }
        // console.log(chosen);

        var imgTags = document.getElementsByClassName('imageCar');//get image array inside carousal
        console.log(imgTags);
        var imgMeta = document.getElementsByClassName('carousel-caption');//get meta section of all 4 images
        var imgH3 = $(imgMeta).find('h3');//get array of h3 elements in meta section
        var imgP = $(imgMeta).find('p');//get array of p elements in meta section
        // console.log(imgH3);
        // console.log(imgP);

        console.log(imgH3[0].innerText = "test");

        for (var i = 0; i < imgTags.length; i++) {
            // console.log(chosen[i]);
            imgTags[i].src = recipeImages[chosen[i]].image.original.url;
            var test = recipeImages[chosen[i]].note;
            if (test) {
                imgH3[i].innerText = test;
            }
            else {
                imgH3[i].innerText = recipeImages[chosen[i]].metadata.article['name'];
            }

        }
    })
}

$(document).ready(function () {
    randomize();
});
$(document).on("click", ".inspiredTitle", function () {
    callPintData();
    randomize();
});

function callPintData() {
    queryURL = "https://api.pinterest.com/v1/boards/jessannkirby/recipes/pins/?access_token=AUeRMsyvE_RWpO5XHYSzOt9rOVoYFTRhtTgDtztE-aeLRMAsQAAAAAA&fields=id%2Clink%2Cnote%2Curl%2Cmetadata%2Cimage"


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var pintDataLength = response.data.length;
        var pintData = response.data;
        carouselPinterestData.set(pintData);
        //     // $('img').attr("src", response.data[3].image.original.url);
    }
    );
}


/////////////--------------Ananya javascript-----------------------------///////////////////////////////////////////

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
  




