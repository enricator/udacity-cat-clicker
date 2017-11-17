$(document).ready(function() {

  /* ### MODEL ### */
  var model = {
    lsName: 'ucc-kitties',
    picSize: 350,
    dummyPlaceholder: '',
    kitties: [],
    activeKitty: null,

    init: function() {
      this.dummyPlaceholder = 'http://via.placeholder.com/' + this.picSize + 'x' + this.picSize + '';
      if (localStorage.getItem(this.lsName)) {
        this.kitties = JSON.parse(localStorage.getItem(this.lsName));
      } else {
        // cat pics taken from lorempixel.com
        // ex: https://lorempixel.com/350/350/cats/7/
        this.kitties= [
          {
            name: 'Oscar',
            clicks: 0,
            url: 'images/cat5.jpg'
          },
          {
            name: 'Wendy',
            clicks: 0,
            url: 'images/cat4.jpg'
          },
          {
            name: 'Igor',
            clicks: 0,
            url: 'images/cat3.jpg'
          },
          {
            name: 'Clara',
            clicks: 0,
            url: 'images/cat1.jpg'
          },
          {
            name: 'Flash',
            clicks: 0,
            url: 'images/cat7.jpg'
          },
          {
            name: 'Dori',
            clicks: 0,
            url: 'images/cat9.jpg'
          },
          {
            name: 'Georg',
            clicks: 0,
            url: 'images/cat8.jpg'
          }
        ];
        localStorage.setItem(this.lsName, JSON.stringify(this.kitties));
      }
      this.activeKitty = 0;
    }
  };


  /* ### VIEWS ### */
  var catListView = {

    init: function() {
      this.catList = $('#kittylist');
      this.resetButton = $('#btnResetVotes');
      this.kitties = octopus.getKitties();
      this.show();
    },

    show: function() {
      this.catList.html('');
      if (this.kitties.length == 0) {
        this.catList.append('<p>no cats found</p>');
      } else {
        for (var i = 0; i < this.kitties.length; i++) {
          this.catList.append(
            '<li class="list-group-item kitty" id="kitty' + i +
              '"><span class="badge">' +
              this.kitties[i].clicks +
              '</span>' +
              this.kitties[i].name +
              '</li>'
          );
        }

        $('.kitty').click(function(e) {
          let catId = parseInt(this.id.substr(-1));
          octopus.setActiveKitty(catId);
        });

        this.resetButton.click(function(e) {
          octopus.resetVotes();
        });
      }

    },

    updateBadge: function(id, votes) {
      $('#kitty'+id+' span.badge').text(votes);
    },

    enableReset: function() {
      this.resetButton.removeClass('disabled');
    },
    disableReset: function() {
      this.resetButton.addClass('disabled');
    }
  };

  var catView = {
    init: function() {
      this.catPic = $('#kittypic');

      this.catPic.click(function(e) {
        octopus.voteForKitty();
      });

      this.showKitty(octopus.getCurrentKitty());
    },

    showActiveKitty: function(catId) {
      let kitty = octopus.getCurrentKitty();
      $('#dbg').text('active cat id: ' + catId);
      $('#kittyname').text(kitty.name);
      $('#kittyvotes span.badge').text(kitty.clicks);
      this.catPic.attr('src', octopus.getKittyPic());
    },

    showKitty: function(kitty) {
      $('#kittyname').text(kitty.name);
      this.updateBadge(kitty.clicks);
      this.catPic.attr('src', octopus.getKittyPic());
    },

    updateBadge: function(votes) {
      $('#kittyvotes span.badge').text(votes);
    }

  }

  var adminView = {
    init: function() {
      this.form = $('#frmEdit');
      this.admin = $('#btnAdmin');
      this.reset = $('#btnResetVotes');
      this.cancel = $('#btnCancel');
      this.update = $('#btnUpdate');

      this.name = $('#inputCatName');
      this.url = $('#inputCatUrl');
      this.votes = $('#inputCatVotes');

      this.admin.click(function(e) {
        octopus.toggleAdmin();
      });

      this.cancel.click(function(e) {
        octopus.cancelEdit();
      });

      this.update.click(function(e) {
        octopus.editKitty();
      });
    },

    loadKitty: function(kat) {
      if(!this.form.hasClass('hidden')) {
        this.name.val(kat.name);
        this.url.val(kat.url);
        this.votes.val(kat.clicks);
      }
    },

    getValue: function(name) {
      if(name == 'name') { return this.name.val(); }
      if(name == 'url') { return this.url.val(); }
      if(name == 'votes') { return this.votes.val(); }
      return '';
    },

    clearInputs: function() {
      this.name.val('');
      this.url.val('');
      this.votes.val('');
    },

    toggleView: function() {
      this.form.toggleClass('hidden');
      this.reset.toggleClass('hidden');
    },

    showMessage: function(message, type) {
      let errorMessage = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button>' + message + '</div>';
      $('#formError').html(errorMessage);
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
      if (this.getKittiesNumber() > 0) {
        catListView.enableReset();
      }
      catView.init();
      this.log('catView initialized');
      adminView.init();
      this.log('adminView initialized');
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
      adminView.loadKitty(this.getCurrentKitty());
    },
    showActiveKitty: function() {
      catView.showActiveKitty(model.activeKitty);
      adminView.loadKitty(this.getCurrentKitty());
    },

    voteForKitty: function() {
      let kitty = this.getCurrentKitty();
      kitty.clicks += 1;
      this.log('new vote for ' + kitty.name + ' [id: '+ this.getCurrentKittyId() +']');
      catListView.updateBadge(this.getCurrentKittyId(), kitty.clicks);
      catView.updateBadge(kitty.clicks);
      adminView.loadKitty(kitty);
      this.saveVotes();
    },

    saveVotes: function() {
      localStorage.setItem(model.lsName, JSON.stringify(this.getKitties()));
    },

    resetVotes: function() {
      model.kitties.forEach(function(kat) {
        kat.clicks = 0;
      });
      this.saveVotes();
      this.log('votes have been reset!');
      catListView.show();
      this.showActiveKitty();
    },

    toggleAdmin: function() {
      adminView.toggleView();
      adminView.loadKitty(this.getCurrentKitty());
    },
    cancelEdit: function() {
      adminView.clearInputs();
      adminView.toggleView();
    },
    validateEdit: function() {
      let name = adminView.getValue('name');
      let url = adminView.getValue('url');
      let votes = adminView.getValue('votes');
      return (name != '') && (url != '') && (votes != '') && (votes >= 0);
    },

    editKitty: function() {
      if (this.validateEdit()) {
        let kitty = this.getCurrentKitty();
        kitty.name = adminView.getValue('name');
        kitty.url = adminView.getValue('url');
        kitty.clicks = parseInt(adminView.getValue('votes'));
        this.saveVotes();
        catListView.show();
        this.showActiveKitty();
        adminView.showMessage('cat info updated', 'success');
      } else {
        adminView.showMessage('invalid form data!!!', 'warning');
        console.log('invalid form data!!!');
      }
    },

    log: function(s) {
      if (this.bDebug) {console.log(s);}
    }
  }

  octopus.init();
});
