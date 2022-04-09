export const createElement = (parent, tag, attr, beforeElement) => {
    const el = document.createElement(tag);

    if(attr){
        for(let key in attr) {
            el.setAttribute(key, attr[key]);
        }
    }

    if(beforeElement){
        parent.insertBefore(el, beforeElement);
        return el;
    }

    parent.appendChild(el);

    return el;
};
