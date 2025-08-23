import React from 'react';
import { Truck, Globe, Package, Clock, Mail, Phone, MapPin, Shield, AlertTriangle, CheckCircle, Plane, Ship } from 'lucide-react';

const ShippingPolicy = () => {
  const colorTheme = {
    primary: "#173961",
    accent: "#0f2d4e", 
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#f8fafc",
    darkText: "#2d3748"
  };

  const shippingMethods = [
    {
      icon: Globe,
      title: "International Shipping",
      description: "For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.",
      features: ["Registered courier", "International speed post", "Tracking available", "Customs support"],
      timeframe: "10-15 business days",
      color: "blue"
    },
    {
      icon: Package,
      title: "Domestic Shipping",
      description: "For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.",
      features: ["Registered courier", "Speed post option", "Real-time tracking", "Secure packaging"],
      timeframe: "6-8 business days",
      color: "green"
    }
  ];

  const coverageAreas = [
    { 
      icon: Globe, 
      title: "Worldwide", 
      subtitle: "International shipping available", 
      color: "blue",
      description: "We ship to most countries worldwide"
    },
    { 
      icon: Package, 
      title: "India", 
      subtitle: "Domestic shipping nationwide", 
      color: "green",
      description: "Pan-India delivery coverage"
    },
    { 
      icon: Clock, 
      title: "6-8 Days", 
      subtitle: "Standard processing time", 
      color: "yellow",
      description: "Quick order processing"
    }
  ];

  const trustBadges = [
    {
      icon: CheckCircle,
      title: "Secure Packaging",
      description: "Professional packaging"
    },
    {
      icon: Globe,
      title: "Worldwide Shipping",
      description: "International delivery"
    },
    {
      icon: Shield,
      title: "Tracking Available",
      description: "Real-time updates"
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
        {/* Mobile-optimized background shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-5 -right-5 sm:-top-10 sm:-right-10 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-bounce mb-6 sm:mb-8">
            <Truck size={60} className="sm:w-20 sm:h-20 mx-auto" style={{ color: colorTheme.text }} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ color: colorTheme.text }}>
            Shipping Policy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl px-4 sm:px-0" style={{ color: `${colorTheme.text}CC` }}>
            Fast, reliable, and secure delivery to your doorstep worldwide
          </p>
          
          {/* Mobile-optimized trust badges */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 sm:flex sm:justify-center gap-2 sm:gap-8 text-xs sm:text-sm max-w-2xl mx-auto">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                <badge.icon size={14} style={{ color: colorTheme.highlight }} />
                <span style={{ color: colorTheme.text }} className="text-center leading-tight">{badge.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-First Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16">
          
          {/* Shipping Methods - Mobile Cards */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center" style={{ color: colorTheme.primary }}>
              Our Shipping Methods
            </h2>
            
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12">
              {shippingMethods.map((method, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-br from-${method.color}-50 to-${method.color}-100 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-l-4 border-${method.color}-400 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                      <method.icon className={`text-${method.color}-600 group-hover:scale-110 transition-transform duration-300`} size={40} />
                      <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" style={{ color: colorTheme.primary }}>
                        {method.title}
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg mb-6 leading-relaxed text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                      {method.description}
                    </p>
                    
                    <div className="mb-6 text-center sm:text-left">
                      <div className={`bg-${method.color}-200 px-4 py-2 rounded-lg inline-block`}>
                        <span className="font-semibold text-sm sm:text-base" style={{ color: colorTheme.primary }}>
                          Delivery Time: {method.timeframe}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center sm:justify-start space-x-3">
                          <CheckCircle size={16} className={`text-${method.color}-600`} />
                          <span className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Processing Time - Mobile Highlight */}
          <section className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-l-4 border-yellow-400">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                <Clock className="text-yellow-600" size={40} />
                <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left" style={{ color: colorTheme.primary }}>
                  Processing & Delivery Timeline
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <div className="bg-white p-4 sm:p-6 rounded-xl text-center sm:text-left">
                    <h3 className="font-semibold text-lg mb-2" style={{ color: colorTheme.secondary }}>Processing Time</h3>
                    <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                      Orders are shipped within <span className="bg-yellow-200 px-3 py-1 rounded-lg font-bold mx-1">6-8 days</span> or as per the delivery date agreed at the time of order confirmation.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 sm:p-6 rounded-xl text-center sm:text-left">
                    <h3 className="font-semibold text-lg mb-2" style={{ color: colorTheme.secondary }}>Delivery Schedule</h3>
                    <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                      Delivery of the shipment is subject to courier company/post office norms and schedules in your region.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Information - Mobile Grid */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center" style={{ color: colorTheme.primary }}>
              Delivery Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                  <MapPin className="text-blue-600" size={24} />
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colorTheme.primary }}>Delivery Address</h3>
                </div>
                <p className="text-base sm:text-lg" style={{ color: colorTheme.darkText }}>
                  Delivery of all orders will be to the address provided by the buyer at the time of order placement. Please ensure accuracy.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-green-50 p-6 sm:p-8 rounded-2xl text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colorTheme.primary }}>Service Confirmation</h3>
                </div>
                <p className="text-base sm:text-lg" style={{ color: colorTheme.darkText }}>
                  Delivery of our services will be confirmed on your registered email ID as specified during registration.
                </p>
              </div>
            </div>
          </section>

          {/* Important Notice - Mobile Alert */}
          <section className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-red-50 to-pink-100 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-l-4 border-red-400">
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <AlertTriangle className="text-red-600 mt-1 mx-auto sm:mx-0 flex-shrink-0" size={32} />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: colorTheme.primary }}>
                    Important Notice - Liability Disclaimer
                  </h2>
                  <div className="space-y-4 text-base sm:text-lg" style={{ color: colorTheme.darkText }}>
                    <p>
                      <strong>DEVARAM GUNESHARAM CHOUDHARI</strong> is not liable for any delay in delivery by the courier company/postal authorities beyond our control.
                    </p>
                    <div className="bg-white p-4 sm:p-6 rounded-xl">
                      <p>
                        <strong>Our Guarantee:</strong> We only guarantee to hand over the consignment to the courier company or postal authorities within 6-8 days from the date of the order and payment, or as per the delivery date agreed at the time of order confirmation.
                      </p>
                    </div>
                    <p className="text-sm sm:text-base opacity-80">
                      Once shipped, delivery times depend on the courier service and local postal systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Coverage Visual - Mobile Grid */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center" style={{ color: colorTheme.primary }}>
              Our Shipping Coverage
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              {coverageAreas.map((area, index) => (
                <div key={index} className="text-center group">
                  <div className={`p-6 sm:p-8 bg-${area.color}-50 rounded-2xl sm:rounded-3xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
                    <area.icon size={40} className={`mx-auto mb-4 sm:mb-6 text-${area.color}-600 group-hover:scale-110 transition-transform duration-300 sm:w-12 sm:h-12`} />
                    <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colorTheme.primary }}>
                      {area.title}
                    </h3>
                    <p className="text-sm sm:text-base mb-2" style={{ color: colorTheme.darkText }}>
                      {area.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm opacity-80" style={{ color: colorTheme.darkText }}>
                      {area.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Support - Mobile Optimized */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center" style={{ color: colorTheme.primary }}>
              Need Help with Your Order?
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl">
              <p className="mb-6 sm:mb-8 text-base sm:text-lg text-center" style={{ color: colorTheme.darkText }}>
                For any issues in utilizing our services or tracking your shipment, you may contact our dedicated helpdesk:
              </p>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
                  <Phone className="text-blue-600" size={28} />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-lg sm:text-xl" style={{ color: colorTheme.primary }}>Phone Support</p>
                    <p className="text-base sm:text-lg" style={{ color: colorTheme.darkText }}>8788941075</p>
                    <p className="text-xs sm:text-sm opacity-75" style={{ color: colorTheme.darkText }}>Mon-Sat: 9AM-7PM, Sun: 10AM-6PM</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
                  <Mail className="text-blue-600" size={28} />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-lg sm:text-xl" style={{ color: colorTheme.primary }}>Email Support</p>
                    <p className="text-base sm:text-lg break-all" style={{ color: colorTheme.darkText }}>itspracin750@gmail.com</p>
                    <p className="text-xs sm:text-sm opacity-75" style={{ color: colorTheme.darkText }}>24-hour response guarantee</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <a 
                    href="tel:8788941075"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Phone size={20} />
                    <span>Call Support</span>
                  </a>
                  <a 
                    href="mailto:itspracin750@gmail.com"
                    className="bg-transparent border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Mail size={20} />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;