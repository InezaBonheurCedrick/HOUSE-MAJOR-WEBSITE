import React from 'react';

const WhatsAppSvgIcon = () => (
  <img 
    src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.14.0/whatsapp.svg"
    alt="WhatsApp"
    className="w-6 h-6 text-white"
  />
);

const WhatsAppIcon = () => {
  const phoneNumber = "250788258922";
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-3 bg-[#25D366] text-white rounded-full shadow-lg group transition-transform duration-300 ease-in-out hover:scale-110"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppSvgIcon />
      
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap -translate-y-1/2 top-1/2">
        Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppIcon;