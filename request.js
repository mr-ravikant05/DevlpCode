const planData = {
  starter: {
    title: "Starter Plan",
    price: "₹4,999",
    support: "Basic support included",
    delivery: "Fast turnaround",
    bestFor: "Simple startup or personal site"
  },
  popular: {
    title: "Popular Plan",
    price: "₹9,999",
    support: "Priority support included",
    delivery: "Balanced delivery time",
    bestFor: "Growing business website"
  },
  pro: {
    title: "Pro Plan",
    price: "₹14,999",
    support: "Advanced support included",
    delivery: "Premium custom process",
    bestFor: "High-converting professional project"
  }
};

function getPlanFromURL() {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  return planData[plan] ? plan : "starter";
}

function updateSummaryCard() {
  const selectedPlan = getPlanFromURL();
  const data = planData[selectedPlan];

  document.getElementById("planTitle").textContent = data.title;
  document.getElementById("planPrice").textContent = data.price;
  document.getElementById("planSupport").textContent = data.support;
  document.getElementById("planDelivery").textContent = data.delivery;
  document.getElementById("planBestFor").textContent = data.bestFor;
}

function showError(input, message) {
  const formGroup = input.closest(".form-group") || input.closest(".terms-box");
  if (!formGroup) return;

  const errorEl = formGroup.querySelector(".error");
  if (errorEl) {
    errorEl.textContent = message;
  }

  input.classList.add("input-error");
}

function clearError(input) {
  const formGroup = input.closest(".form-group") || input.closest(".terms-box");
  if (!formGroup) return;

  const errorEl = formGroup.querySelector(".error");
  if (errorEl) {
    errorEl.textContent = "";
  }

  input.classList.remove("input-error");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePhone(phone) {
  return /^[0-9+\-\s()]{10,15}$/.test(phone.trim());
}

function validateForm() {
  let isValid = true;

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const projectType = document.getElementById("projectType");
  const design = document.getElementById("design");
  const timeline = document.getElementById("timeline");
  const pagesNeeded = document.getElementById("pagesNeeded");
  const details = document.getElementById("details");
  const contactMethod = document.getElementById("contactMethod");
  const terms = document.getElementById("terms");

  const fields = [
    fullName,
    email,
    phone,
    projectType,
    design,
    timeline,
    pagesNeeded,
    details,
    contactMethod
  ];

  fields.forEach((field) => {
    if (field) clearError(field);
  });

  if (terms) clearError(terms);

  if (!fullName || fullName.value.trim() === "") {
    showError(fullName, "Please enter your full name.");
    isValid = false;
  }

  if (!email || email.value.trim() === "") {
    showError(email, "Please enter your email address.");
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!phone || phone.value.trim() === "") {
    showError(phone, "Please enter your phone number.");
    isValid = false;
  } else if (!validatePhone(phone.value)) {
    showError(phone, "Please enter a valid phone number.");
    isValid = false;
  }

  if (!projectType || projectType.value === "") {
    showError(projectType, "Please select a project type.");
    isValid = false;
  }

  if (!design || design.value === "") {
    showError(design, "Please select a design style.");
    isValid = false;
  }

  if (!timeline || timeline.value === "") {
    showError(timeline, "Please select a timeline.");
    isValid = false;
  }

  if (!pagesNeeded || pagesNeeded.value === "" || Number(pagesNeeded.value) < 1) {
    showError(pagesNeeded, "Please enter at least 1 page.");
    isValid = false;
  }

  if (!details || details.value.trim().length < 20) {
    showError(details, "Please describe your project in at least 20 characters.");
    isValid = false;
  }

  if (!contactMethod || contactMethod.value === "") {
    showError(contactMethod, "Please choose a preferred contact method.");
    isValid = false;
  }

  if (!terms || !terms.checked) {
    showError(terms, "You must agree before submitting.");
    isValid = false;
  }

  return isValid;
}

document.addEventListener("DOMContentLoaded", () => {
  updateSummaryCard();

  const form = document.getElementById("projectForm");
  const successMessage = document.getElementById("successMessage");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      if (successMessage) successMessage.style.display = "none";
      return;
    }

    const selectedPlan = getPlanFromURL();
    const data = planData[selectedPlan];

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const businessName = document.getElementById("businessName");
    const projectType = document.getElementById("projectType");
    const design = document.getElementById("design");
    const timeline = document.getElementById("timeline");
    const pagesNeeded = document.getElementById("pagesNeeded");
    const details = document.getElementById("details");
    const contactMethod = document.getElementById("contactMethod");

    const features = [...document.querySelectorAll('input[name="features"]:checked')].map(
      (item) => item.value
    );

    if (!window.db || !window.collection || !window.addDoc) {
      if (successMessage) {
        successMessage.style.display = "block";
        successMessage.textContent = "Firebase is not connected yet. Please check your Firebase script.";
      }
      return;
    }

    try {
      await window.addDoc(window.collection(window.db, "projectRequests"), {
        fullName: fullName ? fullName.value.trim() : "",
        email: email ? email.value.trim() : "",
        phone: phone ? phone.value.trim() : "",
        businessName: businessName ? businessName.value.trim() : "",
        projectType: projectType ? projectType.value.trim() : "",
        design: design ? design.value.trim() : "",
        timeline: timeline ? timeline.value.trim() : "",
        pagesNeeded: pagesNeeded ? pagesNeeded.value.trim() : "",
        details: details ? details.value.trim() : "",
        features: features,
        contactMethod: contactMethod ? contactMethod.value.trim() : "",
        selectedPlan: selectedPlan,
        planTitle: data.title,
        planPrice: data.price,
        planSupport: data.support,
        planDelivery: data.delivery,
        planBestFor: data.bestFor,
        createdAt: new Date().toISOString()
      });

      if (successMessage) {
        successMessage.style.display = "block";
        successMessage.textContent = `Your project request for the ${data.title} has been submitted successfully. Redirecting to home page...`;
      }

      form.reset();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      console.error("Firebase save error:", error);

      if (successMessage) {
        successMessage.style.display = "block";
        successMessage.textContent = "Something went wrong while sending your request. Please try again.";
      }
    }
  });

  const allInputs = document.querySelectorAll("input, select, textarea");
  allInputs.forEach((input) => {
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
  });
});
