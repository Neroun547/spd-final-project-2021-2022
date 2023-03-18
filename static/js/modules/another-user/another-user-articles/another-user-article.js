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

const commentsForm = createElement(document.querySelector(".content__block"), "form", { class: "form__comments" });
const commentsFormInput = createElement(commentsForm, "textarea", { placeholder: "Write comment:" });
const commentsFormButton = createElement(commentsForm, "button", { type: "submit" });

commentsFormButton.innerHTML = "Add comment";

const wrapperComments = createElement(document.querySelector(".content__block"), "div", { class: "wrapper__comments" });

