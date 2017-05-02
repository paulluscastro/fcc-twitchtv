var STREAMING = 2;
var OK = 3;
var GONE = 4;
var NOT_FOUND = 404;

var defaultLogo = 'https://camo.githubusercontent.com/30dc5f712e26d999df8b1f9263da5933a54e1b08/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f373033333233342f323439313534392f37333333343730632d623166312d313165332d383466382d6234313934396239616132652e706e67';

var twitchers = [
  {
    id: "freecodecamp"
  },
  {
    id: "storbeck"
  },
  {
    id: "paulluscastro"
  },
  {
    id: "terakilobyte"
  },
  {
    id: "brunofin"
  },
  {
    id: "EsteUsuarioNaoExisteThisUserDoesntExist"
  },
  {
    id: "habathcx"
  },
  {
    id: "RobotCaleb"
  },
  {
    id: "thomasballinger"
  },
  {
    id: "noobs2ninjas"
  },
  {
    id: "beohoff"
  },
  {
    id: "comster404"
  }
];
var baseUrlUsers = 'https://api.twitch.tv/kraken/users/';
var baseUrlStream = 'https://api.twitch.tv/kraken/streams/';
var baseLink = 'https://secure.twitch.tv/';

function addUser(user) {
  var conteudo = '<div class="row user-row" data-position="' + user.status + '">' +
    '<div class="col-xs-12">';
    switch (user.status) {
      case OK:
        conteudo += '<div class="user-profile">';
        break;
      case GONE:
        conteudo += '<div class="user-profile inactive">';
        break;
      case STREAMING:
        conteudo += '<div class="user-profile online">';
        break;
      case NOT_FOUND:
        conteudo += '<div class="user-profile not-found">';
        break;
    }

  if (user.hasOwnProperty('link') && (user.link != '')) {
    conteudo +='<a href="' + user.link + '" target="_blank"><img src="' + user.logo + '" class="user-photo ' + (user.logo == defaultLogo ? 'white-background' : '') + '" /></a>' +
      '<div class="user-name">' +
      '<a href="' + user.link + '" target="_blank"><h3>' + user.name + '</h3></a>';
  } else {
    conteudo +='<img src="' + user.logo + '" class="user-photo ' + (user.logo == defaultLogo ? 'white-background' : '') + '" />' +
    '<div class="user-name">' +
    '<h3>' + user.name + '</h3>';
  }
  conteudo += '<p>' + user.description + '</p>' +
    '</div>' + // user-name
    '<a href="#" class="open-close"><i class="glyphicon glyphicon-menu-left circle-icon"></i></a>' +
    '</div>' + // user-profile
    '<div class="user-details">';

  switch (user.status) {
    case OK:
      conteudo += '<p><strong>Status: </strong> offline</p>';
      break;
    case GONE:
      conteudo += '<p><strong>Status: </strong> inactive</p>';
      break;
    case STREAMING:
      conteudo += '<p><strong>Status: </strong> streaming</p>' +
        '<p>' + user.stream.description + '</p>';
      break;
    case NOT_FOUND:
      conteudo += '<p><strong>Status: </strong> user not found</p>';
      break;
  }

  conteudo += '</div>' + // user-details
    '</div>' + // col-x12
    '</div>'; // user-row

  $('#twitch-users').append(conteudo);
  var rows = $('.user-row');
  rows.sort(function(a, b){
    var posA = $(a).attr('data-position');
    var posB = $(b).attr('data-position');

    return posA - posB;
  });
  $('#twitch-users').html('');

  for(var i = 0; i < rows.length; i++)
    $('#twitch-users').append(rows[i]);
}

function getCurrentStatus(user) {
  user.link = baseLink + user.id + '?client_id=rshq1ipxa7rnej0ns5exj0huexwdqq';
  // Primeiro pega informação do Twitcher
  $.ajax({
    dataType: "json",
    url: baseUrlStream + user.id + '?client_id=rshq1ipxa7rnej0ns5exj0huexwdqq',
    success: function(data) {
      if (data.hasOwnProperty('stream') && (data.stream != null)) {
        user.status = STREAMING;
        user.stream = {
          description: data.stream.channel.status
        };
      } else {
        user.stream = null;
      }
      addUser(user);
    },
    error: function(data, status, error) {
      user.status = GONE;
      addUser(user)
    }
  });
}

function getTwictherData(user) {
  // Primeiro pega informação do Twitcher
  $.ajax({
    dataType: "json",
    url: baseUrlUsers + user.id + '?client_id=rshq1ipxa7rnej0ns5exj0huexwdqq',
    success: function(data) {
      user.name = data.hasOwnProperty('display_name') && (data.display_name != null) ? data.display_name : user.id;
      user.description = data.hasOwnProperty('bio') && (data.bio != null) ? data.bio : '<em>No bio provided</em>';
      user.logo = data.hasOwnProperty('logo') && (data.logo != null) ? data.logo : defaultLogo;
      user.status = OK;
      getCurrentStatus(user);
    },
    error: function(data, status, error) {
      user.status = NOT_FOUND;
      user.name = user.id;
      user.description = '';
      user.logo = defaultLogo;
      addUser(user);
    }
  });
}

function fillTwitchUsers() {
  for(var i = 0; i < twitchers.length; i++){
    var current = twitchers[i];
    getTwictherData(current);
  }
}

$(document).ready(function(){

  $('#twitch-users').html('');
  fillTwitchUsers();
  $('#twitch-users').on('click', '.open-close', function(event){
    if ($(this).children('.circle-icon').hasClass('glyphicon-menu-left')) {
      // ************************* ABRIR O MENU *************************
      // Fade-out do conteúdo
      $(this).parent().children('.user-name').removeClass('animated').removeClass('fadeIn');
      $(this).parent().children('.user-name').addClass('fadeOut animated');
      // Animação de abertura
      $(this).parent().animate({width: '167px'}, 1000).addClass('open');
      // Altera o ícone
      $(this).children('.circle-icon').addClass('glyphicon-menu-right');
      $(this).children('.circle-icon').removeClass('glyphicon-menu-left');
    } else {
      $(this).children('.circle-icon').removeClass('glyphicon-menu-right');
      $(this).children('.circle-icon').addClass('glyphicon-menu-left');
      // Retira a classe de sombreamento no pai
      $(this).parent().removeClass('open');
      // Animação de fechamento
      $(this).parent().animate({width: '100%'}, 250).removeClass('open');
      // Fade-in do conteúdo
      $(this).parent().children('.user-name').removeClass('animated').removeClass('fadeOut');
      $(this).parent().children('.user-name').addClass('fadeIn animated');
    }
    event.preventDefault();
  });
});
