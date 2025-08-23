"use client";
import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Instagram,
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  FileText,
  User,
  ArrowUp,
  ExternalLink
} from 'lucide-react';

const colorThemes = {
  classicBlueGold: {
    primary: '#173961',       // Your deep blue
    secondary: '#1e4b87',     // Medium blue
    accent: '#64b5f6',        // Light blue
    text: '#FFFFFF'           // White
  },
  darkOceanBlue: {
    name: "Ocean Depth Gradient",
    primary: "#0f2d4e",     // Darker version of classicBlueGold primary
    accent: "#0a2039",      // Even darker blue
    secondary: "#153354",   // Darker version of classicBlueGold secondary
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#113360ba",
  }
};

const Footer = () => {
  // Use the same theme as CategoryList but with darker colors
  const theme = 'darkOceanBlue';
  const colors = colorThemes[theme];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyLinks = [
    { name: 'About Us', path: '/staticpage/aboutus', icon: Heart },
    { name: 'Contact Us', path: '/staticpage/contactus', icon: Phone },
    { name: 'Privacy Policy', path: '/staticpage/privacypolicy', icon: Shield },
    { name: 'Terms of Service', path: '/staticpage/termsofservice', icon: FileText }
  ];

  const policyLinks = [
    { name: 'Shipping Policy', path: '/staticpage/shippingpolicy', icon: Truck },
    { name: 'Refund Policy', path: '/staticpage/refundpolicy', icon: RotateCcw },
    { name: 'Cancellation Policy', path: '/staticpage/refundpolicy', icon: RotateCcw },
    { name: 'Return Policy', path: '/staticpage/refundpolicy', icon: RotateCcw }
  ];

  const socialPlatforms = [
    { Icon: Facebook, href: "https://facebook.com/rangolistore", label: "Facebook" },
    { Icon: Instagram, href: "https://instagram.com/rangolistore", label: "Instagram" },
    { Icon: Twitter, href: "https://twitter.com/rangolistore", label: "Twitter" },
    { Icon: Youtube, href: "https://youtube.com/rangolistore", label: "YouTube" },
    { Icon: Linkedin, href: "https://linkedin.com/company/rangolistore", label: "LinkedIn" }
  ];

  return (
    <footer 
      className="relative z-10 mt-8 sm:mt-12 md:mt-16 w-full overflow-hidden"
      style={{
        // Darker gradient similar to CategoryList header
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
        boxShadow: `0 -4px 20px rgba(0,0,0,0.3)`
      }}
    >

      {/* Background Decorations - Multiple Circles */}
      <div className="absolute bottom-0 left-0 z-[-1] opacity-5">
        <svg width="120" height="120" viewBox="0 0 217 229" fill="none" className="sm:w-[217px] sm:h-[229px]">
          <path 
            d="M-64 140.5C-64 62.904 -1.096 1.90666e-05 76.5 1.22829e-05C154.096 5.49924e-06 217 62.904 217 140.5C217 218.096 154.096 281 76.5 281C-1.09598 281 -64 218.096 -64 140.5Z" 
            fill={colors.highlight}
          />
        </svg>
      </div>
      
      <div className="absolute right-4 top-4 sm:right-10 sm:top-10 z-[-1] opacity-5">
        <svg width="40" height="40" viewBox="0 0 75 75" fill="none" className="sm:w-[75px] sm:h-[75px]">
          <path 
            d="M37.5 -1.63918e-06C58.2107 -2.54447e-06 75 16.7893 75 37.5C75 58.2107 58.2107 75 37.5 75C16.7893 75 -7.33885e-07 58.2107 -1.63918e-06 37.5C-2.54447e-06 16.7893 16.7893 -7.33885e-07 37.5 -1.63918e-06Z" 
            fill={colors.secondary}
          />
        </svg>
      </div>
      
      {/* Additional Circle 1 - Top Left */}
      <div className="absolute -m-12 left-0 z-[-1] opacity-7">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" className="sm:w-[100px] sm:h-[100px]">
          <circle cx="50" cy="50" r="45" fill={colors.lightBg} />
        </svg>
      </div>
      
      {/* Additional Circle 2 - Middle Right */}
      <div className="absolute top-1/2 right-20 z-[-1] opacity-3">
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" className="sm:w-[80px] sm:h-[80px]">
          <circle cx="40" cy="40" r="35" fill={colors.secondary} />
        </svg>
      </div>
      
      {/* Additional Circle 3 - Bottom Center */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[-1] opacity-4">
        <svg width="70" height="70" viewBox="0 0 90 90" fill="none" className="sm:w-[90px] sm:h-[90px]">
          <circle cx="45" cy="45" r="40" fill={colors.accent} />
        </svg>
      </div>
      
      {/* Additional Circle 4 - Middle Left */}
      <div className="absolute top-1/3 left-5 z-[-1] opacity-6">
        <svg width="50" height="50" viewBox="0 0 70 70" fill="none" className="sm:w-[70px] sm:h-[70px]">
          <circle cx="35" cy="35" r="30" fill={colors.primary} />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
        {/* Main Footer Content - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          
          {/* Company Info Section - Mobile First */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start mb-4 sm:mb-6 space-y-3 sm:space-y-0 sm:space-x-4">
                <img 
                  src="/logo-footer.png"
                  alt="RangoliStore Logo" 
                  width={80}
                  height={80}
                  className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                />
                <div className="text-center sm:text-left">
                  <span 
                    className="text-2xl sm:text-3xl font-bold block"
                    style={{ color: colors.text }}
                  >
                    RangoliStore
                  </span>
                  <span 
                    className="text-sm sm:text-base block"
                    style={{ color: colors.highlight }}
                  >
                    Where tradition meets style
                  </span>
                </div>
              </div>
              
              <p 
                className="text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto lg:mx-0"
                style={{ color: `${colors.text}DD` }}
              >
                At RangoliStore, we blend tradition with style. Each bag tells a story of vibrant culture and timeless craftsmanship, bringing artistry to your everyday life.
              </p>
              
              {/* Social Media - Mobile Optimized */}
              <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4 mb-6">
                {socialPlatforms.map(({ Icon, href, label }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    style={{
                      backgroundColor: `${colors.accent}AA`,
                      color: colors.text,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.highlight;
                      e.currentTarget.style.color = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.accent}AA`;
                      e.currentTarget.style.color = colors.text;
                    }}
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links & Contact - Reorganized for Mobile */}
          <div className="lg:col-span-7">
            {/* Mobile: 2x2 Grid Layout, Desktop: 3 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Company Links */}
              <div className="text-center sm:text-left">
                <h4 
                  className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start space-x-2"
                  style={{ color: colors.highlight }}
                >
                  <Heart size={20} />
                  <span>Company</span>
                </h4>
                <ul className="space-y-3 sm:space-y-4">
                  {companyLinks.map(({ name, path, icon: Icon }) => (
                    <li key={name}>
                      <a 
                        href={path}
                        className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-sm sm:text-base transition-all duration-300 hover:translate-x-1 p-2 sm:p-0 rounded-lg sm:rounded-none"
                        style={{ color: `${colors.text}DD` }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.highlight;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = `${colors.text}DD`;
                        }}
                      >
                        <Icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:underline">{name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Policies Links */}
              <div className="text-center sm:text-left">
                <h4 
                  className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start space-x-2"
                  style={{ color: colors.highlight }}
                >
                  <Shield size={20} />
                  <span>Policies</span>
                </h4>
                <ul className="space-y-3 sm:space-y-4">
                  {policyLinks.map(({ name, path, icon: Icon }) => (
                    <li key={name}>
                      <a 
                        href={path}
                        className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-sm sm:text-base transition-all duration-300 hover:translate-x-1 p-2 sm:p-0 rounded-lg sm:rounded-none"
                        style={{ color: `${colors.text}DD` }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.highlight;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = `${colors.text}DD`;
                        }}
                      >
                        <Icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:underline">{name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Business Info - Spans full width on mobile */}
              <div className="col-span-2 lg:col-span-1 text-center sm:text-left">
                <h4 
                  className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start space-x-2"
                  style={{ color: colors.highlight }}
                >
                  <Phone size={20} />
                  <span>Contact</span>
                </h4>
                
                {/* Business Owner */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <User size={16} style={{ color: colors.highlight }} />
                    <p className="text-sm font-medium" style={{ color: colors.text }}>
                      Business Owner
                    </p>
                  </div>
                  <p 
                    className="text-base sm:text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    Mr. Devaram Choudhary
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-3 sm:space-y-4">
                  <a 
                    href="tel:9579425324"
                    className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 p-2 rounded-lg"
                    style={{ color: colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.highlight}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Phone size={16} style={{ color: colors.highlight }} className="group-hover:scale-110 transition-transform duration-300" />
                    <span>9579425324</span>
                  </a>
                  
                  <a 
                    href="mailto:devarampatel37@gmail.com"
                    className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 p-2 rounded-lg"
                    style={{ color: colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.highlight}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Mail size={16} style={{ color: colors.highlight }} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="break-all">devarampatel37@gmail.com</span>
                  </a>
                  
                  <div className="flex items-start justify-center sm:justify-start space-x-2 sm:space-x-3 text-sm sm:text-base p-2">
                    <MapPin size={16} style={{ color: colors.highlight }} className="mt-0.5 flex-shrink-0" />
                    <div style={{ color: colors.text }}>
                      <p>Main Road Kodoli</p>
                      <p>Kolhapur, MH 416114</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Mobile First */}
        <div 
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t"
          style={{ borderColor: `${colors.secondary}50` }}
        >
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center space-y-4 sm:space-y-0 space-y-reverse">
            <div className="text-center sm:text-left">
              <p style={{ color: `${colors.text}CC` }} className="text-sm">
                &copy; {new Date().getFullYear()} RangoliStore. All rights reserved.
              </p>
              <p style={{ color: `${colors.text}80` }} className="text-xs mt-1">
                Legal Entity: DEVARAM GUNESHARAM CHOUDHARI
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a 
                href="/staticpage/privacypolicy" 
                className="text-xs sm:text-sm transition-all duration-300 hover:scale-105 px-2 py-1 rounded"
                style={{ color: `${colors.text}CC` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.highlight;
                  e.currentTarget.style.backgroundColor = `${colors.highlight}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = `${colors.text}CC`;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Privacy Policy
              </a>
              <a 
                href="/staticpage/termsofservice" 
                className="text-xs sm:text-sm transition-all duration-300 hover:scale-105 px-2 py-1 rounded"
                style={{ color: `${colors.text}CC` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.highlight;
                  e.currentTarget.style.backgroundColor = `${colors.highlight}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = `${colors.text}CC`;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;