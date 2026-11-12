// Phones only: tell the Local Threads page how tall the current step really is, so
// the page can size the iframe to it and nothing scrolls inside the frame.
//
// Sizing only. This adds no step, field, copy or style, and the form renders exactly
// as before. It posts the one message the LT ad landing pages already listen for
// (their OBG-LP-PUNCHUP `lt-quote-height` script, origin-checked to
// quote-request-green.vercel.app, ignored above 860px wide, clamped 360 to 1400):
//   { event: 'lt-quote-height', height: <px> }
//
// Every slide root is `h-screen overflow-y-auto`, and inside an iframe 100vh is the
// frame's own height, so measuring the root would echo the frame back in a loop.
// Instead this measures the slide's in-flow children (the text column and the
// photo), which size to their content on phones, so the number never depends on the
// frame height. At 768px and up (the md: two-column layout) nothing is posted and the
// page keeps its own CSS height.
const MOBILE_MAX = 767;
const SLIDE = '#root .bgColor.h-screen';

function contentHeight() {
    let h = 0;
    document.querySelectorAll(SLIDE).forEach((slide) => {
        let top = Infinity;
        let bottom = -Infinity;
        for (const child of slide.children) {
            const pos = getComputedStyle(child).position;
            if (pos === 'fixed' || pos === 'absolute') continue;
            const r = child.getBoundingClientRect();
            if (!r.height) continue;
            top = Math.min(top, r.top);
            bottom = Math.max(bottom, r.bottom);
        }
        if (bottom > top) h = Math.max(h, Math.ceil(bottom - top));
    });
    return h;
}

export function reportHeight() {
    if (window.parent === window) return;

    let last = 0;
    let frame = 0;

    const send = (force) => {
        frame = 0;
        if (window.innerWidth > MOBILE_MAX) { last = 0; return; }
        const h = contentHeight();
        if (!h || (h === last && force !== true)) return;
        last = h;
        try { window.parent.postMessage({ event: 'lt-quote-height', height: h }, '*'); } catch { /* parent gone */ }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => send()); };

    // Re-measure when a step's text column or photo changes size (photo load, fonts,
    // an error line) and whenever a new step mounts.
    const ro = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
    const observe = () => {
        if (ro) {
            ro.disconnect();
            document.querySelectorAll(SLIDE).forEach((slide) => {
                for (const child of slide.children) ro.observe(child);
            });
        }
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
