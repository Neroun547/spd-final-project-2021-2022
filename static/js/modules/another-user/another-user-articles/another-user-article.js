import { createElement } from "../../../common/create-element.js";

const link = createElement(
    document.querySelector(".content__block"),
    "a",
    { href: "/user/articles/back/" + window.location.pathname.replace("/user/articles/article/", "")});


link.innerHTML = "←";
link.style.position = "absolute";
link.style.top = "-15px";
link.style.left = "20px";
link.style.fontSize = "45px";
