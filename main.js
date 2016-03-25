var friends = document.getElementById("friends-list");

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
    }, 8);

  });
}).then(function() {
  return new Promise(function(resolve,reject) {
    VK.api("friends.get", {fields: "photo_50, nickname", name_case: "nom", order: "name"}, function(response) {
      // console.log(response);
      if(response.error) {
        reject(new Error(response.error.error_msg));
      }
      else {
        var friendsList = document.getElementById("friends_list"),
            results = document.getElementById("results"),
            source = friendsList.innerHTML,
            templateFn = Handlebars.compile(source),
            template = templateFn({friends: response.response});

        results.innerHTML= template;
        resolve();
      }
    })
  });
}).catch(function(e) {
    console.log("Ошибка: " + e.message);
  });
