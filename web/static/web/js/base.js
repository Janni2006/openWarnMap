function activate(obj) {
    document.getElementById("custom_navbar").classList.add("show");
    document.getElementById("nav-menu-btn").classList.add("hide");    
    document.getElementById("body").classList.add("disabled");
    if(document.getElementById("messages") != null){
        document.getElementById("messages").classList.add("hide");
    }
};

function cancel(obj) {
    document.getElementById("body").classList.remove("disabled");
    document.getElementById("custom_navbar").classList.remove("show");
    document.getElementById("nav-menu-btn").classList.remove("hide");
    if(document.getElementById("messages") != null){
        document.getElementById("messages").classList.remove("hide");
    }
};

$(document).ready(function(){
  $(window).scroll(function(){
    if(this.scrollY > 20){
      $(".goTop").fadeIn();
    }
    else{
      $(".goTop").fadeOut();
    }
  });

  $(".goTop").click(function(){scroll(0,0)});
});