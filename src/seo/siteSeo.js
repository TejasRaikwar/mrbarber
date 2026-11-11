/**
 * Single source of truth for SEO: business facts, landing-page copy, and the
 * <head> / static-HTML renderers.
 *
 * Imported in two places, so it must stay plain JS with no imports:
 *   - the React app (useSeo + the landing pages render from this data)
 *   - vite.config.js, which pre-renders every public route into its own
 *     dist/<route>/index.html at build time, so crawlers and link-preview bots
 *     get real titles, descriptions and content without running JavaScript.
 *
 * Business facts were carried over from the previous site (mrbarberhairpatch.com).
 */

export const SITE = {
    url: "https://mrbarberhairpatch.com",
    name: "Mr Barber",
    legalName: "Mr Barber Hair Patch",
    city: "Nagpur",
    region: "Maharashtra",
    phone: "+91 8421413110",
    email: "mrbarberhairpatch@gmail.com",
    founder: "Swapnil Laxne",
    // Still hosted on the old WordPress site — replace with a file in /public
    // before WordPress is switched off, or link previews lose their image.
    ogImage: "https://mrbarberhairpatch.com/wp-content/uploads/2022/04/IMG_1444.jpg",
    ogImageWidth: 3024,
    ogImageHeight: 4032,
    defaultTitle: "Mr barber Hair Patch in Nagpur",
    defaultDescription:
        "We are in hair industry from last 5 years and Mr Barber deliver best hair patch service in Nagpur. We are here solve your hair loss problems.",
    sameAs: [
        "https://www.facebook.com/maddy.laxne",
        "https://instagram.com/swapnillaxne3",
        "https://youtube.com/channel/UCG-g6h6s0vIB21b1-HSMrng"
    ],
    hours: { opens: "09:00", closes: "22:00", label: "Open all 7 days, 9:00 AM – 10:00 PM" }
}

export const BRANCHES = [
    {
        slug: "hair-patch-wathoda-nagpur",
        id: "salon-wathoda",
        name: "Mr Barber Hair Patch – Wathoda Layout",
        area: "Wathoda Layout",
        streetAddress: "Plot no 11, behind Gas godown, Anmol Nagar, Wathoda Layout",
        postalCode: "440008",
        // Add { latitude, longitude } once known — it strengthens the Maps listing.
        geo: null,
        intro: [
            "Our Wathoda Layout studio in Anmol Nagar serves clients from East Nagpur — Wathoda, Dighori, Hudkeshwar, Nandanvan and the areas around them — with private consultations for hair patch, hair fixing and hair replacement.",
            "Every appointment starts with a one-to-one look at your hair loss pattern, so the system we recommend matches your hairline, density and daily routine."
        ]
    },
    {
        slug: "hair-patch-gokulpeth-nagpur",
        id: "salon-gokulpeth",
        name: "Mr Barber Hair Patch – Gokulpeth",
        area: "Gokulpeth, Dharampeth",
        streetAddress: "Shop No. 25, Khare Chember, Gokulpeth, Dharampeth",
        postalCode: "440010",
        geo: null,
        intro: [
            "Our Gokulpeth studio in Khare Chember, Dharampeth is the easiest stop for clients from West and Central Nagpur — Dharampeth, Ramdaspeth, Shankar Nagar, Civil Lines and Sadar.",
            "Visit for a consultation, a new hair patch, or regular maintenance and re-fixing of the system you already wear."
        ]
    }
]

