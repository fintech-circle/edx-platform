$(document).ready(function() {

  function toggleSidebar() {
    $(".button-burger").toggleClass("active");
    $(".window-wrap").toggleClass("move-to-left");
    $(".sidebar-item").toggleClass("active");
  }

  $(".button-burger").on("click tap", function() {
    toggleSidebar();
  });

  $(document).keyup(function(e) {
    if (e.keyCode === 27) {
      toggleSidebar();
    }
  });

});