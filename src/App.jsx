import { useState, useEffect } from 'react';
import './App.css';
import logo from '/images/local-threads-logo.png';
import IntroSlide from './pages/IntroSlide';
import ServiceSlide from './pages/ServiceSlide';
import ProjectSlide from './pages/ProjectSlide';
import QuantitySlide from './pages/QuantitySlide';
import ArtworkSlide from './pages/ArtworkSlide';
import ContactSlide from './pages/ContactSlide';
import ConfirmSlide from './pages/ConfirmSlide';
import SlideTransition from './components/SlideTransition';
import introImage from '/images/slide-intro.jpg';
import projectImage from '/images/slide-project.jpg';
import quantityImage from '/images/slide-quantity.jpg';
import contactImage from '/images/slide-contact.jpg';
import { sendQuoteRequest } from './utils/emailService';

function App() {
  const [currentSlide, setCurrentSlide] = useState('intro');
  const [transitionDirection, setTransitionDirection] = useState('left');
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    projectDetails: '',
    quantity: '',
    artworkAttachment: null,
    artworkDescription: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'slideView',
      slideName: currentSlide,
    });
  }, [currentSlide]);

  return (
    <div className='relative w-full h-screen overflow-y-auto'>
      {currentSlide === 'intro' && (
        transitionDirection === 'right' ? (
          <SlideTransition keyProp='intro' direction={transitionDirection}>
            <IntroSlide
              logo={logo}
              image={introImage}
              onSubmit={(name) => {
                setFormData((prev) => ({ ...prev, name }));
                setTransitionDirection('left');
                setCurrentSlide('service');
              }}
            />
          </SlideTransition>
        ) : (
          <IntroSlide
            logo={logo}
            image={introImage}
            onSubmit={(name) => {
              setFormData((prev) => ({ ...prev, name }));
              setTransitionDirection('left');
              setCurrentSlide('service');
            }}
          />
        )
      )}
      {currentSlide === 'service' && (
        <SlideTransition keyProp='service' direction={transitionDirection}>
          <ServiceSlide
            logo={logo}
            image={projectImage}
            onBack={() => {
              setTransitionDirection('right');
              setCurrentSlide('intro');
            }}
            onSubmit={(service) => {
              setFormData((prev) => ({ ...prev, service }));
              setTransitionDirection('left');
              setCurrentSlide('projectDetails');
            }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'projectDetails' && (
        <SlideTransition keyProp='projectDetails' direction={transitionDirection}>
          <ProjectSlide
            logo={logo}
            image={projectImage}
            onBack={() => {
              setTransitionDirection('right');
              setCurrentSlide('service');
            }}
            onSubmit={(projectDetails) => {
              setFormData((prev) => ({ ...prev, projectDetails }));
              setTransitionDirection('left');
              setCurrentSlide('quantityDetails');
            }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'quantityDetails' && (
        <SlideTransition keyProp='quantityDetails' direction={transitionDirection}>
          <QuantitySlide
            logo={logo}
            image={quantityImage}
            onBack={() => {
              setTransitionDirection('right');
              setCurrentSlide('projectDetails');
            }}
            onSubmit={(quantity) => {
              setFormData((prev) => ({ ...prev, quantity }));
              setTransitionDirection('left');
              setCurrentSlide('artwork');
            }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'artwork' && (
        <SlideTransition keyProp='artwork' direction={transitionDirection}>
          <ArtworkSlide
            logo={logo}
            image={projectImage}
            onBack={() => {
              setTransitionDirection('right');
              setCurrentSlide('quantityDetails');
            }}
            onSubmit={({ attachment, artworkDescription }) => {
              setFormData((prev) => ({ ...prev, artworkAttachment: attachment, artworkDescription }));
              setTransitionDirection('left');
              setCurrentSlide('contactDetails');
            }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'contactDetails' && (
        <SlideTransition keyProp='contactDetails' direction={transitionDirection}>
          <ContactSlide
            logo={logo}
            image={contactImage}
            onBack={() => {
              setTransitionDirection('right');
              setCurrentSlide('artwork');
            }}
            isSubmitting={isSubmitting}
            onSubmit={({ phone, email }) => {
              // Build the artwork note for the lead email. An uploaded file rides along as a
              // real email attachment; the note tells Ryan/Candice it is attached.
              const artworkParts = [];
              if (formData.artworkAttachment) {
                artworkParts.push(`File attached to this email: ${formData.artworkAttachment.name}`);
              }
              if (formData.artworkDescription) artworkParts.push(formData.artworkDescription);
              const artwork = artworkParts.length ? artworkParts.join('<br>') : 'None provided';

              const updatedData = {
                ...formData,
                phone,
                email,
                artwork,
                attachments: formData.artworkAttachment ? [formData.artworkAttachment] : [],
                toEmail: 'ryan@localthreadsohio.com',
                client: 'Local Threads',
              };

              setFormData(updatedData);
              setIsSubmitting(true);

              sendQuoteRequest(updatedData)
                .then(() => {
                  window.parent.postMessage({
                    event: 'obgform_submission',
                    name: updatedData.name,
                    service: updatedData.service,
                    quantity: updatedData.quantity,
                    projectDetails: updatedData.projectDetails,
                  }, '*');
                  setTransitionDirection('left');
                  setCurrentSlide('confirm');
                })
                .catch((error) => {
                  console.error('Error sending quote request:', error);
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            }}
          />
        </SlideTransition>
      )}
      {currentSlide === 'confirm' && (
        <SlideTransition keyProp='confirm' direction={transitionDirection}>
          <ConfirmSlide
            logo={logo}
            image={introImage}
          />
        </SlideTransition>
      )}
    </div>
  );
}

export default App;
