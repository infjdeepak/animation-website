let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  controller = new ScrollMagic.Controller();
  const sliders = document.querySelectorAll(".slide");
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.InOut" },
    });
    slideTl.fromTo(revealImg, { x: "0" }, { x: "100%" });
    slideTl.fromTo(img, { scale: "1.6" }, { scale: "1" }, "-=1");
    slideTl.fromTo(revealText, { x: "0" }, { x: "100%" }, "-=0.8");
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addTo(controller);
    //another animation
    let nextSlide = slides.index - 1 === index ? "end" : slides[index + 1];
    const pageTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.InOut" },
    });
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(
      slide,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0.5 },
      "-=1"
    );
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}
const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}
function cursorActive(e) {
  const item = e.target;
  if (item.classList.contains("logo") || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    mouseText.innerText = "Tap";
    //GSap
    gsap.to(".title-swipe", 1, { y: "-100%" });
  } else {
    mouse.classList.remove("explore-active");
    mouseText.innerText = "";
    //GSap
    gsap.to(".title-swipe", 1, { y: "0%" });
  }
}
function navToggle(e) {
  if (!burger.classList.contains("active")) {
    burger.classList.add("active");

    gsap.to(".logo", 1, { color: "black" });
    gsap.to(".line1", 0.5, { rotate: 45, y: "172%", background: "black" });
    gsap.to(".line2", 0.5, { rotate: -45, y: "-172%", background: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(200rem at 100% -40%)" });
    gsap.to(".cursor", 0.5, { borderColor: "black", zIndex: 1 });
    document.body.classList.add("hide");
  } else {
    burger.classList.remove("active");

    gsap.to(".logo", 1, { color: "whitesmoke" });
    gsap.to(".line1", 0.5, { rotate: 0, y: "0%", background: "whitesmoke" });
    gsap.to(".line2", 0.5, { rotate: 0, y: "0%", background: "whitesmoke" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2rem at 100% -40%)" });
    gsap.to(".cursor", 0.5, { borderColor: "Whitesmoke", zIndex: 0 });
    document.body.classList.remove("hide");
  }
}
//fashion page animation
function animateFashion() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");

  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.OutIn" },
    });

    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=0.5");
    slideTl.fromTo(nextImg, { x: "40%" }, { x: "0%" }, "-=0.5");
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addTo(controller);
  });
}
//barba js for page transition
const logo = document.querySelector(".logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        logo.href = "./";
        animateSlides();
      },
      beforeLeave() {
        controller.destroy();
        pageScene.destroy();
        slideScene.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../";
        window.scroll(0, 0);
        animateFashion();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      // name: "opacity-transition",
      leave(data) {
        const done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.OutIn" } });
        tl.to(data.current.container, 1, {
          opacity: 0,
        });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter(data) {
        const done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.OutIn" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.3, onComplete: done },
          "-=0.5"
        );
        tl.from(data.next.container, 1, {
          opacity: 0,
        });
        tl.fromTo(".nav-header", { y: "-100" }, { y: "0%" }, "-=1.5");
      },
    },
  ],
});
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", cursorActive);
burger.addEventListener("click", navToggle);
