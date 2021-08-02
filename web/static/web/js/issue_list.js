$(document).ready(function () {
     $(".issues th .sort").each(function() {
          if(!$(this).hasClass("active")){
               $(this).hide();
          }
     })
     $(".issues th").on({
          mouseenter: function() {
               $(".issues th .sort").each(function() {
                    $(this).hide();
               });
               $(".sort", this).show();
          },
          mouseleave: function() {
               $(".issues th .sort").each(function() {
                    $(this).hide();
                    if($(this).hasClass("active")){
                         $(this).show();
                    }
               })
          },
          click: function() {
               var c_url = window.location.origin + window.location.pathname;
               window.location.replace(c_url + "?page=1&order_by=" + $(this)[0].id)
          },
          dblclick: function() {
               var c_url = window.location.origin + window.location.pathname;
               window.location.replace(c_url + "?page=1&order_by=-" + $(this)[0].id)
          },
     });
});