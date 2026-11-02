(function () {
  // ---- CONFIG -------------------------------------------------------------
  // To send submissions to the same Google Form responses sheet:
  //  1. Open the form > ⋮ menu > "Get pre-filled link", fill every field with
  //     any value, click "Get link", paste it somewhere. It contains
  //     entry.1234567890=... for each question.
  //  2. Set ACTION to the form URL with /viewform changed to /formResponse.
  //  3. Put each entry.NNNN into FIELDS below. Dropdown option text must match
  //     the Google Form's choices exactly.
  // Leave ACTION empty and the form opens the visitor's email app instead.
  var CONFIG = {
    ACTION: "", // https://docs.google.com/forms/d/e/1FAIpQLSej5MBvX8LgdzPBFSJ7jMf0qSQ5l0LnetZzcSr9eI56jwyXSQ/formResponse
    FIELDS: {
      name: "",
      phone: "",
      email: "",
      town: "",
      type: "",
      details: "",
      timing: "",
    },
    EMAIL: "mylesfinley81@gmail.com",
  };
  // -------------------------------------------------------------------------

  var form = document.getElementById("jb-form");
  var status = document.getElementById("jb-status");
  if (!form) return;

  function say(msg) {
    status.textContent = msg;
    status.classList.add("jb-visible");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var d = {},
      labels = {
        name: "Name",
        phone: "Phone",
        email: "Email",
        town: "Pickup town/ZIP",
        type: "Type",
        details: "Items",
        timing: "Timing",
      };
    Object.keys(labels).forEach(function (k) {
      d[k] = (form.elements[k].value || "").trim();
    });

    if (form.elements.website.value) {
      form.reset();
      say("Thanks! We'll be in touch.");
      return;
    } // bot trap

    var configured =
      CONFIG.ACTION &&
      Object.keys(CONFIG.FIELDS).every(function (k) {
        return k === "email" || k === "timing" || CONFIG.FIELDS[k];
      });

    if (configured) {
      var body = new URLSearchParams();
      Object.keys(CONFIG.FIELDS).forEach(function (k) {
        if (CONFIG.FIELDS[k] && d[k]) body.append(CONFIG.FIELDS[k], d[k]);
      });
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      fetch(CONFIG.ACTION, {
        method: "POST",
        mode: "no-cors",
        body: body,
      })
        .then(function () {
          form.reset();
          say(
            "Thanks! Your request was sent. We'll reply with an upfront estimate.",
          );
        })
        .catch(function () {
          say(
            "Something went wrong. Please call (678) 908-6641 or email " +
              CONFIG.EMAIL +
              ".",
          );
        })
        .then(function () {
          btn.disabled = false;
        });
    } else {
      var lines = Object.keys(labels)
        .map(function (k) {
          return labels[k] + ": " + d[k];
        })
        .join("\n");
      window.location.href =
        "mailto:" +
        CONFIG.EMAIL +
        "?subject=" +
        encodeURIComponent("Free quote request") +
        "&body=" +
        encodeURIComponent(lines);
      say(
        "Opening your email app. If nothing opens, call (678) 908-6641 or email " +
          CONFIG.EMAIL +
          ".",
      );
    }
  });
  // Mobile nav toggle
  var hamburger = document.querySelector('.jb-hamburger');
  var mainNav = document.querySelector('.jb-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('jb-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    var allNavLinks = mainNav.querySelectorAll('.jb-nav-link, .jb-nav-cta');
    for (var i = 0; i < allNavLinks.length; i++) {
      allNavLinks[i].addEventListener('click', function () {
        mainNav.classList.remove('jb-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    }
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target)) {
        mainNav.classList.remove('jb-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
