$(document).ready(function() {
  var bDebug = true; //if true the pics will be replaced by the dummyPlaceholder

  logit('\'Cat Clicker premium\' started');

  let size = 350;
  const picurlbase = 'https://lorempixel.com/';
  let dummyPlaceholder = "http://via.placeholder.com/" + size + "x" + size + "";
  let kitties = [
    {
      name: "Oscar",
      clicks: 0,
      url: picurlbase + size + "/" + size + "/cats/5"
    },
    {
      name: "Wendy",
      clicks: 0,
      url: picurlbase + size + "/" + size + "/cats/4"
    },
    {
      name: "Igor",
      clicks: 0,
      url: picurlbase + size + "/" + size + "/cats/3"
    },
    {
      name: "Clara",
      clicks: 0,
      url: picurlbase + size + "/" + size + "/cats/1"
    },
    {
      name: "Flash",
      clicks: 0,
      url: picurlbase + size + "/" + size + "/cats/7"
    },
    {
      name: "Dori",
      clicks: 0,
      url: picurlbase + size + "/" + size + "/cats/9"
    }
  ];

  let activeId = 0;

  for (var i = 0; i < kitties.length; i++) {
    $("#kittylist").append(
      '<li class="list-group-item kitty" id="kitty' +
        i +
        '"><span class="badge">' +
        kitties[i].clicks +
        "</span>" +
        kitties[i].name +
        "</li>"
    );
  }

  setActiveKitty(activeId);

  $(".kitty").click(function(e) {
    var catId = parseInt(this.id.substr(-1));
    setActiveKitty(catId);

    logit('showing ' + kitties[catId].name + ' (catId:' + catId + ')');
  });

  $("#kittypic").click(function(e) {
    kitties[activeId].clicks += 1;

    $("#kitty" + activeId + " span.badge").text(kitties[activeId].clicks);
    $("#kittyvotes span.badge").text(kitties[activeId].clicks);

    logit('vote casted for ' + kitties[activeId].name);
  });

  function setActiveKitty(catId) {
    activeId = catId;
    $("#dbg").text("active cat: " + activeId);
    $("#kittyname").text(kitties[activeId].name);
    $("#kittyvotes span.badge").text(kitties[activeId].clicks);
    $("#kittypic").attr("src", bDebug ? dummyPlaceholder : kitties[activeId].url);
  }

  function logit(s) {
    if (bDebug) console.log(s);
  }
});
