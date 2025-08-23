import React from 'react';
import { 
  Heart, 
  Users, 
  Award, 
  Star, 
  Palette, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  Target,
  Eye,
  Briefcase,
  Calendar,
  ArrowRight
} from 'lucide-react';

const AboutUs = () => {
  const colorTheme = {
    primary: "#173961",
    accent: "#0f2d4e",
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#f8fafc",
    darkText: "#2d3748"
  };

  const stats = [
    { icon: Users, number: "10K+", label: "Happy Customers", color: "blue" },
    { icon: Award, number: "5+", label: "Years Experience", color: "green" },
    { icon: Star, number: "4.9", label: "Average Rating", color: "yellow" },
    { icon: Globe, number: "50+", label: "Cities Served", color: "purple" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Culture",
      description: "Every rangoli bag we create celebrates the rich heritage and vibrant traditions of Indian art.",
      color: "red"
    },
    {
      icon: Award,
      title: "Quality Craftsmanship",
      description: "We believe in excellence. Each product is carefully crafted with attention to detail and quality materials.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to ensure you love what you receive.",
      color: "green"
    },
    {
      icon: Palette,
      title: "Artistic Innovation",
      description: "Blending traditional rangoli patterns with modern design sensibilities for contemporary appeal.",
      color: "purple"
    }
  ];
  const productCategories = [
    { name: "College Bags", icon: "🎒", count: "120+ products" },
    { name: "Travel Gear", icon: "🧳", count: "85+ products" },
    { name: "Handbags", icon: "👜", count: "200+ products" },
    { name: "Cosmetics", icon: "💄", count: "300+ products" },
    { name: "Watches", icon: "⌚", count: "150+ products" },
    { name: "Baby Cradles", icon: "👶", count: "45+ products" },
    { name: "Kids Toys", icon: "🧸", count: "250+ products" },
    { name: "Home Decor", icon: "🏠", count: "180+ products" }
  ];


  const teamMembers = [
    {
      name: "Devaram Choudhary",
      role: "Founder & Owner",
      description: "Leading RangoliStore with passion for traditional crafts and modern business excellence.",
      image: "👨‍💼"
    },
    {
      name: "Pravin Choudhary",
      role: "Technical Director",
      description: "Bridging traditional business with modern technology to enhance customer experience.",
      image: "👨‍💻"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Mobile-First Header */}
      <div
        className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 50%, ${colorTheme.accent} 100%)`
        }}
      >
        {/* Animated background shapes - optimized for mobile */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-5 -left-5 sm:-top-10 sm:-left-10 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-5 left-1/4 sm:bottom-10 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-bounce mb-6 sm:mb-8">
            <Heart size={60} className="sm:w-20 sm:h-20 mx-auto" style={{ color: colorTheme.text }} />
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            style={{ color: colorTheme.text }}
          >
            About RangoliStore
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl px-4 sm:px-0" 
            style={{ color: `${colorTheme.text}CC` }}
          >
            Where tradition meets modern style in every handcrafted piece
          </p>
          
          {/* Trust badges - Mobile optimized */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-8 text-xs sm:text-sm max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <CheckCircle size={14} className="sm:w-4 sm:h-4" style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }}>Authentic Craft</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <Globe size={14} className="sm:w-4 sm:h-4" style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }}>Worldwide</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <Star size={14} className="sm:w-4 sm:h-4" style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }}>5-Star Quality</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <Award size={14} className="sm:w-4 sm:h-4" style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }}>Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content - Mobile First */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        
        {/* Our Story Section - Mobile Optimized */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-10 md:p-12 transform hover:scale-105 transition-transform duration-300">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center"
              style={{ color: colorTheme.primary }}
            >
              Our Story
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: colorTheme.darkText }}>
                  <strong>RangoliStore</strong> was born from a deep love for traditional Indian art and a vision to bring 
                  the vibrant beauty of rangoli patterns to everyday accessories. Founded by <strong>Devaram Choudhary</strong>, 
                  our journey began with a simple belief: that art should be accessible, functional, and beautiful.
                </p>
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: colorTheme.darkText }}>
                  Located in the heart of <strong>Kolhapur, Maharashtra</strong>, we draw inspiration from the rich cultural 
                  heritage of our region. Each rangoli bag tells a story of tradition, craftsmanship, and the timeless 
                  beauty of Indian decorative arts.
                </p>
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: colorTheme.darkText }}>
                  What started as a passion project has grown into a beloved brand that serves customers worldwide, 
                  bringing a piece of Indian artistry to homes and hearts across the globe.
                </p>
              </div>
              {/* Mission & Vision - Mobile Friendly */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-l-4 border-blue-400">
              <div className="flex items-center space-x-4 mb-6">
                <Target className="text-blue-600" size={32} />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: colorTheme.primary }}>
                  Our Mission
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: colorTheme.darkText }}>
                To make quality lifestyle products accessible to everyone through a seamless shopping experience, 
                competitive pricing, and exceptional customer service that builds trust and loyalty.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-l-4 border-green-400">
              <div className="flex items-center space-x-4 mb-6">
                <Eye className="text-green-600" size={32} />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: colorTheme.primary }}>
                  Our Vision
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: colorTheme.darkText }}>
                To become the world's most customer-centric online marketplace, where people can discover quality 
                products that enhance their lives and connect with a community of like-minded shoppers.
              </p>
            </div>
          </div>
        </section>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center"
            style={{ color: colorTheme.primary }}
          >
            Our Product Range
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {productCategories.map((category, index) => (
              <div key={index} className="group">
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center">
                  <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold mb-1" style={{ color: colorTheme.primary }}>
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm" style={{ color: colorTheme.darkText }}>
                    {category.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section - Mobile Optimized */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center"
            style={{ color: colorTheme.primary }}
          >
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center">
                  <div className="text-4xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.image}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colorTheme.primary }}>
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base font-medium mb-4" style={{ color: colorTheme.highlight }}>
                    {member.role}
                  </p>
                  <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Company Info - Mobile First */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-10 md:p-12">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center"
              style={{ color: colorTheme.primary }}
            >
              Company Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl border-l-4 border-blue-400">
                  <div className="flex items-center space-x-4 mb-4">
                    <Briefcase className="text-blue-600" size={28} />
                    <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colorTheme.primary }}>
                      Legal Entity
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg font-medium" style={{ color: colorTheme.darkText }}>
                    DEVARAM GUNESHARAM CHOUDHARI
                  </p>
                  <p className="text-sm mt-2" style={{ color: `${colorTheme.darkText}80` }}>
                    Registered business entity
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 sm:p-8 rounded-2xl border-l-4 border-green-400">
                  <div className="flex items-center space-x-4 mb-4">
                    <Calendar className="text-green-600" size={28} />
                    <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colorTheme.primary }}>
                      Established
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg font-medium" style={{ color: colorTheme.darkText }}>
                    2009
                  </p>
                  <p className="text-sm mt-2" style={{ color: `${colorTheme.darkText}80` }}>
                    Over 16 years of trusted service
                  </p>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="bg-gradient-to-r from-orange-50 to-amber-100 p-6 sm:p-8 rounded-2xl border-l-4 border-orange-400">
                  <div className="flex items-center space-x-4 mb-4">
                    <MapPin className="text-orange-600" size={28} />
                    <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colorTheme.primary }}>
                      Location
                    </h3>
                  </div>
                  <div style={{ color: colorTheme.darkText }}>
                    <p className="font-medium">Main Road Kodoli</p>
                    <p>Kolhapur, Maharashtra 416114</p>
                    <p>India</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-6 sm:p-8 rounded-2xl border-l-4 border-purple-400">
                  <div className="flex items-center space-x-4 mb-4">
                    <Globe className="text-purple-600" size={28} />
                    <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colorTheme.primary }}>
                      Service Area
                    </h3>
                  </div>
                  <p className="text-base font-medium mb-2" style={{ color: colorTheme.darkText }}>
                    Worldwide Shipping
                  </p>
                  <p className="text-sm" style={{ color: `${colorTheme.darkText}80` }}>
                    Domestic & International delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA - Mobile Optimized */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Experience RangoliStore?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join thousands of happy customers who have made RangoliStore a part of their lifestyle. 
              Discover our beautiful collection today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <a
                href="tel:8788941075"
                className="w-full sm:w-auto bg-white text-blue-600 py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Phone size={20} />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:itspracin750@gmail.com"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Mail size={20} />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;