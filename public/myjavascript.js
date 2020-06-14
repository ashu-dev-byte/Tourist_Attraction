$(".navbar a").click(function (event) {
  // check if window is small enough so dropdown is created
  var toggle = $(".navbar-toggler").is(":visible");
  if (toggle) {
    $(".navbar-collapse").collapse("hide");
  }
});
