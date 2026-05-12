const elements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.05,
  rootMargin: "0px 0px -100px 0px"
});

elements.forEach(el => observer.observe(el));

function toggleMenu() {
    document.querySelector('.mobile-menu').classList.toggle('active');
    document.querySelector('.menu-overlay').classList.toggle('active');
    document.body.classList.toggle('menu-open');
    document.querySelector('.menu-toggle').classList.toggle('active');
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
    });
});

const backToTopButton = document.createElement("button");
backToTopButton.textContent = "Back to Top";
backToTopButton.className = "back-to-top";
backToTopButton.style.position = "fixed";
backToTopButton.style.bottom = "20px";
backToTopButton.style.right = "20px";
backToTopButton.style.padding = "10px 15px";
backToTopButton.style.display = "none";

document.body.appendChild(backToTopButton);

backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
});

function togglePROJECTS(header) {
    const dropdown = header.parentElement.querySelector(".faq-content");
    const button = header.querySelector(".chevron");

    if (dropdown.style.maxHeight) {
        dropdown.style.maxHeight = null;
        button.textContent = "+";
    } else {
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        button.textContent = "−";
    }
}

const projectCards = document.querySelectorAll(".projects-card");

projectCards.forEach(card => {
  card.addEventListener("click", () => {

    projectCards.forEach(c => {
      if (c !== card) {
        c.classList.remove("active");
      }
    });

    card.classList.toggle("active");
  });
});

const form = document.getElementById("contact-form");

const fields = ["name", "email", "phone", "message"];

fields.forEach(id => {
    const field = document.getElementById(id);

    field.addEventListener("input", () => validateField(id));
    field.addEventListener("blur", () => validateField(id));
});

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    let errorMessage = "";

    if (value === "") {
        displayFieldState(fieldId, "");
        return false;
    }

    if (fieldId === "name") {
        if (value.length < 2) errorMessage = "Enter a valid name";
    }

    if (fieldId === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            errorMessage = "Enter a valid email";
        }
    }

    if (fieldId === "phone") {
        const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;

        if (!phoneRegex.test(value)) {
            errorMessage = "Enter a valid phone number";
        }
    }

    if (fieldId === "message") {
        if (value.length < 10) {
            errorMessage = "Minimum 10 characters required";
        }
    }

    displayFieldState(fieldId, errorMessage);

    return errorMessage === "";
}


function displayFieldState(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    let errorEl = document.getElementById(fieldId + "-error");

    if (!errorEl) {
        errorEl = document.createElement("span");
        errorEl.id = fieldId + "-error";
        errorEl.className = "field-error";
        field.parentNode.insertBefore(errorEl, field.nextSibling);
    }

    if (errorMessage) {
        field.classList.add("field-invalid");
        field.classList.remove("field-valid");
        errorEl.textContent = errorMessage;
        errorEl.style.display = "block";
    } else if (field.value.trim() !== "") {
        field.classList.remove("field-invalid");
        field.classList.add("field-valid");
        errorEl.style.display = "none";
    } else {
        field.classList.remove("field-invalid", "field-valid");
        errorEl.style.display = "none";
    }
}
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const isValid =
        validateField("name") &&
        validateField("email") &&
        validateField("phone") &&
        validateField("message");

    if (!isValid) return;

    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    const btn = document.getElementById("contact-button");
    btn.disabled = true;
    btn.textContent = "Sending\u2026";

    try {

        await emailjs.send(
            "service_nvj3hw8",
            "template_795bpag",
            formData
        );

        form.reset();
        fields.forEach(id => {
            const f = document.getElementById(id);
            f.classList.remove("field-valid", "field-invalid");
            const err = document.getElementById(id + "-error");
            if (err) err.style.display = "none";
        });

        document.querySelector(".form form").style.display = "none";
        document.getElementById("form-success").style.display = "flex";

        btn.disabled = false;
        btn.textContent = "Submit";

    } catch (error) {

        console.error(error);
        btn.disabled = false;
        btn.textContent = "Submit";

        const errDiv = document.getElementById("form-send-error");
        if (errDiv) {
            errDiv.style.display = "block";
            setTimeout(() => { errDiv.style.display = "none"; }, 5000);
        }
    }
});
