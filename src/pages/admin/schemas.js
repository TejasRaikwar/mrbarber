// CrudPage schemas — one per simple content resource.

export const navLinksSchema = {
    resource: "nav-links",
    title: "Nav Links",
    description: "Header navigation. Hash maps to a section id on the home page (empty = top).",
    defaults: { label: "", hash: "", displayOrder: 0 },
    fields: [
        { key: "label", type: "text", label: "Label", required: true },
        { key: "hash", type: "text", label: "Section id (hash)", placeholder: "services" },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const heroSlidesSchema = {
    resource: "hero-slides",
    title: "Hero Slides",
    description: "Top-of-page rotating slides.",
    defaults: {
        subtitle: "", title: "", description: "",
        imageUrl: "",
        secondaryCtaLabel: "", secondaryCtaHref: "",
        displayOrder: 0
    },
    fields: [
        { key: "imageUrl", type: "image", label: "Background Image", fullWidth: true },
        { key: "subtitle", type: "text", label: "Subtitle (small caps line)", required: true },
        { key: "title", type: "text", label: "Title", required: true },
        { key: "description", type: "textarea", label: "Description", rows: 2, fullWidth: true },
        { key: "secondaryCtaLabel", type: "text", label: "Button label" },
        { key: "secondaryCtaHref", type: "navlink-select", label: "Button destination (section)" },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const marqueeSchema = {
    resource: "marquee",
    title: "Marquee Strip",
    description: "Yellow scrolling strip under the hero.",
    defaults: { text: "", displayOrder: 0 },
    fields: [
        { key: "text", type: "text", label: "Text", required: true },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const servicesSchema = {
    resource: "services",
    title: "Services",
    description: "The seven service cards in the Services section.",
    defaults: { title: "", description: "", iconName: "Scissors", displayOrder: 0 },
    fields: [
        { key: "title", type: "text", label: "Title", required: true },
        {
            key: "iconName",
            type: "text",
            label: "Icon name",
            placeholder: "Scissors, Layers, Repeat, Wrench, Link, Maximize2, Palette, …"
        },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const transformationsSchema = {
    resource: "transformations",
    title: "Transformations",
    description: "Before / After comparison cards.",
    defaults: { title: "", beforeImageUrl: "", afterImageUrl: "", displayOrder: 0 },
    fields: [
        { key: "title", type: "text", label: "Title", required: true, fullWidth: true },
        { key: "beforeImageUrl", type: "image", label: "Before image" },
        { key: "afterImageUrl", type: "image", label: "After image" },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const hairProfilesSchema = {
    resource: "hair-profiles",
    title: "Hair Profiles",
    description: "The 'Application for Different Hair Profiles' cards.",
    defaults: { title: "", description: "", beforeImageUrl: "", afterImageUrl: "", displayOrder: 0 },
    fields: [
        { key: "title", type: "text", label: "Title", required: true },
        { key: "description", type: "text", label: "Short description" },
        { key: "beforeImageUrl", type: "image", label: "Before image" },
        { key: "afterImageUrl", type: "image", label: "After image" },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const reviewsSchema = {
    resource: "reviews",
    title: "Reviews",
    description: "Customer testimonials shown in the scrolling marquee.",
    defaults: {
        authorName: "", location: "", rating: 5, quote: "",
        initials: "", avatarUrl: "", displayOrder: 0
    },
    fields: [
        { key: "authorName", type: "text", label: "Author name", required: true },
        { key: "location", type: "text", label: "Location" },
        { key: "rating", type: "number", label: "Rating (1-5)", min: 1, max: 5 },
        { key: "initials", type: "text", label: "Initials (avatar fallback)", placeholder: "RM" },
        { key: "avatarUrl", type: "image", label: "Avatar (optional)" },
        { key: "quote", type: "textarea", label: "Quote", rows: 4, fullWidth: true, required: true },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}

export const socialLinksSchema = {
    resource: "social-links",
    title: "Social Links",
    description: "Icons in the footer. Platform must be one of: Instagram, Facebook, Youtube.",
    defaults: { platform: "Instagram", url: "", displayOrder: 0 },
    fields: [
        { key: "platform", type: "text", label: "Platform", placeholder: "Instagram | Facebook | Youtube" },
        { key: "url", type: "text", label: "URL", required: true },
        { key: "displayOrder", type: "number", label: "Order" }
    ]
}
