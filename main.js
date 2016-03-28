var firstSearch = document.getElementById("first_search");
var secondSearch = document.getElementById("second_search");
var results = document.getElementById("results");
var filtredFriends = document.getElementById("filtered_results");
var mainFriendsList = [];
var filtredFriendsArr = [];

new Promise(function(resolve) {
  if(document.readyState === "complete") {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function() {
  return new Promise(function(resolve,reject) {

    VK.init({
      apiId: 5373079
    });

    VK.Auth.login(function(response) {
        if (response.session) {
            resolve(response);
        } else {
            reject(new Error("Не удалось авторизоваться"));
        }
    }, 2);

  });
}).then(function() {
  return new Promise(function(resolve,reject) {
    VK.api("friends.get", {fields: "photo_50, nickname", name_case: "nom", order: "name"}, function(response) {
      if(response.error) {
        reject(new Error(response.error.error_msg));
      }
      else {
        var friendsList = document.getElementById("friends_list"),
            source = friendsList.innerHTML,
            templateFn = Handlebars.compile(source),
            template = templateFn({friends: response.response});

        firstSearch.addEventListener("keydown", function(e) {
          var searchText = firstSearch.value.toLowerCase();

          var seachFriends = response.response.filter(function(value) {
            var fullName = value.first_name;
            var lastName = value.last_name;

            if(~(fullName.toLowerCase().indexOf(searchText))) {
              return ~(fullName.toLowerCase().indexOf(searchText));
            }

            if(~(lastName.toLowerCase().indexOf(searchText))) {
              return ~(lastName.toLowerCase().indexOf(searchText));
            }
          });

          if(seachFriends.length > 0) {
            template = templateFn({friends: seachFriends});
            results.innerHTML= template;
          }
        });


        document.addEventListener("click", function(e) {
          e.preventDefault();

          if(e.target.classList[1] === "fa-plus") {
            moveFriends("fa fa-minus", filtredFriendsArr, filtredFriends);
          }
          else if(e.target.classList[1] === "fa-minus") {
            moveFriends("fa fa-plus", mainFriendsList, results);
          }

          function moveFriends(newClass, saveArr, showArr) {
            e.target.setAttribute("class", newClass);
            saveArr.push(e.target.closest(".friends-item"));

            showArr.appendChild(e.target.closest(".friends-item"));
          }
        });

        results.innerHTML= template;
        resolve();
      }
    })
  });
}).catch(function(e) {
    console.log("Ошибка: " + e.message);
  });