export const SERVICES = [
    {
        slug: "hair-patch-nagpur",
        name: "Hair Patch",
        title: "Hair Patch in Nagpur | Non-Surgical Hair Patch – Mr Barber",
        description:
            "Natural-looking hair patch in Nagpur. Custom-fitted, colour-matched non-surgical hair patches at Mr Barber, Wathoda & Gokulpeth. Book a consultation.",
        h1: "Hair Patch in Nagpur",
        intro: [
            "A hair patch is a thin, breathable base with real or high-grade hair that is fixed over the thinning area and blended into your own hair. It is the fastest way to get a full head of hair back — no surgery, no medicines and no waiting for regrowth.",
            "At Mr Barber we cut, colour-match and style every hair patch to your face, so the hairline looks natural up close and the patch moves with your own hair."
        ],
        highlights: [
            "Instant result — walk out with full coverage the same day",
            "Non-surgical and painless, with no recovery time",
            "Hair colour, density and texture matched to your own",
            "Lace, skin and mono bases to suit your lifestyle",
            "Styled and cut to suit your face shape"
        ],
        steps: [
            "Consultation — we study your hair loss area and talk through your routine",
            "Selection — choose the base, hair type and density that suits you",
            "Fixing — the patch is fixed, blended and cut into your own hair",
            "Aftercare — we show you how to wash and style it, and schedule maintenance"
        ],
        faqs: [
            {
                q: "Will people be able to tell I am wearing a hair patch?",
                a: "A well-fitted patch with a matched colour and a properly blended hairline is very hard to spot. We cut and style it with your own hair so it reads as natural."
            },
            {
                q: "Can I bath, swim or go to the gym with a hair patch?",
                a: "Yes. A properly fixed patch stays in place during everyday activities, workouts and washing. We explain the care routine for the base you choose."
            },
            {
                q: "How often does a hair patch need maintenance?",
                a: "Most clients come back every few weeks for cleaning and re-fixing. The exact interval depends on the base type and your scalp, and we will set a schedule that suits you."
            }
        ]
    },
    {
        slug: "hair-fixing-nagpur",
        name: "Hair Fixing",
        title: "Hair Fixing in Nagpur | Tape & Glue Hair Fixing – Mr Barber",
        description:
            "Professional hair fixing in Nagpur with medical-grade tapes and glues. Secure, comfortable and natural-looking. Visit Mr Barber in Wathoda or Gokulpeth.",
        h1: "Hair Fixing in Nagpur",
        intro: [
            "Hair fixing attaches a hair system to your scalp with skin-safe tapes or adhesive, so it stays secure through work, travel and workouts. It is the method most of our clients choose for everyday wear.",
            "We prepare the scalp, choose the right bonding for your skin and lifestyle, and fix the system so the edges stay flat and invisible."
        ],
        highlights: [
            "Skin-safe, medical-grade tapes and adhesives",
            "Secure hold for daily wear, sports and travel",
            "Clean, flat edges that blend into your own hair",
            "Quick re-fixing and cleaning appointments",
            "Suits both new and existing hair systems"
        ],
        steps: [
            "Scalp check — we look at your skin type and the area to be covered",
            "Preparation — the scalp is cleaned and the bonding area is prepared",
            "Fixing — tape or adhesive is applied and the system is set in place",
            "Finishing — the hair is blended, cut and styled"
        ],
        faqs: [
            {
                q: "Is hair fixing safe for my skin?",
                a: "We use skin-safe products and check your scalp first. If you have sensitive skin, tell us and we will pick a suitable tape or adhesive."
            },
            {
                q: "How long does hair fixing last?",
                a: "It depends on the bonding and how active you are. Most clients return every few weeks to clean the system and re-fix it."
            },
            {
                q: "Can you re-fix a patch I bought elsewhere?",
                a: "Yes. Bring your existing system and we will check its condition, clean it and fix it properly."
            }
        ]
    },
    {
        slug: "hair-bonding-nagpur",
        name: "Hair Bonding",
        title: "Hair Bonding in Nagpur | Long-Lasting Hair Bonding – Mr Barber",
        description:
            "Hair bonding in Nagpur for a strong, long-lasting hold. Natural hairline, comfortable wear and expert aftercare at Mr Barber, Wathoda & Gokulpeth.",
        h1: "Hair Bonding in Nagpur",
        intro: [
            "Hair bonding uses a stronger, longer-lasting adhesive to attach a hair system, so it can stay on for longer between appointments. It is a good fit if you want a low-maintenance, always-on look.",
            "We match the bond to your scalp and the base of your system, so it stays comfortable and the hairline stays natural."
        ],
        highlights: [
            "Strong bond for longer wear between visits",
            "Comfortable on the scalp, with no stitching or surgery",
            "Natural-looking front hairline",
            "Safe removal and re-bonding at our studio",
            "Advice on caring for a bonded system at home"
        ],
        steps: [
            "Consultation — we check your scalp and choose the right bond",
            "Preparation — the scalp and system base are cleaned and prepared",
            "Bonding — the system is bonded and pressed into place",
            "Styling — the hair is blended, cut and styled with your own"
        ],
        faqs: [
            {
                q: "What is the difference between hair bonding and hair fixing?",
                a: "Both attach a hair system to the scalp. Bonding uses a stronger adhesive for longer wear, while tape fixing is quicker to remove and re-apply."
            },
            {
                q: "Does hair bonding damage my natural hair?",
                a: "The bond is applied to the scalp area being covered, not to the surrounding hair. Safe removal at the studio protects your skin and the system."
            },
            {
                q: "How do I remove a bonded system?",
                a: "Please don't pull it off yourself. Visit us and we will remove it safely with the right solvent, clean the scalp and re-bond."
            }
        ]
    },
    {
        slug: "hair-extension-nagpur",
        name: "Hair Extension",
        title: "Hair Extensions in Nagpur | Length & Volume – Mr Barber",
        description:
            "Hair extensions in Nagpur for instant length and volume. Colour-matched, natural-looking extensions fitted by Mr Barber in Wathoda and Gokulpeth.",
        h1: "Hair Extensions in Nagpur",
        intro: [
            "Hair extensions add length, volume or both, using hair that is colour-matched and blended into your own. They are a quick way to change your look for a wedding, an event, or every day.",
            "We help you choose the right type and amount of hair, then fit and style the extensions so the joins stay hidden."
        ],
        highlights: [
            "Instant length and volume",
            "Colour and texture matched to your hair",
            "Hidden joins and a natural fall",
            "Options for everyday wear or special occasions",
            "Care and maintenance guidance"
        ],
        steps: [
            "Consultation — we discuss the length, volume and look you want",
            "Matching — hair is chosen to match your colour and texture",
            "Fitting — the extensions are attached and blended",
            "Styling — finished with a cut and style"
        ],
        faqs: [
            {
                q: "Will the extensions match my hair colour?",
                a: "Yes. We match colour and texture before fitting, and blend the extensions so they look like your own hair."
            },
            {
                q: "Can I style extensions with heat?",
                a: "Most quality extensions can be styled with heat in moderation. We will tell you what is safe for the hair you choose."
            },
            {
                q: "How long do hair extensions last?",
                a: "It depends on the type of extension and how you care for it. We will explain the expected life and maintenance when you choose."
            }
        ]
    },
    {
        slug: "hair-replacement-nagpur",
        name: "Hair Replacement",
        title: "Hair Replacement in Nagpur | Non-Surgical Hair Replacement – Mr Barber",
        description:
            "Non-surgical hair replacement in Nagpur for baldness and thinning hair. Custom hair systems, natural hairlines and ongoing care at Mr Barber.",
        h1: "Non-Surgical Hair Replacement in Nagpur",
        intro: [
            "Non-surgical hair replacement restores a full head of hair with a custom hair system — no transplant, no surgery and no downtime. It works for advanced baldness, crown thinning and receding hairlines alike.",
            "We design the system around your hair loss pattern, then fit, cut and style it so the result looks natural from every angle."
        ],
        highlights: [
            "Works at any stage of hair loss",
            "No surgery, no scars and no recovery time",
            "Custom-sized system for your hair loss area",
            "Natural front hairline and crown",
            "Ongoing maintenance and replacement support"
        ],
        steps: [
            "Assessment — we map your hair loss area and discuss your goals",
            "Design — choose the base, hair type, colour and density",
            "Fitting — the system is fixed, blended and styled",
            "Care plan — regular maintenance visits keep it looking new"
        ],
        faqs: [
            {
                q: "Is hair replacement better than a hair transplant?",
                a: "They suit different needs. Hair replacement gives an instant, full result without surgery and works even with very little donor hair; a transplant is a surgical procedure. We are happy to talk through which fits you."
            },
            {
                q: "Does it work for complete baldness?",
                a: "Yes. A hair system can cover anything from a small thinning patch to full baldness."
            },
            {
                q: "How long does a hair system last?",
                a: "With regular maintenance, a system typically lasts several months before it needs replacing. The exact life depends on the base type and how you care for it."
            }
        ]
    }
]

