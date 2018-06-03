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

var carouselPinterestData = database.ref("pintData");

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
    console.log(chosen);

    var imgTags = document.getElementsByTagName('img');//get image array inside carousal
    var imgMeta = document.getElementsByClassName('carousel-caption');//get meta section of all 4 images
    var imgH3 = $(imgMeta).find('h3');//get array of h3 elements in meta section
    var imgP = $(imgMeta).find('p');//get array of p elements in meta section
    console.log(imgH3);
    console.log(imgP);

    console.log(imgH3[0].innerText = "test");

    for (var i = 0; i < imgTags.length; i++) {
        console.log(chosen[i]);
        imgTags[i].src = recipeImages[chosen[i]].image.original.url;
        var test=recipeImages[chosen[i]].note;
        if (test) {
            imgH3[i].innerText=test;
        }
        else{
            imgH3[i].innerText= recipeImages[chosen[i]].metadata.article['name'];
        }

    }
})


$(document).on("click", ".inspiredTitle", function () {
    callPintData();
});

// queryURL = "https://api.edamam.com/search?q=chicken&app_id=540719b1&app_key=2d98d59eaf4976edb2d1abd92540e167"



// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
//     console.log(response.hits[0].recipe.image);
//     var testimg = response.hits[0].recipe.image;
//     $('.card-img-top').attr("src", testimg);
// }
// );
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

// queryURL="https://api.unsplash.com/search/photos?client_id=c6d3c010f83ef0630f11fae2cbeeca0199c63e5c1eab2091797e3a2647a53395&query=recipes"


// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function (response) {
//          console.log(response);
//     var pintDataLength = response.results.length;
//     var pintData = response.results;
//     //     // $('img').attr("src", response.data[3].image.original.url);

//     var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//     var chosen = [];
//     for (var i = 0; i < 10; i++) {
//         var index = Math.floor((Math.random() * numbers.length) + 1) - 1;
//         chosen.push(numbers[index]);
//         numbers.splice(index, 1);
//     }
//     console.log(chosen);

//     var test = document.getElementsByTagName('img');
//     console.log(test);
//     console.log(test[0].img);
//     for (var i = 0; i < test.length; i++) {
//         test[i].src=pintData[chosen[i]].urls.regular;
//     }

// }
// );

