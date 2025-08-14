"use client";
import React from 'react';
import { Facebook, Twitter, Youtube, Linkedin, Phone } from 'lucide-react';

// Adding Dark Ocean Blue theme to the colorThemes
const colorThemes = {
  // Your existing themes would be here
  darkOceanBlue: {
    name: "Ocean Depth Gradient",
    primary: "#173961",     // Deep blue
    accent: "#0f2d4e",      // Darker navy blue
    secondary: "#1e4b87",   // Medium-deep blue
    text:" #ffffff",        // White text
    highlight: "#1E88E5"    // Light blue highlight
  }
};

const Footer = () => {
  const theme = 'darkOceanBlue';
  const colors = colorThemes[theme];

  const socialIconStyle = {
    backgroundColor: `${colors.accent}99`,
    color: colors.text,
    transform: 'scale(1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: colors.highlight,
      color: colors.primary,
      transform: 'scale(1.1)',
      boxShadow: `0 4px 12px ${colors.primary}90`
    }
  };

  const linkStyle = {
    color: `${colors.text}CC`,
    position: 'relative',
    padding: '2px 4px',
    margin: '-2px -4px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: colors.primary,
      backgroundColor: colors.highlight,
    }
  };

  return (
    <footer 
      className="relative z-10 py-8 md:py-16 mt-2 w-full"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 10%, ${colors.accent} 60%, ${colors.secondary} 100%)`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.5)`
      }}
    >
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Company Info Section */}
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-8">
              <div className="flex items-center mb-6 space-x-3">
                <img 
                  src="/logo-footer.png" 
                  alt="logo" 
                  width={100}
                  height={100}
                  className="rounded-lg hover:shadow-lg transition-all duration-300"
                />
                <div className="flex flex-col pl-6">
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    RangoliStore
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: colors.highlight }}
                  >
                    Tradition meets style
                  </span>
                </div>
              </div>
              <p 
                className="text-base leading-relaxed mb-6"
                style={{ color: `${colors.text}CC` }}
              >
                At RangoliStore, we blend tradition with style. Each bag tells a story of vibrant culture and timeless craftsmanship, bringing a touch of artistry to your everyday life.
              </p>
              <div className="flex items-center space-x-4">
                {[Facebook, Twitter, Youtube, Linkedin].map((Icon, index) => (
                  <a
                    key={index}
                    href="/"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
                    style={socialIconStyle}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Resources Section */}
              <div>
                <h4 
                  className="text-lg font-semibold mb-6"
                  style={{ color: colors.highlight }}
                >
                  Resources
                </h4>
                <ul className="space-y-4">
                  {['SaaS Development', 'Our Products', 'User Flow', 'User Strategy'].map((item) => (
                    <li key={item}>
                      <a 
                        href="/" 
                        className="transition-all duration-300 inline-block"
                        style={linkStyle}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Section */}
              <div>
                <h4 
                  className="text-lg font-semibold mb-6"
                  style={{ color: colors.highlight }}
                >
                  Company
                </h4>
                <ul className="space-y-4">
                  {['About Us', 'Contact & Support', 'Success History', 'Setting & Privacy'].map((item) => (
                    <li key={item}>
                      <a 
                        href="/" 
                        className="transition-all duration-300 inline-block"
                        style={linkStyle}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Section */}
              <div className="col-span-2 md:col-span-1">
                <h4 
                  className="text-lg font-semibold mb-6"
                  style={{ color: colors.highlight }}
                >
                  Contact Us
                </h4>
                <div className="space-y-4">
                  <p 
                    className="flex items-center group cursor-pointer"
                    style={{ color: colors.text }}
                  >
                    <Phone size={20} className="mr-3" style={{ color: colors.highlight }} />
                    +9195 (794) 253 24
                  </p>
                  <p style={{ color: `${colors.text}CC` }}>
                    Main Road Kodoli
                    <br />
                    Kolhapur, MH 416114
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div 
          className="mt-16 pt-8 border-t"
          style={{ borderColor: `${colors.secondary}50` }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p style={{ color: `${colors.text}CC` }} className="text-sm">
              &copy; {new Date().getFullYear()} RangoliStore. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <a 
                      href="/" 
                      className="text-sm transition-all duration-300 inline-block"
                      style={linkStyle}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg width="217" height="229" viewBox="0 0 217 229" fill="none" className="opacity-10">
          <path 
            d="M-64 140.5C-64 62.904 -1.096 1.90666e-05 76.5 1.22829e-05C154.096 5.49924e-06 217 62.904 217 140.5C217 218.096 154.096 281 76.5 281C-1.09598 281 -64 218.096 -64 140.5Z" 
            fill={colors.highlight}
          />
        </svg>
      </div>
      <div className="absolute right-10 top-10 z-[-1]">
        <svg width="75" height="75" viewBox="0 0 75 75" fill="none" className="opacity-10">
          <path 
            d="M37.5 -1.63918e-06C58.2107 -2.54447e-06 75 16.7893 75 37.5C75 58.2107 58.2107 75 37.5 75C16.7893 75 -7.33885e-07 58.2107 -1.63918e-06 37.5C-2.54447e-06 16.7893 16.7893 -7.33885e-07 37.5 -1.63918e-06Z" 
            fill={colors.secondary}
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;