// toggle icon navbar
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

// scroll sections
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 100;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      //active navbar links
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
      // active section for animation on scroll
      sec.classList.add("show-animate");
    }
    // if want to use animation repeats on scroll use this
  });

  // sticky header
  let header = document.querySelector("header");

  header.classList.toggle("sticky", window.scrollY > 100);

  //remove toggle icon and navbar when click links scroll
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");

  // animation footer scroll
  let footer = document.querySelector("footer");

  footer.classList.toggle(
    "show-animate",
    this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight
  );
};

function openResume() {
  window.open("assets/document/resume.pdf", "_blank");
}

// Define function to send email
function sendEmail() {
  // Get form data
  const name = document.querySelector('input[name="name"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const mobile = document.querySelector('input[name="mobile"]').value;
  const subject = document.querySelector('input[name="subject"]').value;
  const message = document.querySelector('textarea[name="message"]').value;

  // Check if all fields are not empty
  if (
    name !== "" &&
    email !== "" &&
    mobile !== "" &&
    subject !== "" &&
    message !== ""
  ) {
    // Construct email body
    const body = `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nSubject: ${subject}\nMessage: ${message}`;

    // Send email using email client
    window.location.href = `mailto:rohitsainier@gmail.com?subject=${subject}&body=${body}`;

    // Display success message
    const successMessage = document.querySelector(".success-message");
    successMessage.style.display = "block";
  } else {
    // Display error message or perform any other action
    alert("Please fill in all the fields before submitting.");
  }
}
