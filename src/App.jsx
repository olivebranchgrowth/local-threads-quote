import { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from '/images/local-threads-wordmark.png';
import QtySlide from './pages/QtySlide';
import WhatSlide from './pages/WhatSlide';
import ArtworkSlide from './pages/ArtworkSlide';
import ContactSlide from './pages/ContactSlide';
import ConfirmSlide from './pages/ConfirmSlide';
import SlideTransition from './components/SlideTransition';
import introImage from '/images/slide-intro.jpg';
import projectImage from '/images/slide-project.jpg';
import quantityImage from '/images/slide-quantity.jpg';
import contactImage from '/images/slide-contact.jpg';
import { sendQuoteRequest } from './utils/emailService';
import { leadValue } from './utils/leadValue';
import { shapeLead, qtyForValue } from './utils/leadShape';
import { initAnalytics, trackFunnelStep } from './utils/analytics';

// 2026-11-10: tap-first (the Sublime / 456 pattern). How many (one tap), what (tap all),
// art (optional), then name + email last, phone optional. See utils/leadShape.js for why.
function App() {
  const [currentSlide, setCurrentSlide] = useState('qty');
  const [transitionDirection, setTransitionDirection] = useState('left');
  const [answers, setAnswers] = useState({ qty: '', items: [], name: '', email: '', phone: '', notes: '' });
  const [art, setArt] = useState({ attachment: null, artworkDescription: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendError, setSendError] = useState('');
  // Synchronous submit lock: useState is async, so two quick taps could both send.
  const submittingRef = useRef(false);

  useEffect(() => {
    initAnalytics();
  }, []);

  // Log every step. The parent page gets a quote_step message (no personal data) so the
  // Ads Hub recorder can finally see which step people leave on; the old form told the
  // parent nothing until the final send.
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'slideView', slideName: currentSlide });
    trackFunnelStep(currentSlide);
    try {
      window.parent.postMessage({ event: 'quote_step', step: currentSlide }, '*');
    } catch { /* parent gone */ }
  }, [currentSlide]);

  const go = (slide, dir = 'left') => { setTransitionDirection(dir); setCurrentSlide(slide); };

  // Phones: tell the parent page how tall the current step's content is, so a page that
  // listens (the staged ad page punch-up) can size the frame to hug the step. Measured from
  // the step's own content column ([data-fit]), which is shrink-to-content on phones, so it
  // cannot echo-loop with the frame height. Desktop keeps its fixed frame.
  useEffect(() => {
    let last = 0;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (window.innerWidth >= 768) return;
        let h = 0;
        document.querySelectorAll('[data-fit]').forEach((c) => { h = Math.max(h, Math.ceil(c.getBoundingClientRect().height)); });
        if (!h || Math.abs(h - last) < 4) return;
        last = h;
        try { window.parent.postMessage({ event: 'lt-quote-height', height: h }, '*'); } catch { /* parent gone */ }
      });
    };
    const ro = new ResizeObserver(measure);
    const mo = new MutationObserver(() => { document.querySelectorAll('[data-fit]').forEach((c) => ro.observe(c)); measure(); });
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    document.querySelectorAll('[data-fit]').forEach((c) => ro.observe(c));
    measure();
    return () => { ro.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const submit = ({ name, email, phone, notes }) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSendError('');
    const next = { ...answers, name, email, phone, notes };
    setAnswers(next);
    setIsSubmitting(true);

    const lead = shapeLead(next);
    // The artwork note for the lead email. An uploaded file rides along as a real email
    // attachment; the note tells Ryan/Candice it is attached.
    const artworkParts = [];
    if (art.attachment) artworkParts.push(`File attached to this email: ${art.attachment.name}`);
    if (art.artworkDescription) artworkParts.push(art.artworkDescription);
    const updatedData = {
      ...lead,
      artwork: artworkParts.length ? artworkParts.join('<br>') : 'None provided',
      attachments: art.attachment ? [art.attachment] : [],
      client: 'Local Threads',
    };

    sendQuoteRequest(updatedData)
      .then(() => {
        // The parent theme fires the Google Ads "LT Quote Form Lead" conversion from this
        // message, with a matrix-derived value on a representative count for the range
        // tapped. A tracking failure must never block the lead.
        let leadVal;
        try {
          leadVal = leadValue(qtyForValue(lead.quantityRange), lead.service, lead.projectDetails);
        } catch (err) { console.error('leadValue failed, parent falls back to a flat number', err); }
        window.parent.postMessage({
          event: 'obgform_submission',
          name: lead.name,
          service: lead.service,
          quantity: Number(lead.quantity),
          quantity_range: lead.quantityRange,
          projectDetails: lead.projectDetails,
          ...(leadVal ? { conversion_value: leadVal.value, totalQuote: leadVal.value, currency: 'USD' } : {}),
        }, '*');
        go('confirm');
      })
      .catch((error) => {
        // Never advance on a failed send. The customer keeps their answers and sees the phone.
        console.error('Error sending quote request:', error);
        setSendError("Sorry, that didn't go through.");
      })
      .finally(() => {
        submittingRef.current = false;
        setIsSubmitting(false);
      });
  };

  return (
    <div className='relative w-full h-screen overflow-y-auto'>
      {currentSlide === 'qty' && (() => {
        // First paint renders the opener in place (no slide-in on page load).
        const slide = (
          <QtySlide
            logo={logo}
            image={introImage}
            value={answers.qty}
            onPick={(qty) => { setAnswers((a) => ({ ...a, qty })); go('what'); }}
          />
        );
        return transitionDirection === 'right'
          ? <SlideTransition keyProp='qty' direction={transitionDirection}>{slide}</SlideTransition>
          : slide;
      })()}
      {currentSlide === 'what' && (
        <SlideTransition keyProp='what' direction={transitionDirection}>
          <WhatSlide
            logo={logo}
            image={quantityImage}
            value={answers.items}
            onBack={() => go('qty', 'right')}
            onDone={(items) => { setAnswers((a) => ({ ...a, items })); go('artwork'); }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'artwork' && (
        <SlideTransition keyProp='artwork' direction={transitionDirection}>
          <ArtworkSlide
            logo={logo}
            image={projectImage}
            onBack={() => go('what', 'right')}
            onSubmit={({ attachment, artworkDescription }) => { setArt({ attachment, artworkDescription }); go('contactDetails'); }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'contactDetails' && (
        <SlideTransition keyProp='contactDetails' direction={transitionDirection}>
          <ContactSlide
            logo={logo}
            image={contactImage}
            onBack={() => go('artwork', 'right')}
            isSubmitting={isSubmitting}
            sendError={sendError}
            initial={answers}
            onSubmit={submit}
          />
        </SlideTransition>
      )}
      {currentSlide === 'confirm' && (
        <SlideTransition keyProp='confirm' direction={transitionDirection}>
          <ConfirmSlide logo={logo} image={introImage} />
        </SlideTransition>
      )}
    </div>
  );
}

export default App;
