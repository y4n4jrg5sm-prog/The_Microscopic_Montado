

(function () {

  const currentPath = window.location.pathname;
  const inPages = currentPath.indexOf("/pages/") !== -1;
  const base = inPages ? "../" : "";
  const currentFile = currentPath.split("/").pop() || "index.html";

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

        #gpop-overlay {
            position: fixed; inset: 0; z-index: 100000;
            display: none;
            background: rgba(20, 20, 24, 0.16);
            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
        }
        #gpop-overlay.gpop-open { display: block; }

        #gpop-scroll {
            position: absolute; inset: 0;
            overflow-y: auto; overflow-x: hidden;
            padding: 0 clamp(16px, 5vw, 84px);
            -webkit-overflow-scrolling: touch;
        }
        
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

        #fg-net { max-width: 1040px; margin: 0 auto; }
        #fg-net .fg-h { color: #888888; font-size: 12px; letter-spacing: 0.28em;
            text-transform: uppercase; margin: 0 0 14px; padding-bottom: 14px;
            border-bottom: 1px solid #ececec; font-weight: 500; }
        #fg-legend { display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 13px;
            color: #666666; margin-bottom: 6px; }
        #fg-legend span { display: inline-flex; align-items: center; }
        #fg-legend i { width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
        #fg-svgwrap { position: relative; }
        #fg-svg { display: block; width: 100%; height: auto; max-height: 80vh; margin: 0 auto; -webkit-user-select: none; user-select: none; }
        #fg-reset { position: absolute; top: 6px; left: 6px; border: 1px solid #dddddd;
            background: #ffffff; color: #555555; font-size: 12px; border-radius: 8px;
            padding: 5px 11px; cursor: pointer; font-family: inherit; }
        #fg-reset:hover { color: #111111; border-color: #bbbbbb; }
        .fg-node { cursor: pointer; }
        #fg-panel { border-top: 1px solid #ececec; margin-top: 6px; padding-top: 14px;
            min-height: 120px; }
        #fg-phead { font-size: 17px; font-weight: 500; color: #111111; margin-bottom: 10px; }
        #fg-phead .fg-dot { display: inline-block; width: 11px; height: 11px;
            border-radius: 50%; margin-right: 8px; vertical-align: middle; }
        #fg-phead .fg-open { margin-left: 10px; font-size: 14px; color: #c0552f;
            text-decoration: none; font-weight: 500; }
        #fg-phead .fg-open:hover { text-decoration: underline; }
        #fg-pbody { font-size: 14px; color: #555555; line-height: 1.65; }
        #fg-pbody .fg-row { padding: 6px 0; border-bottom: 1px solid #f2f2f2; cursor: pointer; }
        #fg-pbody .fg-row:hover { color: #111111; }
        #fg-pbody .fg-row b { color: #111111; font-weight: 500; }
    `;
  document.head.appendChild(style);

  function renderTopNav() {
    const nav = document.getElementById("site-nav");
    if (!nav || document.querySelector(".hero-scroll")) return;
    const logo = document.createElement("a");
    logo.id = "snav-logo";
    logo.href = base + "index.html";
    logo.setAttribute("aria-label", "The Microscopic Montado home");
    const logoImg = document.createElement("img");
    logoImg.src = base + "images/logo-text.svg";
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderTopNav);
  } else {
    renderTopNav();
  }

  const CATEGORY_ORDER = [
    "Bacterium", "Oomycete", "Plant", "Plant material",
    "Organic compound", "Mineral", "Ion", "Molecule", "Biogeochemical cycle",
  ];

  const ITEMS = [
    { name: "Rhizobia", type: "Bacterium", img: "images/rhizobia-0.webp",
      copy: "It lives in the roots of the legume grasses beneath the cork oaks. It turns nitrogen the plants can't use straight from the air into nutrients, keeping the montado fertile year after year without any fertilizer.", link: "rhizobia.html" },
    { name: "Streptomyces griseus", type: "Bacterium", img: "images/streptomyces-griseus-0.webp",
      copy: "That earthy scent rising from the montado soil after the first autumn rain comes largely from it. It has another claim too: streptomycin, humanity's first drug against tuberculosis, came from this bacterium.", link: "streptomyces-griseus.html" },
    { name: "Bacillus megaterium", type: "Bacterium", img: "images/bacillus-megaterium-0.webp",
      copy: "The montado's soil is poor and acidic, and phosphorus often stays locked in minerals where plants can't reach it. This is the one that unlocks it, dissolving phosphorus so even sparse plants can take root.", link: "bacillus-megaterium.html" },
    { name: "Bacillus subtilis", type: "Bacterium", img: "images/bacillus-subtilis-0.webp",
      copy: "It can form a tough spore to wait out the driest summer, then wake again when the rain returns. Farmers use it against crop diseases, and it is also a probiotic.", link: "bacillus-subtilis.html" },
    { name: "Bryobacter aggregatus", type: "Bacterium", img: "images/bryobacter-aggregatus-0.webp",
      copy: "The montado is known for being dry, yet it has its damp corners too: stream edges, watering troughs, shaded mossy rocks. This is where it lives, slowly breaking down moss and litter, keeping the carbon balance of these small worlds.", link: "bryobacter-aggregatus.html" },
    { name: "Pseudomonas fluorescens", type: "Bacterium", img: "images/pseudomonas-fluorescens-0.webp",
      copy: "It gathers around the roots of oaks and grasses, releasing antibiotics and competing for ground with pathogens like Phytophthora cinnamomi. Scientists are wondering whether it might help protect the montado's ailing oaks.", link: "pseudomonas-fluorescens.html" },
    { name: "Bradyrhizobium", type: "Bacterium", img: "images/bradyrhizobium-0.webp",
      copy: "The slow one in the rhizobia family. It grows slowly and fixes nitrogen without hurry, living in the root nodules of the montado's understory legumes, replenishing this poor soil season after season.", link: "bradyrhizobium.html" },
    { name: "Rhizobium leguminosarum", type: "Bacterium", img: "images/rhizobium-leguminosarum-0.webp",
      copy: "It was first found in the roots of peas, and in the montado it now lives in the nodules of subterranean clover and yellow serradella. It turns nitrogen from the air into nutrients, and the green pasture beneath the sheep and black pigs depends on it.", link: "rhizobium-leguminosarum.html" },

    { name: "Phytophthora cinnamomi", type: "Oomycete", img: "images/phytophthora-cinnamomi-0.webp",
      copy: "The montado's most dangerous underground enemy. It rots the roots of oaks, and over a few years once-leafy cork oaks slowly wither and die. This wood-pasture, alive for centuries, is now under threat because of it.", link: "phytophthora-cinnamomi.html" },

    { name: "Yellow Serradella (Ornithopus compressus)", type: "Plant", img: "images/yellow-serradella.webp",
      copy: "A small annual legume of the montado understory, with curved pods shaped like a bird's claw. Tough against drought and poor soil, it fixes nitrogen with rhizobia in its roots, blooms with little yellow flowers in spring, and feeds the sheep and black pigs.", link: "yellow-serradella.html" },
    { name: "Subterranean Clover (Trifolium subterraneum)", type: "Plant", img: "images/subterranean-clover-0.webp",
      copy: "It has a clever habit: after flowering, it buries its seeds in the soil, escaping the summer drought and the grazers. That makes it especially suited to the montado, one of the most important legumes in its rotational pastures.", link: "subterranean-clover.html" },

    { name: "Oak Leaves and Acorns", type: "Plant material", img: "images/oak-leaves-acorns.webp",
      copy: "Two things the cork oak and holm oak give to this land. Leaves fall and feed the soil; acorns fall and feed the Iberian black pigs foraging among the trees, giving rise to the famous acorn-cured ham.", link: "oak-leaves-acorns.html" },

    { name: "Lignin and Hemicellulose", type: "Organic compound", img: "images/lignin-hemicellulose.webp",
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

    { name: "The Nitrogen Cycle", type: "Biogeochemical cycle", img: "images/nitrogen-cycle.webp",
      copy: "Nitrogen moves endlessly among the air, soil, plants, and livestock: fixed, taken up, broken down, and returned to the sky. The montado is scarcely fertilized, and it is this invisible cycle that keeps it fertile year after year.", link: "nitrogen-cycle.html" },
    { name: "The Phosphorus Cycle", type: "Biogeochemical cycle", img: "images/phosphorus-cycle.webp",
      copy: "Phosphorus has no gaseous form and can only turn over slowly within the soil, which makes it especially precious. It is locked into minerals, released by microbes, taken up by plants, and returned to the soil as they die back. The montado's vitality lies in this quiet cycle.", link: "phosphorus-cycle.html" },
    { name: "The Carbon Cycle", type: "Biogeochemical cycle", img: "images/carbon-cycle.webp",
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

  const trigger = document.createElement("button");
  trigger.id = "gpop-trigger";
  trigger.type = "button";
  trigger.textContent = "Web of Relations";

  const overlay = document.createElement("div");
  overlay.id = "gpop-overlay";
  overlay.innerHTML =
    '<div id="gpop-scroll">' +
      '<div id="gpop-spacer"></div>' +
      '<div id="gpop-panel"><div class="gpop-body">' +
        '<div id="fg-net">' +
          '<div class="fg-h">Field Guide · a web of relations in the montado</div>' +
          '<div id="fg-legend">' +
            '<span><i style="background:#1D9E75"></i>Microbe</span>' +
            '<span><i style="background:#D85A30"></i>Pathogen</span>' +
            '<span><i style="background:#639922"></i>Plant</span>' +
            '<span><i style="background:#888780"></i>Molecule / mineral</span>' +
            '<span><i style="background:#7F77DD"></i>Cycle</span>' +
            '<span><i style="background:#2E4159"></i>Global scale</span>' +
            '<span id="fg-hint" style="color:#b0b0b0">· pinch to zoom · drag to pan</span>' +
          '</div>' +
          '<div id="fg-svgwrap">' +
            '<svg id="fg-svg" viewBox="-40 -120 920 960" role="img">' +
              '<title>Field Guide relationship network</title>' +
              '<g id="fg-view"><g id="fg-edges"></g><g id="fg-nodes"></g></g>' +
            '</svg>' +
            '<button id="fg-reset" type="button" aria-label="Reset view">Reset view</button>' +
          '</div>' +
          '<div id="fg-panel">' +
            '<div id="fg-phead">Hover an element to see its relations · click to open its page</div>' +
            '<div id="fg-pbody">Hubs: <b>Oak</b> touches almost everything; <b>Glucose</b> is the underground currency linking carbon to nitrogen, phosphorus and defence; <b>S. griseus + Bryobacter</b> return carbon, nitrogen and phosphorus to the soil. The dark outer ring is the <b>global scale</b> — atmospheric CO₂, temperature, greening and the montado&#39;s own extent — tied to the microbes by dashed cross-scale threads that close into a loop.</div>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
    '</div>';

  const closeBtn = document.createElement("button");
  closeBtn.id = "gpop-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close web of relations");
  closeBtn.innerHTML = "&times;";

  document.body.appendChild(trigger);
  document.body.appendChild(overlay);
  document.body.appendChild(closeBtn);
  buildFgNetwork();

  const scroll = overlay.querySelector("#gpop-scroll");
  let prevBodyOverflow = "";

  function openGallery() {
    prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlay.classList.add("gpop-open");
    closeBtn.classList.add("gpop-show");
    trigger.classList.add("gpop-hidden");
    scroll.scrollTop = 0; 
  }

  function closeGallery() {
    overlay.classList.remove("gpop-open");
    closeBtn.classList.remove("gpop-show");
    trigger.classList.remove("gpop-hidden");
    document.body.style.overflow = prevBodyOverflow;
  }

  trigger.addEventListener("click", openGallery);
  closeBtn.addEventListener("click", closeGallery);

  scroll.addEventListener("click", function (e) {
    if (e.target === scroll || e.target.id === "gpop-spacer") closeGallery();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("gpop-open")) closeGallery();
  });

  function buildFgNetwork() {
    var svg = document.getElementById("fg-svg");
    if (!svg) return;
    var CAT = { microbe: "#1D9E75", pathogen: "#D85A30", plant: "#639922", mol: "#888780", cycle: "#7F77DD", macro: "#2E4159" };
    var CATNAME = { microbe: "Microbe", pathogen: "Pathogen", plant: "Plant", mol: "Molecule / mineral", cycle: "Cycle", macro: "Global outcome" };
    var N = [
      { id: "co2", t: "CO₂", c: "mol", x: 165, y: 80, lp: "t", href: "carbon-dioxide.html" },
      { id: "glucose", t: "Glucose", c: "mol", x: 315, y: 135, lp: "t", href: "glucose.html" },
      { id: "friedelin", t: "Friedelin", c: "mol", x: 470, y: 80, lp: "t", href: "friedelin.html" },
      { id: "lignin", t: "Lignin", c: "mol", x: 585, y: 135, lp: "t", href: "lignin-hemicellulose.html" },
      { id: "ccyc", t: "Carbon cycle", c: "cycle", x: 625, y: 70, lp: "l", href: "carbon-cycle.html" },
      { id: "oak", t: "Oak", c: "plant", x: 330, y: 330, lp: "r", href: "oak-leaves-acorns.html" },
      { id: "streptomyces", t: "S. griseus", c: "microbe", x: 600, y: 315, lp: "l", href: "streptomyces-griseus.html" },
      { id: "bryobacter", t: "Bryobacter", c: "microbe", x: 610, y: 430, lp: "l", href: "bryobacter-aggregatus.html" },
      { id: "phyt", t: "Phytophthora", c: "pathogen", x: 435, y: 245, lp: "l", href: "phytophthora-cinnamomi.html" },
      { id: "pseudo", t: "P. fluorescens", c: "microbe", x: 530, y: 220, lp: "l", href: "pseudomonas-fluorescens.html" },
      { id: "bsub", t: "B. subtilis", c: "microbe", x: 490, y: 345, lp: "l", href: "bacillus-subtilis.html" },
      { id: "n2", t: "N₂", c: "mol", x: 80, y: 250, lp: "s", href: "nitrogen-gas.html" },
      { id: "nh3", t: "NH₃", c: "mol", x: 165, y: 170, lp: "t", href: "ammonia.html" },
      { id: "rhizobia", t: "Rhizobia", c: "microbe", x: 120, y: 385, lp: "s", href: "rhizobia.html" },
      { id: "ncyc", t: "Nitrogen cycle", c: "cycle", x: 70, y: 120, lp: "r", href: "nitrogen-cycle.html" },
      { id: "brady", t: "Bradyrhizobium", c: "microbe", x: 110, y: 505, lp: "r", href: "bradyrhizobium.html" },
      { id: "rleg", t: "R. leguminosarum", c: "microbe", x: 255, y: 525, lp: "b", href: "rhizobium-leguminosarum.html" },
      { id: "clover", t: "Sub. clover", c: "plant", x: 370, y: 565, lp: "b", href: "subterranean-clover.html" },
      { id: "serradella", t: "Serradella", c: "plant", x: 210, y: 615, lp: "b", href: "yellow-serradella.html" },
      { id: "h2po4", t: "H₂PO₄⁻", c: "mol", x: 405, y: 445, lp: "l", href: "dihydrogen-phosphate.html" },
      { id: "bmeg", t: "B. megaterium", c: "microbe", x: 520, y: 485, lp: "l", href: "bacillus-megaterium.html" },
      { id: "varis", t: "Variscite", c: "mol", x: 600, y: 585, lp: "b", href: "variscite.html" },
      { id: "pcyc", t: "Phosphorus cycle", c: "cycle", x: 625, y: 540, lp: "l", href: "phosphorus-cycle.html" },
      { id: "co2atm", t: "Atmospheric CO₂", c: "macro", x: 285, y: -70, lp: "t", href: "https://gml.noaa.gov/ccgg/trends/" },
      { id: "gtemp", t: "Global temperature", c: "macro", x: 745, y: -55, lp: "l", href: "https://berkeleyearth.org/data/" },
      { id: "greening", t: "Global greening (NDVI)", c: "macro", x: 825, y: 285, lp: "l", href: "https://doi.org/10.3334/ORNLDAAC/2187" },
      { id: "drought", t: "Mediterranean drought", c: "macro", x: 800, y: 560, lp: "l", href: "" },
      { id: "extent", t: "Montado extent (Portugal)", c: "macro", x: 430, y: 790, lp: "b", href: "https://www.dgterritorio.gov.pt/" }
    ];
    var E = [
      ["co2","glucose","photosynthesis: CO₂ → sugar"],["oak","glucose","the oak makes glucose by photosynthesis"],
      ["oak","co2","leaves fix atmospheric CO₂"],["glucose","lignin","sugar built into wood & cork"],
      ["glucose","friedelin","sugar built into cork wax"],["oak","friedelin","cork oak makes friedelin — water & fire proof"],
      ["oak","lignin","builds its wood & cork structure"],["friedelin","lignin","both main components of cork"],
      ["lignin","streptomyces","breaks lignin down into humus"],["lignin","bryobacter","breaks lignin & litter down"],
      ["oak","streptomyces","decomposes litter & protects the oak"],["oak","bryobacter","decomposes litter into humus"],
      ["streptomyces","co2","decay returns carbon to the air"],["bryobacter","co2","decay releases CO₂"],
      ["streptomyces","bryobacter","both decomposers of the soil"],["glucose","rhizobia","root sugar buys fixed nitrogen"],
      ["glucose","bmeg","root sugar buys freed phosphorus"],["glucose","pseudo","root sugar buys defence"],
      ["ccyc","co2","part of the carbon cycle"],["ccyc","glucose","part of the carbon cycle"],["ccyc","oak","part of the carbon cycle"],
      ["ccyc","lignin","part of the carbon cycle"],["ccyc","friedelin","part of the carbon cycle"],["ccyc","streptomyces","part of the carbon cycle"],["ccyc","bryobacter","part of the carbon cycle"],
      ["n2","nh3","fixation: N₂ → NH₃"],["rhizobia","n2","rhizobia break the triple bond"],["rhizobia","nh3","produce ammonia"],
      ["rhizobia","rleg","R. leguminosarum is a rhizobium"],["rhizobia","brady","Bradyrhizobium is the slow rhizobium"],
      ["rleg","clover","nodulates subterranean clover"],["brady","serradella","nodulates yellow serradella"],
      ["clover","nh3","fixes nitrogen into ammonia"],["serradella","nh3","fixes nitrogen into ammonia"],
      ["nh3","oak","ammonia → protein, feeds the oak"],["clover","oak","fixed N returns via litter to the oak"],
      ["serradella","oak","fixed N feeds the woodland"],
      ["ncyc","n2","part of the nitrogen cycle"],["ncyc","nh3","part of the nitrogen cycle"],["ncyc","rhizobia","part of the nitrogen cycle"],
      ["ncyc","rleg","part of the nitrogen cycle"],["ncyc","brady","part of the nitrogen cycle"],["ncyc","clover","part of the nitrogen cycle"],["ncyc","serradella","part of the nitrogen cycle"],
      ["bmeg","varis","organic acids dissolve the mineral"],["bmeg","h2po4","releases plant-available phosphate"],
      ["varis","h2po4","locked P → usable P"],["pseudo","h2po4","also a strong phosphate-solubiliser"],
      ["h2po4","oak","roots take up phosphate"],["serradella","h2po4","thrives on very little phosphate"],
      ["pcyc","varis","part of the phosphorus cycle"],["pcyc","h2po4","part of the phosphorus cycle"],["pcyc","bmeg","part of the phosphorus cycle"],["pcyc","pseudo","part of the phosphorus cycle"],
      ["phyt","oak","rots the oak's roots — a seca"],["pseudo","phyt","suppresses the pathogen"],
      ["bsub","phyt","lipopeptides inhibit its growth"],["streptomyces","phyt","enzymes dissolve its walls"],
      ["pseudo","oak","protects & primes oak immunity"],["bsub","oak","primes the oak's immunity"],
      ["bmeg","oak","feeds the tree to resist disease"],
      ["co2","co2atm","the montado's CO₂ joins the global pool"],
      ["oak","co2atm","cork oak fixes CO₂ — a carbon sink"],
      ["streptomyces","co2atm","decay returns carbon to the atmosphere"],
      ["ccyc","co2atm","the local carbon loop feeds the global budget"],
      ["co2atm","gtemp","more CO₂ drives global warming"],
      ["gtemp","greening","warming reshapes global vegetation greening"],
      ["ccyc","greening","vegetation productivity shows up as greening"],
      ["oak","greening","tree canopy is what NDVI measures"],
      ["rhizobia","greening","fixed nitrogen fuels plant growth"],
      ["gtemp","drought","warming drives Mediterranean drought"],
      ["gtemp","phyt","warmer, wetter winters favour the pathogen"],
      ["drought","phyt","drought stress weakens the oak's defences"],
      ["drought","oak","water stress deepens oak decline"],
      ["phyt","extent","root rot kills oaks — the montado shrinks"],
      ["oak","extent","oak cover defines the montado's extent"],
      ["drought","extent","drought erodes the montado's edge"],
      ["extent","co2atm","lost woodland releases its stored carbon"]
    ];
    var NS = "http://www.w3.org/2000/svg";
    var canHover = !(window.matchMedia && window.matchMedia("(hover: none)").matches);
    var mobileMode = !!(window.matchMedia && window.matchMedia("(hover: none) and (max-width: 700px)").matches);
    var pointerDown = false;
    var ge = document.getElementById("fg-edges"), gn = document.getElementById("fg-nodes");
    var head = document.getElementById("fg-phead"), body = document.getElementById("fg-pbody");
    var byId = {}; N.forEach(function (n) { byId[n.id] = n; n.adj = []; });
    E.forEach(function (e) { byId[e[0]].adj.push({ o: e[1], r: e[2] }); byId[e[1]].adj.push({ o: e[0], r: e[2] }); });
    var eLines = [];
    E.forEach(function (e) {
      var a = byId[e[0]], b = byId[e[1]];
      var ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", a.x); ln.setAttribute("y1", a.y); ln.setAttribute("x2", b.x); ln.setAttribute("y2", b.y);
      ln.setAttribute("stroke", "#cfcfca"); ln.setAttribute("stroke-width", "1"); ln.setAttribute("opacity", "0.5");
      if (a.c === "macro" || b.c === "macro") { ln.setAttribute("stroke-dasharray", "5 4"); ln.setAttribute("stroke", "#b7b2cf"); }
      ln.dataset.a = e[0]; ln.dataset.b = e[1]; ge.appendChild(ln); eLines.push(ln);
    });
    var nodeEls = {};
    N.forEach(function (n) {
      var g = document.createElementNS(NS, "g"); g.setAttribute("class", "fg-node");
      var sh;
      if (n.c === "cycle") {
        sh = document.createElementNS(NS, "rect");
        sh.setAttribute("x", n.x - 7); sh.setAttribute("y", n.y - 7); sh.setAttribute("width", 14); sh.setAttribute("height", 14);
        sh.setAttribute("transform", "rotate(45 " + n.x + " " + n.y + ")");
      } else {
        sh = document.createElementNS(NS, "circle");
        sh.setAttribute("cx", n.x); sh.setAttribute("cy", n.y);
        sh.setAttribute("r", n.c === "macro" ? 9 : (n.id === "oak" ? 9 : 6.5));
      }
      if (n.c === "macro") {
        var ring = document.createElementNS(NS, "circle");
        ring.setAttribute("cx", n.x); ring.setAttribute("cy", n.y); ring.setAttribute("r", 14);
        ring.setAttribute("fill", "none"); ring.setAttribute("stroke", CAT.macro);
        ring.setAttribute("stroke-width", "1.2"); ring.setAttribute("opacity", "0.55");
        g.appendChild(ring);
      }
      sh.setAttribute("fill", CAT[n.c]); sh.setAttribute("stroke", "#ffffff"); sh.setAttribute("stroke-width", "1.5");
      g.appendChild(sh);
      var tx = document.createElementNS(NS, "text");
      var lx = n.x, ly = n.y, anc = "middle";
      if (n.lp === "t") ly = n.y - 12;
      else if (n.lp === "b") ly = n.y + 20;
      else if (n.lp === "e" || n.lp === "r") { lx = n.x + (n.lp === "r" ? 13 : 11); ly = n.y + 4; anc = "start"; }
      else if (n.lp === "s" || n.lp === "l") { lx = n.x - 11; ly = n.y + 4; anc = "end"; }
      else ly = n.y + 20;
      tx.setAttribute("x", lx); tx.setAttribute("y", ly); tx.setAttribute("text-anchor", anc);
      tx.setAttribute("font-size", "11.5"); tx.setAttribute("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif');
      tx.setAttribute("fill", "#111111"); tx.setAttribute("stroke", "#ffffff"); tx.setAttribute("stroke-width", "3"); tx.setAttribute("paint-order", "stroke");
      tx.textContent = n.t; g.appendChild(tx);
      g.__nid = n.id;
      gn.appendChild(g); nodeEls[n.id] = { g: g, sh: sh, tx: tx };
      if (canHover) g.addEventListener("mouseenter", function () { if (!pointerDown) select(n.id); });
      if (!mobileMode) g.addEventListener("click", function () {
        if (canHover) go(n); else if (selected === n.id) go(n); else select(n.id);
      });
    });
    function go(n) { if (!n.href) return; var dst = /^https?:/.test(n.href) ? n.href : base + n.href; var top = window.top || window; try { top.location.href = dst; } catch (err) { window.location.href = dst; } }
    function clearHi() {
      eLines.forEach(function (l) { l.setAttribute("stroke", "#cfcfca"); l.setAttribute("stroke-width", "1"); l.setAttribute("opacity", "0.5"); });
      N.forEach(function (n) { nodeEls[n.id].g.style.opacity = "1"; nodeEls[n.id].tx.setAttribute("font-weight", "400"); });
    }
    var selected = null;
    function select(id) {
      selected = id; clearHi();
      var n = byId[id], col = CAT[n.c], nbr = {};
      n.adj.forEach(function (a) { nbr[a.o] = 1; });
      N.forEach(function (m) { if (m.id !== id && !nbr[m.id]) nodeEls[m.id].g.style.opacity = "0.26"; });
      nodeEls[id].tx.setAttribute("font-weight", "500");
      Object.keys(nbr).forEach(function (k) { nodeEls[k].tx.setAttribute("font-weight", "500"); });
      eLines.forEach(function (l) {
        if (l.dataset.a === id || l.dataset.b === id) { l.setAttribute("stroke", col); l.setAttribute("stroke-width", "2"); l.setAttribute("opacity", "0.9"); }
        else l.setAttribute("opacity", "0.08");
      });
      var openHtml = "";
      if (n.c === "macro") {
        if (n.href) openHtml = ' <a class="fg-open" href="' + n.href + '" target="_blank" rel="noopener">Data source ↗</a>';
      } else {
        openHtml = ' <a class="fg-open" href="' + base + n.href + '" target="_top">Open page ↗</a>';
      }
      head.innerHTML = '<span class="fg-dot" style="background:' + col + '"></span>' + esc(n.t) + openHtml;
      body.innerHTML = n.adj.map(function (a) {
        return '<div class="fg-row" data-go="' + a.o + '"><b>' + esc(byId[a.o].t) + '</b> — ' + esc(a.r) + "</div>";
      }).join("");
      body.querySelectorAll(".fg-row").forEach(function (row) {
        row.addEventListener("click", function () { select(row.dataset.go); });
      });
    }

    var resetBtn = document.getElementById("fg-reset");
    var hintEl = document.getElementById("fg-hint");
    if (!mobileMode) {
      if (resetBtn) resetBtn.style.display = "none";
      if (hintEl) hintEl.style.display = "none";
    } else {
      svg.style.touchAction = "none";
      var view = document.getElementById("fg-view");
      var vt = { s: 1, x: 0, y: 0 };
      var applyView = function () { view.setAttribute("transform", "translate(" + vt.x + "," + vt.y + ") scale(" + vt.s + ")"); };
      var clampS = function (s) { return Math.max(0.5, Math.min(6, s)); };
      var toView = function (cx, cy) { var m = svg.getScreenCTM(); if (!m) return { x: cx, y: cy }; var p = svg.createSVGPoint(); p.x = cx; p.y = cy; return p.matrixTransform(m.inverse()); };
      var zoomAt = function (P, ns) { ns = clampS(ns); var f = ns / vt.s; vt.x = P.x - f * (P.x - vt.x); vt.y = P.y - f * (P.y - vt.y); vt.s = ns; applyView(); };
      var tapNode = function (id) { if (selected === id) go(byId[id]); else select(id); };
      var pts = {}, last = null, moved = false, downTarget = null, startC = null, pinchLast = null;
      svg.addEventListener("pointerdown", function (e) {
        try { svg.setPointerCapture(e.pointerId); } catch (err) {}
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        pointerDown = true;
        if (Object.keys(pts).length === 1) { moved = false; downTarget = e.target; startC = { x: e.clientX, y: e.clientY }; last = toView(e.clientX, e.clientY); }
      });
      svg.addEventListener("pointermove", function (e) {
        if (!pts[e.pointerId]) return;
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(pts);
        if (ids.length >= 2) {
          var a = pts[ids[0]], b = pts[ids[1]];
          var dist = Math.hypot(a.x - b.x, a.y - b.y);
          var mid = toView((a.x + b.x) / 2, (a.y + b.y) / 2);
          if (pinchLast) zoomAt(mid, vt.s * (dist / pinchLast));
          pinchLast = dist; moved = true; e.preventDefault(); return;
        }
        var P = toView(e.clientX, e.clientY);
        if (startC && Math.hypot(e.clientX - startC.x, e.clientY - startC.y) > 6) moved = true;
        if (moved && last) { vt.x += P.x - last.x; vt.y += P.y - last.y; applyView(); }
        last = P; e.preventDefault();
      });
      var endPtr = function (e) {
        delete pts[e.pointerId];
        var n = Object.keys(pts).length;
        if (n < 2) pinchLast = null;
        if (n === 0) {
          pointerDown = false;
          if (!moved && downTarget && downTarget.closest) { var g = downTarget.closest(".fg-node"); if (g && g.__nid) tapNode(g.__nid); }
          last = null; startC = null; downTarget = null;
        }
      };
      svg.addEventListener("pointerup", endPtr);
      svg.addEventListener("pointercancel", endPtr);
      svg.addEventListener("wheel", function (e) { e.preventDefault(); zoomAt(toView(e.clientX, e.clientY), vt.s * (e.deltaY < 0 ? 1.12 : 0.89)); }, { passive: false });
      if (resetBtn) resetBtn.addEventListener("click", function () { vt = { s: 1, x: 0, y: 0 }; applyView(); });
    }
  }
})();
