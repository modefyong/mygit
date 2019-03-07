function prepareSlideshow() {
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id", "slideshow")
    var preview = document.createElement("img");
    preview.setAttribute("id", "preview");
    preview.setAttribute("src", "images/slideshow.gif");
    preview.setAttribute("alt", "Jay Skript slideshow");
    slideshow.appendChild(preview);
    var intro = document.getElementById("intro");
    insertAfter(slideshow, intro);
    var links = intro.getElementsByTagName("a");
    var destination;
    for (var i = 0; i < links.length; i++) {
        link[i].onmouseover = function () {
            destination = this.getAttribute("href");
            if (destination.indexOf("index.html") != -1) {
                moveElement("preview", 0, 0, 5);
            }
            if (destination.indexOf("about.html") != -1) {
                moveElement("preview", 0, -150, 5);
            }
            if (destination.indexOf("photos.html") != -1) {
                moveElement("preview", 0, -300, 5);
            }
            if (destination.indexOf("live.html") != -1) {
                moveElement("preview", 0, -450, 5);
            }
            if (destination.indexOf("contact.html") != -1) {
                moveElement("preview", 0, -600, 5);
            }
        }
    }
}
addLoadEvent(prepareSlideshow);