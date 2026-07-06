/**
 * The Microscopic Montado — shared site chrome
 * Usage: add at the top of each page's <body>:
 *   <div id="site-nav"></div>
 *   <script src="nav.js"></script>   (or ../nav.js inside pages/)
 *
 * Provides two things on every page:
 *   1) the centered top navigation bar
 *   2) a persistent bottom-right "Gallery" button that opens the gallery
 *      as a rounded popup sheet (side gaps, starts ~1/6 down, grows to full
 *      height as you scroll) over a blurred copy of the page.
 */

(function () {
  /* ==================== Path depth ==================== */
  // Pages inside /pages/ need "../" in front of root-relative asset paths.
  const currentPath = window.location.pathname;
  const inPages = currentPath.indexOf("/pages/") !== -1;
  const base = inPages ? "../" : "";
  const currentFile = currentPath.split("/").pop() || "index.html";

  /* ==================== Top navigation ==================== */
  const NAV_ITEMS = [
    { label: "Microscopic", href: "microscopic.html" },
    { label: "Montado", href: "montado.html" },
  ];

  const C = {
    fontSize: "23px",
    fontWeight: "500",
    letterSpacing: "0.01em",
    paddingTop: "16px",
    sepSpacing: "8px",
    opacityActive: "0.30",
    opacitySep: "1",
    zIndex: "9999",
  };

  const style = document.createElement("style");
  style.textContent = `
        #site-nav {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: ${C.zIndex};
            padding: ${C.paddingTop} 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: ${C.fontSize};
            font-weight: ${C.fontWeight};
            letter-spacing: ${C.letterSpacing};
            mix-blend-mode: difference;
            color: white;
        }
        #snav-logo {
            position: absolute;
            left: clamp(16px, 2.6vw, 34px);
            top: 10px;
            width: clamp(76px, 9vw, 118px);
            height: auto;
            display: block;
            pointer-events: auto;
            cursor: pointer;
            opacity: 1;
            transition: opacity 0.25s;
        }
        #snav-logo:hover { opacity: 0.62; }
        #snav-logo img {
            width: 100%;
            height: auto;
            display: block;
            filter: invert(1);
        }
        .snav-item {
            color: white; text-decoration: none; opacity: 1;
            transition: opacity 0.25s; white-space: nowrap;
            cursor: pointer; pointer-events: auto;
        }
        .snav-item:hover { opacity: 0.6; }
        .snav-item.snav-active {
            opacity: ${C.opacityActive}; cursor: default; pointer-events: none;
        }
        .snav-sep {
            color: white; opacity: ${C.opacitySep};
            margin: 0 ${C.sepSpacing}; user-select: none; font-weight: 300;
        }

        /* ==================== Gallery popup ==================== */
        /* Bottom-right trigger: smaller than the nav, same white + difference
           colour logic so it inverts against whatever is behind it. */
        #gpop-trigger {
            position: fixed;
            right: clamp(18px, 3vw, 40px);
            bottom: clamp(16px, 3vw, 34px);
            z-index: 9999;
            border: none; background: none; padding: 0; margin: 0;
            cursor: pointer;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 18px; font-weight: 500; letter-spacing: 0.02em;
            color: white; mix-blend-mode: difference;
            transition: opacity 0.25s;
        }
        #gpop-trigger:hover { opacity: 0.6; }
        #gpop-trigger.gpop-hidden { opacity: 0; pointer-events: none; }

        /* Full-viewport layer that blurs the page behind it. */
        #gpop-overlay {
            position: fixed; inset: 0; z-index: 100000;
            display: none;
            background: rgba(20, 20, 24, 0.16);
            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
        }
        #gpop-overlay.gpop-open { display: block; }

        /* Scroll area: transparent, so the blurred page shows in the side
           gaps and above the panel. */
        #gpop-scroll {
            position: absolute; inset: 0;
            overflow-y: auto; overflow-x: hidden;
            padding: 0 clamp(16px, 5vw, 84px);
            -webkit-overflow-scrolling: touch;
        }
        /* Transparent top spacer = the initial ~1/6 offset from the top.
           Scrolling past it slides the panel up until it fills the screen. */
        #gpop-spacer { height: 16.667vh; flex: none; }

        #gpop-panel {
            background: #ffffff;
            border-radius: 22px;
            overflow: hidden;
            min-height: calc(100vh - 16.667vh);
            margin-bottom: clamp(16px, 4vh, 48px);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
        }
        .gpop-body {
            padding: clamp(24px, 3.2vw, 48px);
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        #gpop-close {
            position: fixed;
            top: clamp(14px, 2.4vw, 26px);
            right: clamp(16px, 3vw, 40px);
            z-index: 100001;
            width: 40px; height: 40px; border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.6);
            background: rgba(30, 30, 34, 0.35);
            -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
            color: #fff; font-size: 20px; line-height: 1; cursor: pointer;
            display: none; align-items: center; justify-content: center;
            transition: background 0.2s, transform 0.2s;
        }
        #gpop-overlay.gpop-open ~ #gpop-close,
        #gpop-close.gpop-show { display: flex; }
        #gpop-close:hover { background: rgba(30, 30, 34, 0.6); transform: rotate(90deg); }

        /* Names-only list, grouped by category (scoped so it never clashes
           with any page CSS) */
        .gpop-cat { margin-top: clamp(36px, 5.5vw, 68px); }
        .gpop-cat:first-child { margin-top: 0; }
        .gpop-cat-title {
            color: #888888; font-size: 12px; letter-spacing: 0.28em;
            text-transform: uppercase;
            margin-bottom: 22px; padding-bottom: 14px;
            border-bottom: 1px solid #ececec;
        }
        .gpop-names {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px 48px;
        }
        .gpop-name {
            color: #111111; font-size: 26px; font-weight: 400;
            line-height: 1.25; letter-spacing: 0.004em;
        }
        a.gpop-name { text-decoration: none; cursor: pointer; transition: opacity 0.2s ease; }
        a.gpop-name:hover { opacity: 0.55; }
        @media (max-width: 560px) {
            .gpop-name { font-size: 22px; }
        }

        @media (prefers-reduced-motion: reduce) {
            #gpop-trigger, #gpop-close { transition: none !important; }
        }
    `;
  document.head.appendChild(style);

  /* —————— Render top nav —————— */
  const nav = document.getElementById("site-nav");
  if (nav) {
    const logo = document.createElement("a");
    logo.id = "snav-logo";
    logo.href = base + "index.html";
    logo.setAttribute("aria-label", "The Microscopic Montado home");
    const logoImg = document.createElement("img");
    logoImg.src = base + "images/logo字.svg";
    logoImg.alt = "The Microscopic Montado";
    logo.appendChild(logoImg);
    nav.appendChild(logo);

    NAV_ITEMS.forEach(function (item, i) {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "snav-sep";
        sep.textContent = "/";
        nav.appendChild(sep);
      }
      const a = document.createElement("a");
      a.className = "snav-item";
      a.textContent = item.label;
      let href = item.href;
      if (inPages) {
        href = href.indexOf("pages/") === 0 ? href.replace("pages/", "") : "../" + href;
      }
      a.href = href;
      const itemFile = item.href.split("/").pop() || "index.html";
      if (currentFile === itemFile) a.classList.add("snav-active");
      nav.appendChild(a);
    });
  }

  /* ==================== Gallery data ==================== */
  // Category display order; any unlisted type is appended at the end.
  const CATEGORY_ORDER = [
    "Bacterium", "Oomycete", "Plant", "Plant material",
    "Organic compound", "Mineral", "Ion", "Molecule", "Biogeochemical cycle",
  ];

  // img paths are root-relative; `base` prefixes them per page depth.
  const ITEMS = [
    { name: "Rhizobia", type: "Bacterium", img: "images/根瘤菌.tiff",
      copy: "It lives in the roots of the legume grasses beneath the cork oaks. It turns nitrogen the plants can't use straight from the air into nutrients, keeping the montado fertile year after year without any fertilizer.", link: "rhizobia.html" },
    { name: "Streptomyces griseus", type: "Bacterium", img: "images/灰色链霉菌.tiff",
      copy: "That earthy scent rising from the montado soil after the first autumn rain comes largely from it. It has another claim too: streptomycin, humanity's first drug against tuberculosis, came from this bacterium.", link: "streptomyces-griseus.html" },
    { name: "Bacillus megaterium", type: "Bacterium", img: "images/巨大芽孢杆菌.tiff",
      copy: "The montado's soil is poor and acidic, and phosphorus often stays locked in minerals where plants can't reach it. This is the one that unlocks it, dissolving phosphorus so even sparse plants can take root.", link: "bacillus-megaterium.html" },
    { name: "Bacillus subtilis", type: "Bacterium", img: "images/枯草芽孢杆菌.tiff",
      copy: "It can form a tough spore to wait out the driest summer, then wake again when the rain returns. Farmers use it against crop diseases, and it is also a probiotic.", link: "bacillus-subtilis.html" },
    { name: "Bryobacter aggregatus", type: "Bacterium", img: "images/苔藓杆菌.tiff",
      copy: "The montado is known for being dry, yet it has its damp corners too: stream edges, watering troughs, shaded mossy rocks. This is where it lives, slowly breaking down moss and litter, keeping the carbon balance of these small worlds.", link: "bryobacter-aggregatus.html" },
    { name: "Pseudomonas fluorescens", type: "Bacterium", img: "images/荧光假单胞菌.tiff",
      copy: "It gathers around the roots of oaks and grasses, releasing antibiotics and competing for ground with pathogens like Phytophthora cinnamomi. Scientists are wondering whether it might help protect the montado's ailing oaks.", link: "pseudomonas-fluorescens.html" },
    { name: "Bradyrhizobium", type: "Bacterium", img: "images/慢生根瘤菌.tiff",
      copy: "The slow one in the rhizobia family. It grows slowly and fixes nitrogen without hurry, living in the root nodules of the montado's understory legumes, replenishing this poor soil season after season.", link: "bradyrhizobium.html" },
    { name: "Rhizobium leguminosarum", type: "Bacterium", img: "images/豌豆根瘤菌.tiff",
      copy: "It was first found in the roots of peas, and in the montado it now lives in the nodules of subterranean clover and yellow serradella. It turns nitrogen from the air into nutrients, and the green pasture beneath the sheep and black pigs depends on it.", link: "rhizobium-leguminosarum.html" },

    { name: "Phytophthora cinnamomi", type: "Oomycete", img: "images/肉桂疫霉.tiff",
      copy: "The montado's most dangerous underground enemy. It rots the roots of oaks, and over a few years once-leafy cork oaks slowly wither and die. This wood-pasture, alive for centuries, is now under threat because of it.", link: "phytophthora-cinnamomi.html" },

    { name: "Yellow Serradella (Ornithopus compressus)", type: "Plant", img: "images/黄鸟足豆.tiff",
      copy: "A small annual legume of the montado understory, with curved pods shaped like a bird's claw. Tough against drought and poor soil, it fixes nitrogen with rhizobia in its roots, blooms with little yellow flowers in spring, and feeds the sheep and black pigs.", link: "yellow-serradella.html" },
    { name: "Subterranean Clover (Trifolium subterraneum)", type: "Plant", img: "images/地下三叶草.tiff",
      copy: "It has a clever habit: after flowering, it buries its seeds in the soil, escaping the summer drought and the grazers. That makes it especially suited to the montado, one of the most important legumes in its rotational pastures.", link: "subterranean-clover.html" },

    { name: "Oak Leaves and Acorns", type: "Plant material", img: "images/橡树叶和橡子.tiff",
      copy: "Two things the cork oak and holm oak give to this land. Leaves fall and feed the soil; acorns fall and feed the Iberian black pigs foraging among the trees, giving rise to the famous acorn-cured ham.", link: "oak-leaves-acorns.html" },

    { name: "Lignin and Hemicellulose", type: "Organic compound", img: "images/木质素和半纤维素.tiff",
      copy: "They give the oak's wood and cork, and the stems of the grasses, their stiffness and strength. When the plants die, it is the actinomycetes and Bryobacter in the soil that slowly break them down into humus, returning them to this land.", link: "lignin-hemicellulose.html" },
    { name: "Glucose (C₆H₁₂O₆)", type: "Organic compound", img: "images/C6H12O6.tiff",
      copy: "Sunlight, packed into a sugar. The cork oak makes glucose from carbon dioxide and water, then turns it into wood, cork, and acorns. The part that falls into the soil becomes food for microbes.", link: "glucose.html" },
    { name: "Friedelin", type: "Organic compound", img: "images/friedelin.tiff",
      copy: "A molecule hidden inside cork. It makes cork water-repellent, stable, and durable, and helps the cork oak endure the summer sun and wildfire. There is a little of it in every wine bottle stopper.", link: "friedelin.html" },

    { name: "Variscite (AlPO₄·2H₂O)", type: "Mineral", img: "images/AlPO4·2H2O.tiff",
      copy: "In the montado's acidic soil, phosphorus often binds with aluminum into this mineral and stays firmly locked away, beyond the plants' reach. Only phosphorus-dissolving microbes can release it again for the plants to use.", link: "variscite.html" },

    { name: "Dihydrogen Phosphate (H₂PO₄⁻)", type: "Ion", img: "images/H2PO4.tiff",
      copy: "The form of phosphorus that roots can take up directly. Microbes work to turn the phosphorus locked in minerals into this form bit by bit, so the oaks and grasses can finally absorb it and grow leaves, flowers, and acorns.", link: "dihydrogen-phosphate.html" },

    { name: "Nitrogen Gas (N₂)", type: "Molecule", img: "images/N2.tiff",
      copy: "The most abundant gas in the air, and yet plants can't use it. Under the wide montado sky, only microbes like rhizobia can turn it into nutrients the plants can actually absorb.", link: "nitrogen-gas.html" },
    { name: "Ammonia (NH₃)", type: "Molecule", img: "images/NH3.tiff",
      copy: "The first fruit of nitrogen fixation. Microbes turn nitrogen from the air into ammonia, and plants use it to build amino acids and proteins. This is where the montado's nutrient cycle begins.", link: "ammonia.html" },
    { name: "Carbon Dioxide (CO₂)", type: "Molecule", img: "images/CO2.tiff",
      copy: "The montado breathes in and out each day. By day, the oaks take carbon dioxide from the air into themselves; as leaves decay and creatures breathe, it returns to the sky. In the end, this woodland takes in more than it gives back.", link: "carbon-dioxide.html" },

    { name: "The Nitrogen Cycle", type: "Biogeochemical cycle", img: "images/氮.tiff",
      copy: "Nitrogen moves endlessly among the air, soil, plants, and livestock: fixed, taken up, broken down, and returned to the sky. The montado is scarcely fertilized, and it is this invisible cycle that keeps it fertile year after year.", link: "nitrogen-cycle.html" },
    { name: "The Phosphorus Cycle", type: "Biogeochemical cycle", img: "images/磷.tiff",
      copy: "Phosphorus has no gaseous form and can only turn over slowly within the soil, which makes it especially precious. It is locked into minerals, released by microbes, taken up by plants, and returned to the soil as they die back. The montado's vitality lies in this quiet cycle.", link: "phosphorus-cycle.html" },
    { name: "The Carbon Cycle", type: "Biogeochemical cycle", img: "images/碳.tiff",
      copy: "The oaks take carbon from the air into wood, cork, and acorns; as the leaves decay, carbon returns to the soil and the air. With its long-lived oaks and deep soil, the montado has become an important place of carbon storage in the Mediterranean.", link: "carbon-cycle.html" },
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function buildGalleryHTML() {
    const groups = {};
    ITEMS.forEach(function (it) {
      (groups[it.type] = groups[it.type] || []).push(it);
    });
    const order = CATEGORY_ORDER.filter(function (t) { return groups[t]; })
      .concat(Object.keys(groups).filter(function (t) { return CATEGORY_ORDER.indexOf(t) === -1; }));

    return order.map(function (type) {
      const names = groups[type].map(function (it) {
        if (it.link) {
          return '<a class="gpop-name" href="' + base + it.link + '" target="_top">' + esc(it.name) + '</a>';
        }
        return '<div class="gpop-name">' + esc(it.name) + '</div>';
      }).join("");
      return (
        '<section class="gpop-cat">' +
          '<h2 class="gpop-cat-title">' + esc(type) + '</h2>' +
          '<div class="gpop-names">' + names + '</div>' +
        '</section>'
      );
    }).join("");
  }

  /* ==================== Build popup DOM ==================== */
  const trigger = document.createElement("button");
  trigger.id = "gpop-trigger";
  trigger.type = "button";
  trigger.textContent = "Gallery";

  const overlay = document.createElement("div");
  overlay.id = "gpop-overlay";
  overlay.innerHTML =
    '<div id="gpop-scroll">' +
      '<div id="gpop-spacer"></div>' +
      '<div id="gpop-panel"><div class="gpop-body">' + buildGalleryHTML() + '</div></div>' +
    '</div>';

  const closeBtn = document.createElement("button");
  closeBtn.id = "gpop-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close gallery");
  closeBtn.innerHTML = "&times;";

  document.body.appendChild(trigger);
  document.body.appendChild(overlay);
  document.body.appendChild(closeBtn);

  const scroll = overlay.querySelector("#gpop-scroll");
  let prevBodyOverflow = "";

  function openGallery() {
    prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlay.classList.add("gpop-open");
    closeBtn.classList.add("gpop-show");
    trigger.classList.add("gpop-hidden");
    scroll.scrollTop = 0; // start with the panel ~1/6 down
  }

  function closeGallery() {
    overlay.classList.remove("gpop-open");
    closeBtn.classList.remove("gpop-show");
    trigger.classList.remove("gpop-hidden");
    document.body.style.overflow = prevBodyOverflow;
  }

  trigger.addEventListener("click", openGallery);
  closeBtn.addEventListener("click", closeGallery);
  // Click on the blurred backdrop (spacer / side gaps) closes; clicks on the
  // panel do not.
  scroll.addEventListener("click", function (e) {
    if (e.target === scroll || e.target.id === "gpop-spacer") closeGallery();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("gpop-open")) closeGallery();
  });
})();