// ─── URLs ────────────────────────────────────────────────────────────────

export const absoluteUrl = (path = "/") => `${SITE.url}${path === "/" ? "/" : path}`

export const servicePath = (s) => `/${s.slug}`
export const branchPath = (b) => `/${b.slug}`

/**
 * Landing page for an admin-entered service title, matched on the service name
 * ("Premium Hair Replacement" → /hair-replacement-nagpur). Null when nothing matches.
 */
export const findServiceForTitle = (title) => {
    const t = String(title || "").toLowerCase()
    return SERVICES.find((s) => t.includes(s.name.toLowerCase())) || null
}

export const branchAddressLine = (b) =>
    `${b.streetAddress}, ${SITE.city}, ${SITE.region} ${b.postalCode}`

/** Google Maps directions/search link for a branch. */
export const directionsUrl = (b) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mr Barber, ${branchAddressLine(b)}`)}`

// ─── Structured data ─────────────────────────────────────────────────────

const ORG_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`
const branchId = (b) => `${SITE.url}/#${b.id}`

const branchSchema = (b) => ({
    "@type": "HairSalon",
    "@id": branchId(b),
    name: b.name,
    parentOrganization: { "@id": ORG_ID },
    url: absoluteUrl(branchPath(b)),
    image: SITE.ogImage,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
        "@type": "PostalAddress",
        streetAddress: b.streetAddress,
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        postalCode: b.postalCode,
        addressCountry: "IN"
    },
    ...(b.geo
        ? { geo: { "@type": "GeoCoordinates", latitude: b.geo.latitude, longitude: b.geo.longitude } }
        : {}),
    areaServed: { "@type": "City", name: SITE.city },
    openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes
    }
})

