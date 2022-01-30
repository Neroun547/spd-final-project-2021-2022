const wrapperNavBurgerMenuBtn = document.querySelector(".wrapper__nav-burger-btn");

wrapperNavBurgerMenuBtn.addEventListener("click", function () {
    const burgerBtnDecoration1 = this.querySelector(".burger__btn-decoration-1");
    const burgerBtnDecoration2 = this.querySelector(".burger__btn-decoration-2");
    const burgerBtnDecoration3 = this.querySelector(".burger__btn-decoration-3");

    burgerBtnDecoration2.classList.toggle("burger__btn-decoration-2-hide"); 

    burgerBtnDecoration1.classList.toggle("burger__btn-decoration-1-active");
    burgerBtnDecoration3.classList.toggle("burger__btn-decoration-3-active");

    const navBar = document.querySelector(".nav");
    navBar.classList.remove("nav-center");
    
    if(!navBar.style.left || navBar.style.left === "-100%") {
        let navLeft = -100;
        setInterval(function () {

            if(navLeft === 0) {
                this.clearInterval();
                return;
            }
            navLeft += 10;
            navBar.style.left = navLeft + "%";  
        }, 20);

        return;
    }

    let navLeft = 0;
    setInterval(function () {

        if(navLeft === -100) {
            this.clearInterval();
            return;
        }
        navLeft -= 10;
        navBar.style.left = navLeft + "%";  
    }, 20);

    return;
});
