const isRequired = document.querySelectorAll('label[for="isRequired"]');

isRequired.forEach((label) =>
  label.addEventListener("click", (e) => {
    var input = e.target.parentNode.querySelector("input");
    console.log(input);
    input.click();
  })
);