/** Business-wide graph, identical on every page. */
export const siteJsonLd = () => ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": WEBSITE_ID,
            name: SITE.name,
            url: absoluteUrl("/"),
            description: SITE.defaultDescription,
            inLanguage: "en-IN",
            publisher: { "@id": ORG_ID }
        },
        {
            "@type": "Organization",
            "@id": ORG_ID,
            name: SITE.name,
            legalName: SITE.legalName,
            url: absoluteUrl("/"),
            logo: absoluteUrl("/favicon.svg"),
            email: SITE.email,
            telephone: SITE.phone,
            founder: { "@type": "Person", name: SITE.founder },
            sameAs: SITE.sameAs,
            makesOffer: SERVICES.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(servicePath(s)) }
            }))
        },
        ...BRANCHES.map(branchSchema)
    ]
})

const breadcrumb = (name, path) => ({
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) }
    ]
})

// ─── Routes ──────────────────────────────────────────────────────────────

/**
 * Every public, indexable route with its head data. `kind` tells the renderers
 * which body to produce. Order is the sitemap order.
 */
const buildSeoRoutes = () => [
    {
        path: "/",
        kind: "home",
        title: SITE.defaultTitle,
        description: SITE.defaultDescription,
        priority: "1.0",
        pageJsonLd: null
    },
    ...SERVICES.map((s) => ({
        path: servicePath(s),
        kind: "service",
        data: s,
        title: s.title,
        description: s.description,
        priority: "0.9",
        pageJsonLd: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Service",
                    "@id": `${absoluteUrl(servicePath(s))}#service`,
                    name: `${s.name} in ${SITE.city}`,
                    serviceType: s.name,
                    description: s.description,
                    url: absoluteUrl(servicePath(s)),
                    provider: { "@id": ORG_ID },
                    areaServed: { "@type": "City", name: SITE.city },
                    availableChannel: BRANCHES.map((b) => ({
                        "@type": "ServiceChannel",
                        serviceLocation: { "@id": branchId(b) }
                    }))
                },
                {
                    "@type": "FAQPage",
                    mainEntity: s.faqs.map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: { "@type": "Answer", text: f.a }
                    }))
                },
                breadcrumb(s.h1, servicePath(s))
            ]
        }
    })),
    ...BRANCHES.map((b) => ({
        path: branchPath(b),
        kind: "branch",
        data: b,
        title: `Hair Patch in ${b.area}, Nagpur | ${SITE.name}`,
        description: `Hair patch, fixing, bonding and hair replacement at Mr Barber, ${b.area}, Nagpur. Open 7 days, 9 AM–10 PM. Call ${SITE.phone}.`,
        priority: "0.8",
        pageJsonLd: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    url: absoluteUrl(branchPath(b)),
                    name: b.name,
                    about: { "@id": branchId(b) }
                },
                breadcrumb(b.area, branchPath(b))
            ]
        }
    }))
]

let cachedRoutes = null
export const getSeoRoutes = () => (cachedRoutes ??= buildSeoRoutes())

export const findSeoRoute = (path) => getSeoRoutes().find((r) => r.path === path) || null

// ─── HTML renderers (used by the build-time pre-renderer) ────────────────

const esc = (v) =>
    String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")

// JSON inside <script> only needs "</" neutralised.
const jsonScript = (id, obj) =>
    `<script type="application/ld+json" id="${id}">${JSON.stringify(obj).replace(/<\//g, "<\\/")}</script>`

