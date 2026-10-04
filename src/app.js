/* Portfolio interactivity: nav, reveal-on-scroll, watermark parallax,
   ID card flip, periodic table + family filters, work panels,
   learning rows, journey timeline, achievements strip, mobile menu. */
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

  /* ---- watermark parallax ---- */
  var wm = $("#watermark");
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        wm.style.transform = "translate(-50%, calc(-50% + " + (y * 0.12) + "px))";
      }
      ticking = false;
    });
  }, { passive: true });

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
     Six families like the reel: Languages, Frontend, Backend, Databases, Tools, Core. */
  var FAMILIES = ["Languages", "Frontend", "Backend", "Databases", "Tools", "Core"];
  var ELEMENTS = [
    { sym: "Ja", num: 1,  name: "Java",          cat: "Languages", d: "My first love and still my daily driver. Spring ecosystem, concurrency, the whole JVM." },
    { sym: "Ts", num: 2,  name: "TypeScript",    cat: "Languages", d: "Types save lives. Angular frontends, Node tooling, and everything in between." },
    { sym: "Py", num: 3,  name: "Python",        cat: "Languages", d: "FastAPI backends, automation scripts, and the glue of my homelab." },
    { sym: "Da", num: 4,  name: "Dart",          cat: "Languages", d: "Flutter's language — powers MacroPrep and playHz on mobile." },
    { sym: "Sq", num: 5,  name: "SQL",           cat: "Languages", d: "From tuned settlement queries at Jamcracker to homelab Postgres." },
    { sym: "An", num: 6,  name: "Angular",       cat: "Frontend",  d: "Reusable components, lazy loading, routing. Built SAP Ariba sourcing UIs on it." },
    { sym: "Re", num: 7,  name: "React",         cat: "Frontend",  d: "Component thinking that carried straight into Flutter and modern web work." },
    { sym: "Fl", num: 8,  name: "Flutter",       cat: "Frontend",  d: "My mobile stack of choice — two Play Store apps and counting." },
    { sym: "Ht", num: 9,  name: "HTML/CSS",      cat: "Frontend",  d: "This very page. Hand-written, no frameworks, responsive down to iPhone Safari." },
    { sym: "Sb", num: 10, name: "Spring Boot",   cat: "Backend",   d: "Microservices, DI, auto-configuration. The backbone of my enterprise work." },
    { sym: "Sc", num: 11, name: "Spring Cloud",  cat: "Backend",   d: "Bus-driven eventing and distributed config on the Mastercard RTP platform." },
    { sym: "No", num: 12, name: "Node.js",       cat: "Backend",   d: "Tooling, scripts, and lightweight services around the homelab." },
    { sym: "Gq", num: 13, name: "GraphQL",       cat: "Backend",   d: "Designed GraphQL APIs for SAP's optimization workbench bid analytics." },
    { sym: "Pg", num: 14, name: "PostgreSQL",    cat: "Databases", d: "My default database — homelab Postgres backs half my services." },
    { sym: "Mo", num: 15, name: "MongoDB",       cat: "Databases", d: "Document modeling where relational is overkill." },
    { sym: "Or", num: 16, name: "Oracle",        cat: "Databases", d: "Enterprise-grade persistence on the payments platform." },
    { sym: "Hn", num: 17, name: "SAP HANA",      cat: "Databases", d: "In-memory analytics backing SAP Ariba sourcing workloads." },
    { sym: "Do", num: 18, name: "Docker",        cat: "Tools",     d: "Everything I ship is containerized — CI builds every image." },
    { sym: "Ku", num: 19, name: "Kubernetes",    cat: "Tools",     d: "My k3s home server: 12+ services, manifests in git, zero public exposure." },
    { sym: "Gi", num: 20, name: "Git",           cat: "Tools",     d: "Branch + PR for everything. Never push to main. Ever." },
    { sym: "Nx", num: 21, name: "Nginx",         cat: "Tools",     d: "Serving this site and half my stack, with Traefik at the edge." },
    { sym: "Ka", num: 22, name: "Kafka",         cat: "Core",      d: "Real-time threshold streams and billing ingestion pipelines." },
    { sym: "Rm", num: 23, name: "RabbitMQ",      cat: "Core",      d: "Reliable async messaging in the liquidity system." },
    { sym: "Aw", num: 24, name: "AWS",           cat: "Core",      d: "S3 restic backups, plus cloud billing work across AWS, Azure and GCP." },
    { sym: "Sd", num: 25, name: "System Design", cat: "Core",      d: "Distributed systems thinking — from RTP liquidity to homelab topology." },
    { sym: "Ms", num: 26, name: "Microservices",cat: "Core",      d: "Decomposed, independently deployable services — the enterprise bread and butter." }
  ];

  var ptabs = $("#ptabs"), ptable = $("#ptable"), detail = $("#ptableDetail");
  var activeFamily = "All", pressed = null;

  function showDetail(name, sym, cat, desc) {
    detail.innerHTML = '<span class="d-sym">' + sym + "</span>" +
      "<h3>" + name + "</h3>" +
      '<span class="d-cat">' + cat + "</span><p>" + desc + "</p>";
  }

  function paintTiles() {
    $$(".pelem", ptable).forEach(function (b) {
      var lit = activeFamily === "All" || b._cat === activeFamily;
      b.classList.toggle("lit", lit);
      b.classList.toggle("dim", !lit);
    });
  }

  ["All"].concat(FAMILIES).forEach(function (fam) {
    var t = document.createElement("button");
    t.type = "button";
    t.className = "ptab";
    t.setAttribute("role", "tab");
    t.setAttribute("aria-selected", fam === "All" ? "true" : "false");
    t.innerHTML = '<span class="sw" style="background:' +
      (fam === "All" ? "var(--ink)" : "var(--tile-dark)") + '"></span>' + fam;
    t.addEventListener("click", function () {
      activeFamily = fam;
      $$(".ptab", ptabs).forEach(function (x) {
        x.setAttribute("aria-selected", x === t ? "true" : "false");
      });
      paintTiles();
    });
    ptabs.appendChild(t);
  });

  ELEMENTS.forEach(function (e) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pelem lit";
    b.setAttribute("role", "listitem");
    b.setAttribute("aria-pressed", "false");
    b._cat = e.cat;
    b.innerHTML = '<span class="num">' + String(e.num).padStart(2, "0") + "</span>" +
      '<span class="sym">' + e.sym + "</span>" +
      '<span class="nm">' + e.name + "</span>";
    var pick = function () {
      if (pressed) pressed.setAttribute("aria-pressed", "false");
      pressed = b;
      b.setAttribute("aria-pressed", "true");
      showDetail(e.name, e.sym, e.cat, e.d);
    };
    b.addEventListener("click", pick);
    b.addEventListener("mouseenter", pick);
    ptable.appendChild(b);
  });
  showDetail(ELEMENTS[0].name, ELEMENTS[0].sym, ELEMENTS[0].cat, ELEMENTS[0].d);

  /* ---- work panels ---- */
  var PROJECTS = [
    { rail: "Mastercard RTP", tags: "AHEAD · Fintech", title: "Real-Time Payments — Liquidity System",
      desc: "Watermarking for the liquidity system of Mastercard's RTP platform: Kafka-driven real-time threshold updates, Spring Cloud Bus eventing, Caffeine caching, mTLS across microservices.",
      bullets: ["Real-time threshold streaming with Kafka", "Spring Cloud Bus event-driven communication", "Caffeine caching for low-latency reads", "mTLS across every microservice"],
      stack: ["Java", "Spring Boot", "Kafka", "Spring Cloud", "Oracle"], gh: null },
    { rail: "Home Server", tags: "Homelab", title: "Self-hosted k3s cluster",
      desc: "My own cluster on a headless Mac mini + Raspberry Pis: Jellyfin, Home Assistant, AdGuard, Postgres, Prometheus/Grafana, restic backups to S3 — all behind Tailscale, nothing public.",
      bullets: ["k3s on Mac mini + Pi workers", "Tailscale-only access, no public surface", "CI-built arm64 images via Docker Hub", "restic backups to S3"],
      stack: ["Kubernetes", "Docker", "Tailscale", "Traefik", "cert-manager"], gh: "https://github.com/prajwal-das/home-server" },
    { rail: "MacroPrep", tags: "Open source", title: "MacroPrep — macro-first meal prep",
      desc: "Macro-first meal-prep app with real Indian food data. Dry/cooked conversion, barcode scanning, EN + Hindi.",
      bullets: ["Flutter + FastAPI + SQLite", "Real Indian food database", "Barcode scanning, i18n EN + Hindi"],
      stack: ["Flutter", "FastAPI", "SQLite", "Docker"], gh: "https://github.com/prajwal-das/macroprep" },
    { rail: "playHz", tags: "Open source", title: "playHz — Jellyfin music player",
      desc: "Daily-driver Jellyfin music player for iOS: offline downloads, chapter support, background audio. ~14k lines of clean-architecture Dart.",
      bullets: ["Offline downloads + airplane-mode playback", "Background audio via audio_service", "Clean architecture, Riverpod 2.x"],
      stack: ["Flutter", "Riverpod", "just_audio"], gh: "https://github.com/prajwal-das/playHz" },
    { rail: "SAP Ariba", tags: "SAP", title: "Guided Sourcing — Cost Breakdown",
      desc: "JSON-driven Angular form framework and modular table components so buyers can capture supplier cost breakdowns inside sourcing events.",
      bullets: ["JSON-driven dynamic form framework", "Modular Angular table components", "REST APIs for form configuration"],
      stack: ["Angular", "Java", "Spring Boot", "SAP HANA"], gh: null },
    { rail: "SAP OWB", tags: "SAP", title: "Optimization Workbench",
      desc: "Microservice storing and analyzing supplier bid details; GraphQL APIs plus native Angular web elements for bid visualization across teams.",
      bullets: ["Bid storage, monitoring and comparison", "GraphQL APIs for bid analytics", "Native Angular 9 web elements"],
      stack: ["GraphQL", "Angular 9", "Spring Boot"], gh: null },
    { rail: "Feature Toggles", tags: "Open source", title: "Feature Toggle as a Service",
      desc: "Multi-tenant feature-flag service: Spring Boot auto-config library, annotation processing, JIRA integration, Postgres-backed per-tenant state.",
      bullets: ["Multi-tenancy per-tenant toggle state", "Spring Boot auto-configuration", "Annotation-processed toggle generation"],
      stack: ["Spring Boot", "PostgreSQL", "JIRA"], gh: "https://github.com/prajwal-das" },
    { rail: "Cloud Billing", tags: "Jamcracker", title: "Cloud Billing Platform",
      desc: "Ingestion and settlement for cloud billing across AWS, Azure, GCP and OpenStack — adaptor libraries, Kafka pipelines, tuned SQL for monthly invoices.",
      bullets: ["Multi-cloud billing ingestion", "Kafka streaming pipelines", "Tuned SQL for monthly settlement"],
      stack: ["Java", "Kafka", "SQL", "AWS", "Azure", "GCP"], gh: null },
    { rail: "ISRO", tags: "ISRO", title: "IRNSS Fleet Thermal Monitor",
      desc: "Java Swing application pulling real-time temperature telemetry from 7 navigation satellites, with charts and variation alerts.",
      bullets: ["Real-time telemetry from 7 satellites", "Time-vs-temperature charting", "Variation alert notifications"],
      stack: ["Java Swing", "Real-time telemetry"], gh: null },
    { rail: "curiouspace", tags: "Homelab", title: "Todo PWA · Media Uploader · Vedic Astro",
      desc: "A Linear-backed todo PWA, a Tailscale-only send-to-Jellyfin uploader, and a Vedic astrology app — all live on *.curiouspace.com, all CI-built, all mine.",
      bullets: ["No-backend Linear PWA", "Tailscale-only media uploader", "Docker Hub CI on every merge"],
      stack: ["Vanilla JS", "FastAPI", "Docker Hub CI"], gh: "https://github.com/prajwal-das/todo" },
    { rail: "Play Store", tags: "Personal", title: "Bible Songs · PipPlanet",
      desc: "Two Play Store releases: a Bible lyrics app with 4,000+ downloads, and PipPlanet, a minimalist endless mobile game.",
      bullets: ["4,000+ downloads", "Endless minimalist gameplay"],
      stack: ["Android", "Mobile"], gh: null }
  ];

  var panels = $("#panels");
  PROJECTS.forEach(function (p, i) {
    var art = document.createElement("article");
    art.className = "panel" + (i === 0 ? " open" : "");
    var head = document.createElement("button");
    head.type = "button";
    head.className = "panel-head";
    head.setAttribute("aria-expanded", i === 0 ? "true" : "false");
    head.innerHTML = '<span class="panel-rail">' + p.rail + "</span>" +
      '<span class="panel-num">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<span class="panel-title">' + p.title + "</span>" +
      '<span class="panel-tags">' + p.tags + "</span>" +
      '<span class="panel-plus" aria-hidden="true">+</span>';
    var body = document.createElement("div");
    body.className = "panel-body";
    body.innerHTML = "<p>" + p.desc + "</p>" +
      '<ul class="panel-bullets">' + p.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" +
      '<div class="panel-stack">' + p.stack.map(function (s) { return "<span>" + s + "</span>"; }).join("") + "</div>" +
      (p.gh ? '<a class="btn btn-small" href="' + p.gh + '" target="_blank" rel="noopener">View on GitHub &nearr;</a>' : "");
    head.addEventListener("click", function () {
      var isOpen = art.classList.contains("open");
      $$(".panel", panels).forEach(function (x) {
        x.classList.remove("open");
        $(".panel-head", x).setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        art.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
    art.appendChild(head);
    art.appendChild(body);
    panels.appendChild(art);
  });

  /* ---- always learning rows ---- */
  var LEARNING = [
    { name: "Kubernetes & k3s", org: "Homelab — nightly", tag: "Infra" },
    { name: "Flutter & Riverpod", org: "playHz — daily driver", tag: "Mobile" },
    { name: "FastAPI & SQLite", org: "MacroPrep backend", tag: "Backend" },
    { name: "React & Next.js", org: "Portfolio craft", tag: "Frontend" },
    { name: "System design", org: "Always", tag: "Core" }
  ];
  var learnRows = $("#learnRows");
  LEARNING.forEach(function (l, i) {
    var li = document.createElement("li");
    li.className = "learn-row" + (i === 0 ? " sel" : "");
    li.innerHTML = '<span class="learn-idx">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<span><span class="learn-name">' + l.name + "</span><br>" +
      '<span class="learn-org">' + l.org + "</span></span>" +
      '<span class="learn-tag">' + l.tag + "</span>";
    li.addEventListener("mouseenter", function () {
      $$(".learn-row", learnRows).forEach(function (x) { x.classList.remove("sel"); });
      li.classList.add("sel");
    });
    learnRows.appendChild(li);
  });

  /* ---- journey timeline ---- */
  var STOPS = [
    { year: "2011", kind: "Education", title: "BE, Computer Science",
      org: "Visvesvaraya Technological University",
      bullets: ["Foundations in systems, algorithms and software engineering."],
      chips: ["GPA 3.5"] },
    { year: "2015", kind: "Experience", title: "Intern — ISRO",
      org: "Bangalore",
      bullets: ["Built a Java Swing app monitoring temperature telemetry from 7 IRNSS satellites in real time."],
      chips: ["Java Swing", "Telemetry"] },
    { year: "2016", kind: "Experience", title: "Software Engineer — Jamcracker",
      org: "Bangalore",
      bullets: ["R&D on cloud billing services — invoices, payments and multi-cloud billing ingestion pipelines."],
      chips: ["Java", "Kafka"] },
    { year: "2018", kind: "Experience", title: "Software Engineer — SAP",
      org: "Bangalore",
      bullets: ["Full-stack on SAP Ariba Direct Spend: cost-breakdown sourcing UI in Angular.", "Optimization workbench microservice with GraphQL bid analytics."],
      chips: ["Angular", "Spring Boot", "GraphQL"] },
    { year: "2021", kind: "Education", title: "MS, Computer Science",
      org: "Illinois Institute of Technology — Chicago",
      bullets: ["Master's in computer science."],
      chips: ["GPA 3.9"] },
    { year: "2022", kind: "Experience", title: "Technical Consultant — AHEAD",
      org: "Chicago",
      bullets: ["Mastercard's real-time payments platform: liquidity-system watermarking.", "Kafka streaming, Spring Cloud microservices, mTLS security."],
      chips: ["Java", "Kafka", "Spring Cloud"] },
    { year: "2026", kind: "Now", title: "Homelab & open source",
      org: "Chicago",
      bullets: ["Self-hosted k3s cluster, MacroPrep, playHz — shipping every week."],
      chips: ["k3s", "Flutter", "FastAPI"] }
  ];
  var journey = $("#journey");
  STOPS.forEach(function (s) {
    var li = document.createElement("li");
    li.className = "jstop reveal";
    li.innerHTML = '<span class="jdot" aria-hidden="true"></span>' +
      '<span class="jyear">' + s.year + "</span>" +
      '<div class="jcard"><span class="jkicker">' + s.kind + "</span>" +
      "<h3>" + s.title + "</h3>" +
      '<p class="jorg">' + s.org + "</p>" +
      "<ul>" + s.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" +
      '<div class="jchips">' + s.chips.map(function (c) { return "<span>" + c + "</span>"; }).join("") + "</div></div>";
    journey.appendChild(li);
    io.observe(li);
  });
  var end = document.createElement("li");
  end.className = "jstop jnext reveal";
  end.innerHTML = '<span class="jdot" aria-hidden="true"></span>' +
    '<span class="jyear">Next</span>' +
    '<div class="jcard"><p class="jnext-title">Your team?</p>' +
    '<a class="btn btn-pill btn-small" href="#contact">Let&rsquo;s talk</a></div>';
  journey.appendChild(end);
  io.observe(end);
})();
