$(function() {
  // socket
  var socket = io();
  socket.emit('add new user');

  // variables

  var countPl = 1;
  var modal = $('.modal-dialog');


  $('#start').on('click', function () {
    if(countPl === 1) return;
    $(this).toggleClass('ready');
    socket.emit("ready");
  });

  $('.battlefield').on('click', function (e) {
    let target = e.target;
    if(target.classList.contains('YOU')) return;

    $('.coord').text(' ' + e.clientX + ' ' + e.clientY);

    let goal;
    if(target.nodeName === 'P') target = target.parentNode;
    goal = target.classList.contains('player') ? target.parentNode : target;

    let goalPos = {
      top: e.clientY - 30 - goal.offsetTop,
      left: e.clientX - 30 - goal.offsetLeft
    };

    socket.emit('move', goalPos);
  });

  modal.on('click', () => modal.hide());

  socket.on('newPoint', (idplayer, data) => {
    let div = document.getElementsByClassName(idplayer);//надо более точный
    if(!div[1]) return;
    div[1].style.left = data[0].left + 'px';
    div[1].style.top = data[0].top + 'px';
    div[0].innerHTML = data[1];
    $('#roundTime').html(data[2]);
  });

  socket.on('addUser', (data ,Id) => {
    addTimer(Id, 'You ');
    addDiv(data, Id, 'YOU ');
  });

  socket.on('addConnectedUsers', (data, Id) => {
    $('#start').css({opacity: 1});
    if(document.getElementsByClassName(Id).length > 0) return;
    addDiv(data, Id);
    countPl++;
    addTimer(Id);
  });

  socket.on('catch', (Id) => {
    $(".player").empty();
    $("." + Id).html("<p>★</p>");
  });

  socket.on('stopGame', (Id) => {
    $('#start').removeClass('ready');
    let message = $('.modal-body');
    if($('.' + Id).hasClass('YOU')) message.html('You win! Congratulate!');
    else message.html('You lose!');

    modal.show('slow');
  });

  socket.on('delUser', (Id) => {
    let t = $("." + Id);
    if(!t.length) return;
    t[0].parentNode.parentNode.removeChild(t[0].parentNode);
    $(t[1]).remove();
    countPl--;
    if(countPl === 1){
      $('#start').css({opacity: 0.5}).removeClass('ready');
    }
  });

  //local Function
  function addDiv(data ,Id, our = '') {
    let $player = document.createElement('div');
    $($player).addClass("player " + our + Id);
    $($player).css(data);
    $('.battlefield').append($player);
  }

  function addTimer(Id, our = '') {
    let $timer = document.createElement('tr');
    let name = our ? our : Id.slice(0, 3);
    $timer.innerHTML = "<td>Player " + name +
      ":</td><td class='" + Id + "'></td>" ;
    $('#timers').append($timer);
  }

});