/** Everything SEO-related that goes in <head> for one route. */
export const renderHead = (route, { googleVerification, bingVerification } = {}) => {
    const url = absoluteUrl(route.path)
    const lines = [
        `<title>${esc(route.title)}</title>`,
        `<meta name="description" content="${esc(route.description)}" />`,
        `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
        `<link rel="canonical" href="${esc(url)}" />`,
        `<meta property="og:locale" content="en_IN" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${esc(route.title)}" />`,
        `<meta property="og:description" content="${esc(route.description)}" />`,
        `<meta property="og:url" content="${esc(url)}" />`,
        `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
        `<meta property="og:image" content="${esc(SITE.ogImage)}" />`,
        `<meta property="og:image:width" content="${SITE.ogImageWidth}" />`,
        `<meta property="og:image:height" content="${SITE.ogImageHeight}" />`,
        `<meta property="og:image:alt" content="${esc(SITE.legalName)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="geo.region" content="IN-MH" />`,
        `<meta name="geo.placename" content="${esc(SITE.city)}" />`
    ]
    if (googleVerification) lines.push(`<meta name="google-site-verification" content="${esc(googleVerification)}" />`)
    if (bingVerification) lines.push(`<meta name="msvalidate.01" content="${esc(bingVerification)}" />`)
    lines.push(jsonScript("ld-site", siteJsonLd()))
    if (route.pageJsonLd) lines.push(jsonScript("ld-page", route.pageJsonLd))
    return lines.join("\n    ")
}

const contactBlock = () => `
  <h2 class="text-2xl font-bold mt-10 mb-3">Visit Mr Barber in Nagpur</h2>
  <ul class="space-y-2">
    ${BRANCHES.map(
        (b) =>
            `<li><a class="underline" href="${branchPath(b)}">${esc(b.area)}</a> — ${esc(branchAddressLine(b))}</li>`
    ).join("\n    ")}
  </ul>
  <p class="mt-3">${esc(SITE.hours.label)} · Call <a class="underline" href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a> · <a class="underline" href="mailto:${SITE.email}">${esc(SITE.email)}</a></p>`

const serviceLinks = (exclude) => `
  <h2 class="text-2xl font-bold mt-10 mb-3">Our services</h2>
  <ul class="space-y-1">
    ${SERVICES.filter((s) => s.slug !== exclude)
        .map((s) => `<li><a class="underline" href="${servicePath(s)}">${esc(s.name)} in ${SITE.city}</a></li>`)
        .join("\n    ")}
  </ul>`

const wrap = (inner) =>
    `<div class="max-w-3xl mx-auto px-6 pt-28 pb-16 text-foreground leading-relaxed"><nav class="mb-6 text-sm"><a class="underline" href="/">${esc(SITE.name)}</a></nav>${inner}</div>`

/**
 * Plain-HTML version of a route's content, placed inside #root. React replaces
 * it on mount; until then (and for crawlers that don't run JS) it carries the
 * same text the real page shows.
 */
export const renderBody = (route) => {
    if (route.kind === "service") {
        const s = route.data
        return wrap(`
  <h1 class="text-4xl font-extrabold mb-5">${esc(s.h1)}</h1>
  ${s.intro.map((p) => `<p class="mb-4">${esc(p)}</p>`).join("\n  ")}
  <h2 class="text-2xl font-bold mt-10 mb-3">Why choose ${esc(s.name.toLowerCase())} at Mr Barber</h2>
  <ul class="list-disc pl-6 space-y-1">${s.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
  <h2 class="text-2xl font-bold mt-10 mb-3">How it works</h2>
  <ol class="list-decimal pl-6 space-y-1">${s.steps.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
  <h2 class="text-2xl font-bold mt-10 mb-3">${esc(s.name)} — frequently asked questions</h2>
  ${s.faqs.map((f) => `<h3 class="font-semibold mt-4">${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n  ")}
  ${contactBlock()}
  ${serviceLinks(s.slug)}`)
    }
    if (route.kind === "branch") {
        const b = route.data
        return wrap(`
  <h1 class="text-4xl font-extrabold mb-5">Hair Patch in ${esc(b.area)}, Nagpur</h1>
  ${b.intro.map((p) => `<p class="mb-4">${esc(p)}</p>`).join("\n  ")}
  <h2 class="text-2xl font-bold mt-10 mb-3">Address &amp; hours</h2>
  <p>${esc(branchAddressLine(b))}</p>
  <p>${esc(SITE.hours.label)} · Call <a class="underline" href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a></p>
  ${serviceLinks(null)}`)
    }
    return wrap(`
  <h1 class="text-4xl font-extrabold mb-5">Hair Patch &amp; Hair Replacement in Nagpur</h1>
  <p class="mb-4">${esc(SITE.defaultDescription)}</p>
  ${serviceLinks(null)}
  ${contactBlock()}`)
}

export const renderSitemap = (lastmod) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${getSeoRoutes()
    .map(
        (r) => `  <url>
    <loc>${absoluteUrl(r.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>
`
