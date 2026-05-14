const OFFICIAL_SITE = "https://www.theberman.eu";

const counties = [
  "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry",
  "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth",
  "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary",
  "Waterford", "Westmeath", "Wexford", "Wicklow"
];

const serviceData = {
  ber: {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900",
    alt: "Irish home used for BER certificate guidance",
    kicker: "Book local assessors",
    title: "Compare BER cert quotes without ringing assessor after assessor.",
    copy: "The official site lets you choose a preferred assessment date, post property details, receive quotes, and book online with SEAI registered assessors.",
    bullets: [
      "Useful for selling, renting, mortgage requests and grants.",
      "Nationwide county coverage.",
      "Competitive quotes from local assessors."
    ],
    link: `${OFFICIAL_SITE}/get-quote`,
    cta: "Get a Free Quote"
  },
  advisor: {
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=900",
    alt: "Home energy advisory and retrofit planning",
    kicker: "Free energy agent route",
    title: "Get impartial guidance before choosing upgrade work.",
    copy: "The Berman energy agent can organise technical input, work with a BER assessor, compare contractor quotes and help with SEAI grant paperwork.",
    bullets: [
      "Independent from contractors.",
      "Helps avoid unnecessary or overpriced works.",
      "Connects BER findings to practical improvement options."
    ],
    link: `${OFFICIAL_SITE}/hire-agent`,
    cta: "Hire an Energy Agent"
  },
  catalogue: {
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=900",
    alt: "Solar panels and renewable home energy upgrades",
    kicker: "Upgrade partner catalogue",
    title: "Find home energy partners by county and service type.",
    copy: "The catalogue includes solar, insulation, heating, ventilation, windows, doors, retrofit support, builders providers and BER assessor listings.",
    bullets: [
      "Search by upgrade type.",
      "Filter by Irish county.",
      "Review local providers from the official catalogue."
    ],
    link: `${OFFICIAL_SITE}/catalogue`,
    cta: "Browse Catalogue"
  },
  business: {
    image: "https://res.cloudinary.com/djcjmsr9f/image/upload/v1772836732/lvbm2tivxl1ocbqemwxt.jpg",
    alt: "Solar and electrical services provider listed on The Berman",
    kicker: "For assessors and businesses",
    title: "Receive local BER and energy-upgrade leads.",
    copy: "Assessors can register for local job leads, while home energy businesses can join the catalogue and appear where homeowners are already researching upgrades.",
    bullets: [
      "Assessor registration path.",
      "Business catalogue registration.",
      "Local visibility for energy-related services."
    ],
    link: `${OFFICIAL_SITE}/signup?role=contractor`,
    cta: "Register as an Assessor"
  }
};

const plannerMessages = {
  Selling: "book early so the BER certificate is ready before listing, viewings and buyer checks.",
  Renting: "arrange the BER before advertising so compliance details are ready for prospective tenants.",
  "SEAI grant": "use the BER and advisory report to shape grant-backed upgrade decisions before contractor quotes.",
  "Mortgage or bank request": "prepare the rating before documentation deadlines so the lender has the energy-performance evidence.",
  "Upgrade planning": "start with a BER so insulation, heating, ventilation, windows or solar work is based on the home's real performance."
};

function withTracking(url) {
  if (!url.startsWith(OFFICIAL_SITE)) return url;
  const next = new URL(url);
  next.searchParams.set("utm_source", "seo_side_domain");
  next.searchParams.set("utm_medium", "referral");
  next.searchParams.set("utm_campaign", "ber_ireland_landing_page");
  return next.toString();
}

function setupOutboundTracking() {
  document.querySelectorAll("[data-outbound]").forEach((link) => {
    link.href = withTracking(link.href);
  });
}

function renderCounties(filter = "") {
  const grid = document.querySelector("[data-county-grid]");
  if (!grid) return;
  const normalized = filter.trim().toLowerCase();
  const visible = counties.filter((county) => county.toLowerCase().includes(normalized));
  grid.innerHTML = visible.map((county) => `
    <a class="county-card" href="${withTracking(`${OFFICIAL_SITE}/get-quote`)}" data-county="${county}">
      <strong>BER Cert ${county}</strong>
      <span>Compare local SEAI registered BER assessor quotes in ${county}.</span>
    </a>
  `).join("");
}

