/* Portfolio interactivity: nav, reveal-on-scroll, ID card flip,
   periodic table, achievements strip, mobile menu. */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---- footer year ---- */
  $("#year").textContent = new Date().getFullYear();

  /* ---- mobile menu ---- */
  var menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("a", navLinks).forEach(function (a) {
    a.addEventListener("click", function () { navLinks.classList.remove("open"); });
  });

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- active nav link ---- */
  var sections = ["about", "skills", "work", "learning", "experience", "achievements", "contact"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  var links = $$(".nav-links a");
  var navIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { navIo.observe(s); });

  /* ---- ID card 3D flip ---- */
  var idcard = $("#idcard");
  if (idcard) {
    idcard.addEventListener("click", function () {
      idcard.classList.toggle("flipped");
    });
  }

  /* ---- achievements horizontal strip ---- */
  var strip = $("#achStrip");
  if (strip) {
    var cardStep = function () {
      var card = strip.querySelector(".ach-card");
      return card ? card.offsetWidth + 16 : 260;
    };
    $("#stripPrev").addEventListener("click", function () {
      strip.scrollBy({ left: -cardStep(), behavior: "smooth" });
    });
    $("#stripNext").addEventListener("click", function () {
      strip.scrollBy({ left: cardStep(), behavior: "smooth" });
    });
  }

  /* ---- periodic table of stack ----
     sym: element symbol · n: atomic-number-style index · cat: category */
  var ELEMENTS = [
    { sym: "Ja", num: 1,  name: "Java",        cat: "Languages", d: "My first love and still my daily driver. Spring ecosystem, concurrency, the whole JVM." },
    { sym: "Ts", num: 2,  name: "TypeScript",  cat: "Languages", d: "Types save lives. Used across Angular frontends and Node tooling." },
    { sym: "Py", num: 3,  name: "Python",      cat: "Languages", d: "FastAPI backends, automation scripts, and the glue of my homelab." },
    { sym: "Da", num: 4,  name: "Dart",        cat: "Languages", d: "Flutter's language — powers MacroPrep and playHz on mobile." },
    { sym: "An", num: 5,  name: "Angular",     cat: "Frontend",  d: "Reusable components, lazy loading, routing. Built SAP Ariba sourcing UIs on it." },
    { sym: "Re", num: 6,  name: "React",       cat: "Frontend",  d: "Component thinking that carried straight into Flutter and modern web work." },
    { sym: "Fl", num: 7,  name: "Flutter",     cat: "Frontend",  d: "My mobile stack of choice — two Play Store apps and counting." },
    { sym: "Ht", num: 8,  name: "HTML/CSS",    cat: "Frontend",  d: "This very page. Hand-written, no frameworks, responsive down to iPhone Safari." },
    { sym: "Sb", num: 9,  name: "Spring Boot", cat: "Backend",   d: "Microservices, DI, auto-configuration. The backbone of my enterprise work." },
    { sym: "Sc", num: 10, name: "Spring Cloud",cat: "Backend",   d: "Bus-driven eventing and distributed config on the Mastercard RTP platform." },
    { sym: "No", num: 11, name: "Node.js",     cat: "Backend",   d: "Tooling, scripts, and lightweight services around the homelab." },
    { sym: "Gq", num: 12, name: "GraphQL",     cat: "Backend",   d: "Designed GraphQL APIs for SAP's optimization workbench bid analytics." },
    { sym: "Pg", num: 13, name: "PostgreSQL",  cat: "Data",      d: "My default database — homelab Postgres backs half my services." },
    { sym: "Mo", num: 14, name: "MongoDB",     cat: "Data",      d: "Document modeling where relational is overkill." },
    { sym: "Or", num: 15, name: "Oracle",      cat: "Data",      d: "Enterprise-grade persistence on the payments platform." },
    { sym: "Hn", num: 16, name: "SAP HANA",    cat: "Data",      d: "In-memory analytics backing SAP Ariba sourcing workloads." },
    { sym: "Ka", num: 17, name: "Kafka",       cat: "Messaging", d: "Real-time threshold streams and billing ingestion pipelines." },
    { sym: "Rm", num: 18, name: "RabbitMQ",    cat: "Messaging", d: "Reliable async messaging in the liquidity system." },
    { sym: "Do", num: 19, name: "Docker",      cat: "DevOps",    d: "Everything I ship is containerized — CI builds every image." },
    { sym: "Ku", num: 20, name: "Kubernetes",  cat: "DevOps",    d: "My k3s home server: 12+ services, GitOps-ish manifests, zero public exposure." },
    { sym: "Nx", num: 21, name: "Nginx",       cat: "DevOps",    d: "Serving this site and half my stack, with Traefik at the edge." },
    { sym: "Aw", num: 22, name: "AWS",         cat: "DevOps",    d: "S3 restic backups, plus cloud billing work across AWS/Azure/GCP." },
    { sym: "Gi", num: 23, name: "Git",         cat: "DevOps",    d: "Branch + PR for everything. Never push to main. Ever." },
    { sym: "Jn", num: 24, name: "CI/CD",       cat: "DevOps",    d: "GitHub Actions building arm64 images on every merge — this site included." }
  ];

  var ptable = $("#ptable"), detail = $("#ptableDetail");
  var current = null;

  function showDetail(el) {
    if (current) current.setAttribute("aria-pressed", "false");
    current = el;
    el.setAttribute("aria-pressed", "true");
    detail.innerHTML = "<h3>" + el._name + " <span class='sym-inline'>(" + el._sym + ")</span>" +
      "<span class='cat'>" + el._cat + "</span></h3><p>" + el._desc + "</p>";
  }

  ELEMENTS.forEach(function (e) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pelem";
    b.setAttribute("role", "listitem");
    b.setAttribute("aria-pressed", "false");
    b._name = e.name; b._sym = e.sym; b._cat = e.cat; b._desc = e.d;
    b.innerHTML = '<span class="num">' + e.num + '</span>' +
      '<span class="sym">' + e.sym + "</span>" +
      '<span class="nm">' + e.name + "</span>";
    b.addEventListener("click", function () { showDetail(b); });
    b.addEventListener("mouseenter", function () { showDetail(b); });
    ptable.appendChild(b);
  });
})();
