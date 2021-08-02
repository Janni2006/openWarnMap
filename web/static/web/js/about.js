$(document).ready(function(){
    var scroll = window.requestAnimationFrame ||
                // IE Fallback
                function(callback){ window.setTimeout(callback, 1000/60)};
    var elementsToShow = document.querySelectorAll('.benefits'); 

    function loop() {

        Array.prototype.forEach.call(elementsToShow, function(element){
            if (isElementInViewport(element)) {
                element.classList.add('visible');
                $(".benefits .container").each(function(){
                    $(this).fadeIn();
                });
            } else {
                element.classList.remove('visible');
                $(".benefits .container").each(function(){
                    $(this).fadeOut();
                });
            }
        });

        scroll(loop);
    }

    // Call the loop for the first time
    loop();

    // Helper function from: http://stackoverflow.com/a/7557433/274826
    function isElementInViewport(el) {
        // special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }
        var rect = el.getBoundingClientRect();
        return (
            (rect.top <= 0
            && rect.bottom >= 0)
            ||
            (rect.bottom >= (window.innerHeight + 1 || document.documentElement.clientHeight + 1) &&
            rect.top <= (window.innerHeight - 1 || document.documentElement.clientHeight - 1))
            ||
            (rect.top >= 0 &&
            rect.bottom <= (window.innerHeight + 1 || document.documentElement.clientHeight + 1))
        );
    }

    $(".language-btn").click(function(){
        document.getElementById("languages-content").classList.toggle("show");
    });
    
    window.onscroll = function() {
        if (document.getElementById("languages-content").classList.contains("show")) {
            document.getElementById("languages-content").classList.remove("show");
        }
    }
});