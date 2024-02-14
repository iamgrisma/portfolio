// Smooth scrolling
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a");

  for (const link of links) {
    link.addEventListener("click", clickHandler);
  }

  function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
      top: offsetTop,
      behavior: "smooth",
    });
  }
});

// Hover animation for grid items
const gridItems = document.querySelectorAll(".grid-item");

gridItems.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    const overlay = this.querySelector(".grid-item-overlay");
    overlay.style.opacity = 1;
  });

  item.addEventListener("mouseleave", function () {
    const overlay = this.querySelector(".grid-item-overlay");
    overlay.style.opacity = 0;
  });
});
const currentYear = new Date().getFullYear();
const yearSpan = document.querySelector("#currentYear");
yearSpan.textContent = currentYear;
