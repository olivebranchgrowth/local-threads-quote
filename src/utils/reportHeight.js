// Tell the Local Threads page how tall the current step really is, so the page can
// size the iframe to it and nothing scrolls inside the frame.
//
// Sizing only. This adds no step, field, copy or style, and the form renders exactly
// as before. It posts one message, at every width:
//   { event: 'lt-quote-height', height: <px>, step: <slug>, top: <px> }
// - height: what the current step needs, so the frame never scrolls inside.
// - step:   the step's eyebrow as a slug ('free-quote', 'service-type' ...), no
//           personal data. It changes when the visitor moves to another step.
// - top:    where the step's question block starts inside the frame. On phones the
//           photo sits above it; on the two-column layout it is 0.
// The two LT ad landing pages already listen for this event (their OBG-LP-PUNCHUP
// script reads `height` below 861px wide and ignores the rest), and the theme's
// OBG LT quote-fit block sizes every quote frame on every page from it.
//
// Every slide root is `h-screen overflow-y-auto`, and inside an iframe 100vh is the
// frame's own height, so the root is never measured (it would echo the frame back in
// a loop). Below 768px the text column and the photo stack and size to their content,
// so their union is the step. At 768px and up they sit side by side in two columns
// stretched to the frame, so the step is the taller of the text column's own
// content (its children plus padding) and the photo at its natural aspect.
const MD = 768;
const SLIDE = '#root .bgColor.h-screen';

const px = (v) => parseFloat(v) || 0;
const inFlow = (el) => {
    const pos = getComputedStyle(el).position;
    return pos !== 'fixed' && pos !== 'absolute';
};

// A box's own content height, whatever height its parent stretched it to.
function contentExtent(box) {
    let top = Infinity;
    let bottom = -Infinity;
    for (const child of box.children) {
        if (!inFlow(child)) continue;
        const r = child.getBoundingClientRect();
        if (!r.height) continue;
        const m = getComputedStyle(child);
        top = Math.min(top, r.top - px(m.marginTop));
        bottom = Math.max(bottom, r.bottom + px(m.marginBottom));
    }
    if (bottom < top) return 0;
    const s = getComputedStyle(box);
    return bottom - top + px(s.paddingTop) + px(s.paddingBottom) + px(s.borderTopWidth) + px(s.borderBottomWidth);
}

// A photo box's height with its image at the natural aspect for its rendered width.
// Width never depends on the frame height, so neither does this.
function photoHeight(box) {
    let h = 0;
    box.querySelectorAll('img').forEach((img) => {
        const w = img.getBoundingClientRect().width;
        if (img.naturalWidth && w) h = Math.max(h, (w * img.naturalHeight) / img.naturalWidth);
    });
    return h;
}

function slug(text) {
    return (text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

function measure() {
    let best = null;
    document.querySelectorAll(SLIDE).forEach((slide) => {
        const kids = [...slide.children].filter(inFlow);
        const text = kids.find((c) => !c.classList.contains('imageOverlay')) || kids[0];
        if (!text) return;
        const photos = kids.filter((c) => c !== text);
        let height;
        let top = 0;
        if (window.innerWidth < MD) {
            // Stacked: text column plus each photo box at its full size (the intro photo
            // is capped at 100vh, i.e. the frame, so its box alone would echo the frame).
            height = text.getBoundingClientRect().height;
            for (const c of photos) height += Math.max(c.getBoundingClientRect().height, photoHeight(c));
            let lo = Infinity;
            for (const c of kids) lo = Math.min(lo, c.getBoundingClientRect().top);
            top = Math.max(0, Math.round(text.getBoundingClientRect().top - lo));
        } else {
            // Side by side: the row is the taller of the text column's own content and
            // each photo at its natural aspect for the column width.
            height = contentExtent(text);
            for (const c of photos) height = Math.max(height, photoHeight(c));
        }
        const step = slug((slide.querySelector('.eyebrow') || slide.querySelector('h1') || {}).textContent);
        if (height && (!best || height > best.height)) best = { height: Math.ceil(height), step, top };
    });
    return best;
}

export function reportHeight() {
    if (window.parent === window) return;

    let last = '';
    let frame = 0;

    const send = (force) => {
        frame = 0;
        const m = measure();
        if (!m) return;
        const key = `${m.height}|${m.step}|${m.top}`;
        if (key === last && force !== true) return;
        last = key;
        try {
            window.parent.postMessage({ event: 'lt-quote-height', height: m.height, step: m.step, top: m.top }, '*');
        } catch { /* parent gone */ }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => send()); };

    // Re-measure when a step's text column or photo changes size (photo load, fonts,
    // an error line), whenever a new step mounts, and when the frame changes width.
    const ro = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
    const observe = () => {
        if (ro) {
            ro.disconnect();
            document.querySelectorAll(SLIDE).forEach((slide) => {
                for (const child of slide.children) ro.observe(child);
            });
        }
        document.querySelectorAll(`${SLIDE} img`).forEach((img) => {
            if (!img.complete) img.addEventListener('load', schedule, { once: true });
        });
        schedule();
    };
    new MutationObserver(observe).observe(document.getElementById('root'), { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    // The page's listener can attach after the first message; say it again.
    setTimeout(() => send(true), 700);
    setTimeout(() => send(true), 2000);
    observe();
}
