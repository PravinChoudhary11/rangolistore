"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  Building,
  Globe,
  Star,
  ArrowRight,
  WhatsappIcon,
  ExternalLink
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const colorTheme = {
    primary: "#173961",
    accent: "#0f2d4e",
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#f8fafc",
    darkText: "#2d3748",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      primary: "8788941075",
      secondary: "Available for calls and WhatsApp",
      timing: "Mon-Sat 9AM-7PM",
      color: "blue",
      action: "tel:8788941075"
    },
    {
      icon: Mail,
      title: "Email Support",
      primary: "itspracin750@gmail.com",
      secondary: "Perfect for detailed inquiries",
      timing: "24-hour response",
      color: "green",
      action: "mailto:itspracin750@gmail.com"
    },
    {
      icon: MapPin,
      title: "Visit Our Store",
      primary: "Main Road Kodoli",
      secondary: "Kolhapur, Maharashtra 416114",
      timing: "Mon-Sat 9AM-7PM",
      color: "orange",
      action: null
    }
  ];

  const faqData = [
    {
      question: "What are your shipping times?",
      answer: "We ship orders within 6-8 days of order confirmation through registered courier services. International orders may take 10-15 days."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship worldwide through registered international courier companies and speed post. Customs duties may apply."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 1-2 days of delivery for damaged or defective items. Please contact us immediately for any quality issues."
    },
    {
      question: "How can I track my order?",
      answer: "You'll receive tracking information via email once your order ships. Contact us for any tracking issues or updates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Mobile-First Header */}
      <div
        className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 50%, ${colorTheme.accent} 100%)`,
        }}
      >
        {/* Mobile-optimized background shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-5 -left-5 sm:-top-10 sm:-left-10 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-5 left-1/4 sm:bottom-10 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-bounce mb-6 sm:mb-8">
            <MessageSquare
              size={60}
              className="sm:w-20 sm:h-20 mx-auto"
              style={{ color: colorTheme.text }}
            />
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            style={{ color: colorTheme.text }}
          >
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl px-4 sm:px-0" style={{ color: `${colorTheme.text}CC` }}>
            Get in touch - we're here to help you find the perfect rangoli bags!
          </p>
          
          {/* Mobile-optimized trust indicators */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 sm:flex sm:justify-center gap-2 sm:gap-8 text-xs sm:text-sm max-w-sm sm:max-w-none mx-auto">
            <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
              <CheckCircle size={14} style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }} className="text-center">24h Response</span>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Globe size={14} style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }} className="text-center">Worldwide</span>
            </div>
            <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Star size={14} style={{ color: colorTheme.highlight }} />
              <span style={{ color: colorTheme.text }} className="text-center">5-Star Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-First Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Enhanced Contact Information - Mobile First */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-10 transform hover:scale-105 transition-transform duration-300">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left"
                style={{ color: colorTheme.primary }}
              >
                Get In Touch
              </h2>

              {/* Business Information - Mobile Optimized */}
              <div className="mb-8 sm:mb-10">
                <h3
                  className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center sm:text-left"
                  style={{ color: colorTheme.secondary }}
                >
                  Business Details
                </h3>
                <div
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-xl border-l-4 shadow-lg"
                  style={{ borderColor: colorTheme.highlight }}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                    <Building size={24} style={{ color: colorTheme.highlight }} />
                    <h4
                      className="text-lg sm:text-xl font-semibold text-center sm:text-left"
                      style={{ color: colorTheme.primary }}
                    >
                      Legal Entity Name
                    </h4>
                  </div>
                  <p className="text-base sm:text-lg font-medium text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                    DEVARAM GUNESHARAM CHOUDHARI
                  </p>
                  <p className="text-sm mt-2 text-center sm:text-left" style={{ color: `${colorTheme.darkText}80` }}>
                    Registered business entity for RangoliStore
                  </p>
                </div>
              </div>

              {/* Enhanced Contact Methods - Mobile Grid */}
              <div className="space-y-6 sm:space-y-8">
                {contactMethods.map((method, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300">
                      <div className={`bg-${method.color}-100 p-4 rounded-xl mx-auto sm:mx-0 group-hover:scale-110 transition-transform duration-300`}>
                        <method.icon style={{ color: method.color === 'blue' ? colorTheme.highlight : method.color === 'green' ? '#10B981' : '#F59E0B' }} size={28} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3
                          className="text-lg sm:text-xl font-semibold mb-2"
                          style={{ color: colorTheme.primary }}
                        >
                          {method.title}
                        </h3>
                        <p className="text-base sm:text-lg font-medium mb-1" style={{ color: colorTheme.darkText }}>
                          {method.primary}
                        </p>
                        <p className="text-sm mb-1" style={{ color: `${colorTheme.darkText}80` }}>
                          {method.secondary}
                        </p>
                        <p className="text-xs font-medium" style={{ color: `${colorTheme.darkText}60` }}>
                          {method.timing}
                        </p>
                        {method.action && (
                          <div className="mt-3">
                            <a
                              href={method.action}
                              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                method.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                                method.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                              } text-white`}
                            >
                              <span>Contact Now</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact Buttons - Mobile Stacked */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                <h3
                  className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center"
                  style={{ color: colorTheme.primary }}
                >
                  Quick Contact
                </h3>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <a
                    href="tel:8788941075"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-6 rounded-xl text-center font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Phone size={20} />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="mailto:itspracin750@gmail.com"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 px-6 rounded-xl text-center font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Mail size={20} />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form - Mobile Optimized */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-10 transform hover:scale-105 transition-transform duration-300">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center"
                style={{ color: colorTheme.primary }}
              >
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="animate-bounce mb-6">
                    <CheckCircle size={60} className="sm:w-20 sm:h-20 mx-auto text-green-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">Message Sent!</h3>
                  <p className="text-gray-600 px-4">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <label
                      className="block text-base font-medium mb-3"
                      style={{ color: colorTheme.darkText }}
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-base sm:text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-base font-medium mb-3"
                      style={{ color: colorTheme.darkText }}
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-base sm:text-lg"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-base font-medium mb-3"
                      style={{ color: colorTheme.darkText }}
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-base sm:text-lg"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-base font-medium mb-3"
                      style={{ color: colorTheme.darkText }}
                    >
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical transition-all duration-300 text-base sm:text-lg"
                      placeholder="Please describe your inquiry in detail..."
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 sm:py-4 px-8 rounded-xl font-semibold text-white text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 transform hover:scale-105 hover:shadow-xl"
                  >
                    <Send size={20} />
                    <span>Send Message</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                  <strong>Note:</strong> We typically respond within 24 hours during business days. For urgent matters, please call us directly at 8788941075.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced FAQ - Mobile Optimized */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-12">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-center"
              style={{ color: colorTheme.primary }}
            >
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
              {faqData.map((faq, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <h3
                      className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300"
                      style={{ color: colorTheme.secondary }}
                    >
                      {faq.question}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: colorTheme.darkText }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp Quick Action - Mobile Floating Button */}
        <div className="fixed bottom-6 right-6 z-50 sm:hidden">
          <a
            href="https://wa.me/918788941075"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Contact us on WhatsApp"
          >
            <MessageSquare size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;