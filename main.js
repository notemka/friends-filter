var firstSearch = document.getElementById("first_search");
var secondSearch = document.getElementById("second_search");
var results = document.getElementById("results");
var filtredFriends = document.getElementById("filtered_results");
var mainFriendsList = [];
var filtredFriendsList = [];
var apply = document.getElementById("apply");
var dragSrcEl = null;
var firstIdsArr = [];
var secondIdsArr = [];

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
            moveFriends("fa fa-remove", filtredFriendsList, firstIdsArr, secondIdsArr, filtredFriends);
            console.log(firstIdsArr);
          }
          else if(e.target.classList[1] === "fa-remove") {
            moveFriends("fa fa-plus", mainFriendsList, secondIdsArr, firstIdsArr, results);
            console.log(secondIdsArr);
          }

          function moveFriends(newClass, saveArr, addIdArr, removeIdArr, showArr) {
            var li = e.target.closest(".friends-item");
            var liId = e.target.closest(".friends-item").getAttribute("data-id");

            e.target.setAttribute("class", newClass);
            saveArr.push(li);
            addIdArr.push(li.getAttribute("data-id"));
            removeIdArr.filter(function(val){
              if(val === liId) {
                removeIdArr.splice(removeIdArr.indexOf(val), removeIdArr.indexOf(val));
              }
            });
            showArr.appendChild(li);
          }
        });

        function dragItem(e){
          // e.preventDefault();

          e.target.dataTransfer.effectAllowed = "move";
          e.target.dataTransfer.setData("text/html", e.target.getAttribute("id"));
        }
        function dragOverItem(e){
          e.target.preventDefault();

          dragSrcEl = this;
        }
        function dragEnterItem(e){
          e.preventDefault();

          return true;
        }
        function dragLeaveItem(e){
          // e.preventDefault();
        }
        function dropItem(e){
          e.target.appendChild(document.getElementById(e.dataTransfer.getData("text/html")));

          e.stopPropagation();
          return false;
        }
        function dropEndItem(e){
          // e.preventDefault();
        }

        results.addEventListener("dragstart", dragItem);
        filtredFriends.addEventListener("drop", dropItem);
        // item.addEventListener("dragstart", dragItem);
        // item.addEventListener("dragover", dragOverItem);
        // item.addEventListener("dragenter", dragEnterItem);
        // item.addEventListener("dragleave", dragLeaveItem);
        // item.addEventListener("drop", dropItem);
        // item.addEventListener("dropend", dropEndItem);

        apply.addEventListener("click", function(e) {
          e.preventDefault();

          localStorage.setItem("mainList", JSON.stringify(mainFriendsList));
          console.log(mainFriendsList);
          localStorage.setItem("filteredList", JSON.stringify(filtredFriendsList));
          console.log(filtredFriendsList);
        });

        window.addEventListener("load", function() {
          // if (localStorage.filteredList) {
          //   var filtredRes = JSON.parse(localStorage.getItem("filteredList"));
          //   var mainRes = JSON.parse(localStorage.getItem("mainList"));
          //   console.log(filtredRes);
          //
          //   for (var i=0; i<filtredRes.length; i++) {
          //     console.log(filtredRes[i]);
          //   }
          // }
        });

        results.innerHTML= template;
        resolve();
      }
    });
  });
}).catch(function(e) {
    console.log("Ошибка: " + e.message);
  });
