$(document).ready(function() {
  /* ### MODEL ### */
  var model = {
    picSize: 350,
    picUrlbase: 'https://lorempixel.com/',
    dummyPlaceholder: '',
    kitties: [],
    activeKitty: null,

    init: function() {
      this.dummyPlaceholder = "http://via.placeholder.com/" + this.picSize + "x" + this.picSize + "";
      this.kitties= [
        {
          name: "Oscar",
          clicks: 0,
          url: "images/cat5.jpg"
        },
        {
          name: "Wendy",
          clicks: 0,
          url: "images/cat4.jpg"
        },
        {
          name: "Igor",
          clicks: 0,
          url: "images/cat3.jpg"
        },
        {
          name: "Clara",
          clicks: 0,
          url: "images/cat1.jpg"
        },
        {
          name: "Flash",
          clicks: 0,
          url: "images/cat7.jpg"
        },
        {
          name: "Dori",
          clicks: 0,
          url: "images/cat9.jpg"
        }
      ];
      this.activeKitty = 0;
    },

    init_v1: function() {
      this.dummyPlaceholder = "http://via.placeholder.com/" + this.picSize + "x" + this.picSize + "";
      this.kitties= [
        {
          name: "Oscar",
          clicks: 0,
          url: this.picUrlbase + this.picSize + "/" + this.picSize + "/cats/5"
        },
        {
          name: "Wendy",
          clicks: 0,
          url: this.picUrlbase + this.picSize + "/" + this.picSize + "/cats/4"
        },
        {
          name: "Igor",
          clicks: 0,
          url: this.picUrlbase + this.picSize + "/" + this.picSize + "/cats/3"
        },
        {
          name: "Clara",
          clicks: 0,
          url: this.picUrlbase + this.picSize + "/" + this.picSize + "/cats/1"
        },
        {
          name: "Flash",
          clicks: 0,
          url: this.picUrlbase + this.picSize + "/" + this.picSize + "/cats/7"
        },
        {
          name: "Dori",
          clicks: 0,
          url: this.picUrlbase + this.picSize + "/" + this.picSize + "/cats/9"
        }
      ];
      this.activeKitty = 0;
    }
  };


  /* ### VIEWS ### */
  var catListView = {

    init: function() {
      this.catList = $("#kittylist");
      this.kitties = octopus.getKitties();
      this.show();
    },

    show: function() {
      this.catList.innerHTML = '';
      for (var i = 0; i < this.kitties.length; i++) {
        this.catList.append(
          '<li class="list-group-item kitty" id="kitty' +
            i +
            '"><span class="badge">' +
            this.kitties[i].clicks +
            "</span>" +
            this.kitties[i].name +
            "</li>"
        );
      }

      $(".kitty").click(function(e) {
        let catId = parseInt(this.id.substr(-1));
        octopus.setActiveKitty(catId);
      });

    },

    updateBadge: function(id, votes) {
      $('#kitty'+id+' span.badge').text(votes);
    }
  };

  var catView = {
    init: function() {
      this.catPic = $("#kittypic");

      this.catPic.click(function(e) {
        octopus.voteForKitty();
      });

      this.showKitty(octopus.getCurrentKitty());
    },

    showActiveKitty: function(catId) {
      let kitty = octopus.getCurrentKitty();
      $("#dbg").text("active cat id: " + catId);
      $("#kittyname").text(kitty.name);
      $("#kittyvotes span.badge").text(kitty.clicks);
      this.catPic.attr("src", octopus.getKittyPic());
    },

    showKitty: function(kitty) {
      $("#kittyname").text(kitty.name);
      this.updateBadge(kitty.clicks);
      this.catPic.attr("src", octopus.getKittyPic());
    },

    updateBadge: function(votes) {
      $("#kittyvotes span.badge").text(votes);
    }

  }


  /* ### OCTOPUS thing ### */
  var octopus = {
    init: function() {
      this.bDebug = false;
      this.log('\'Cat Clicker premium\' - octopus started ' + ((this.bDebug)?'in debug mode':'') );
      model.init();
      this.log('model initialized: ' + this.getKittiesNumber() + ' kittens found');
      catListView.init();
      this.log('catListView initialized');
      catView.init();
      this.log('catView initialized');
    },

    getKitties: function() {
      return model.kitties;
    },
    getKittiesNumber: function(){
      return model.kitties.length;
    },
    getKittyPic: function() {
      return octopus.bDebug ? model.dummyPlaceholder : model.kitties[model.activeKitty].url;
    },
    getCurrentKittyId: function() {
      return model.activeKitty;
    },
    getCurrentKitty: function() {
      return model.kitties[model.activeKitty];
    },

    setActiveKitty: function(catId) {
      model.activeKitty = catId;
      catView.showActiveKitty(catId);
    },

    voteForKitty: function() {
      let kitty = this.getCurrentKitty();
      kitty.clicks += 1;
      this.log('new vote for ' + kitty.name + ' [id: '+ this.getCurrentKittyId() +']');
      //catView.showKitty(kitty);
      catListView.updateBadge(this.getCurrentKittyId(), kitty.clicks);
      catView.updateBadge(kitty.clicks);
    },

    log: function(s) {
      console.log(s);
    }
  }

  octopus.init();
});