function setupCountySearch() {
  renderCounties();
  const search = document.querySelector("#countySearch");
  if (search) search.addEventListener("input", () => renderCounties(search.value));

  const select = document.querySelector("[data-county-select]");
  if (select) {
    select.innerHTML = counties.map((county) => `<option>${county}</option>`).join("");
  }
}

function setupServices() {
  const buttons = document.querySelectorAll("[data-tab]");
  const image = document.querySelector("[data-service-image]");
  const kicker = document.querySelector("[data-service-kicker]");
  const title = document.querySelector("[data-service-title]");
  const copy = document.querySelector("[data-service-copy]");
  const list = document.querySelector("[data-service-list]");
  const link = document.querySelector("[data-service-link]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const data = serviceData[button.dataset.tab];
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      image.src = data.image;
      image.alt = data.alt;
      kicker.textContent = data.kicker;
      title.textContent = data.title;
      copy.textContent = data.copy;
      list.innerHTML = data.bullets.map((bullet) => `<li>${bullet}</li>`).join("");
      link.href = withTracking(data.link);
      link.textContent = data.cta;
    });
  });
}

function setupPlanner() {
  const form = document.querySelector("[data-planner]");
  const result = document.querySelector("[data-planner-result]");
  if (!form || !result) return;

  const update = () => {
    const data = new FormData(form);
    const purpose = data.get("purpose");
    const county = data.get("county");
    const home = data.get("home").toLowerCase();
    result.textContent = `For a ${home} in ${county}, ${plannerMessages[purpose]}`;
  };

  form.addEventListener("input", update);
  update();
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function setupMenu() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!header || !toggle) return;
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

function decodeHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function articleFallback(topic) {
  return [
    {
      source: "The Berman Blog",
      title: "Complete Guide to BER Certificates in Ireland 2026",
      link: `${OFFICIAL_SITE}/blog/complete-guide-ber-certificates-ireland-2026`,
      description: "Legal requirements, costs, process and benefits for Irish homeowners."
    },
    {
      source: "SEAI",
      title: "SEAI home energy guidance",
      link: "https://www.seai.ie/",
      description: `Official national information related to ${topic.toLowerCase()}.`
    },
    {
      source: "The Berman",
      title: "Browse local home energy upgrade partners",
      link: `${OFFICIAL_SITE}/catalogue`,
      description: "Find businesses and energy consultants by service type and county."
    }
  ];
}

function renderArticles(articles, topic) {
  const target = document.querySelector("[data-articles]");
  if (!target) return;
  const rows = articles.length ? articles : articleFallback(topic);
  target.innerHTML = rows.slice(0, 5).map((article) => `
    <article>
      <span>${article.source || "Google News"}</span>
      <h3><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h3>
      <p>${article.description || "Related BER, SEAI or home energy update for Irish homeowners."}</p>
    </article>
  `).join("");
}

async function loadNews(topic = "BER certificate Ireland") {
  renderArticles([], topic);
  const rss = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-IE&gl=IE&ceid=IE:en`;
  const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;

  try {
    const response = await fetch(api, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("News feed unavailable");
    const payload = await response.json();
    const articles = (payload.items || []).map((item) => ({
      source: item.author || "Google News",
      title: decodeHtml(item.title || ""),
      link: item.link || OFFICIAL_SITE,
      description: decodeHtml(item.description || item.content || "").replace(/<[^>]+>/g, " ").trim().slice(0, 180)
    })).filter((article) => article.title && article.link);
    renderArticles(articles, topic);
  } catch (error) {
    renderArticles(articleFallback(topic), topic);
  }
}

function setupNews() {
  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-topic]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      loadNews(button.dataset.topic);
    });
  });
  loadNews();
}

setupOutboundTracking();
setupCountySearch();
setupServices();
setupPlanner();
setupReveal();
setupMenu();
setupNews();
