const loader = document.getElementById("loader");
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.style.display = "none"; // اخفاء الـ spinner
});
const titleEl = document.getElementById("hero-title-text");
const textEl = document.getElementById("hero-text");

const texts = [
  { title: "Elsayed", text: "elsamanody" },
  { title: "Front-End", text: "Developer" },
];

let current = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(el, text, speed = 150) {
  el.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.classList.add("char");
    span.textContent = text[i];
    el.appendChild(span);

    // force reflow for transition
    void span.offsetWidth;
    span.classList.add("show");

    await sleep(speed);
  }
}

async function deleteText(el, speed = 200) {
  const chars = Array.from(el.querySelectorAll(".char"));
  for (let i = chars.length - 1; i >= 0; i--) {
    chars[i].classList.remove("show");
    await sleep(speed);
  }
  await sleep(100);
  el.innerHTML = "";
}

async function animateHero() {
  while (true) {
    await typeText(titleEl, texts[current].title);
    await typeText(textEl, texts[current].text);

    await sleep(1500);

    await deleteText(textEl, 100);
    await deleteText(titleEl, 100);

    current = (current + 1) % texts.length;
  }
}

animateHero();

// -------- Notyf Initialization --------
const notyf = new Notyf();

// -------- CV Download --------
const downloadBtn = document.getElementById("downloadBtn");
const filenameInput = document.getElementById("filenameInput");

function downloadFile() {
  const filename = filenameInput.value.trim() || "My_Resume";
  const link = document.createElement("a");
  link.href = "./cv.pdf"; // check the file in the path
  link.download = filename + ".pdf";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // close modal after download
  const cvModalEl = document.getElementById("cvModal");
  const cvModal = bootstrap.Modal.getInstance(cvModalEl);
  if (cvModal) cvModal.hide();
}

// addEventListener
downloadBtn.addEventListener("click", downloadFile);
filenameInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    downloadFile();
  }
});

const form = document.getElementById("contact-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form["name"].value,
    email: form["email"].value,
    message: form["Message"].value,
  };

  try {
    const res = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log(result);

    if (result.success) {
      notyf.success("Message sent successfully!");
      form.reset();
    } else {
      notyf.error("Failed to send message.");
    }
  } catch (err) {
    console.error(err);
    notyf.error("Error sending message.");
  }
});

/// ===== Progress Bars =====
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll(".progress-bar-custom");

  if (bars.length === 0) return;

  bars.forEach((bar) => {
    bar.style.width = "0%"; // start

    const percent = parseInt(bar.dataset.percent || "0", 10);

    //
    const percentLabel = bar.closest(".skil").querySelector(".percent-label");

    // bar
    gsap.to(bar, {
      width: percent + "%",
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: bar,
        start: "top 80%",
        once: true,
      },
    });

    // numper
    if (percentLabel) {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: percent,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bar,
          start: "top 80%",
          once: true,
        },
        onUpdate: () => {
          percentLabel.textContent = Math.round(obj.value) + "%";
        },
      });
    }
  });
});
