import React from 'react';
import { RotateCcw, XCircle, CheckCircle, Clock, AlertTriangle, Mail, Phone, ArrowRight, Shield, Heart, Calendar } from 'lucide-react';

const RefundPolicy = () => {
  const colorTheme = {
    primary: "#173961",
    accent: "#0f2d4e",
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#f8fafc",
    darkText: "#2d3748"
  };

  const processSteps = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out within 1-2 days of order/delivery",
      icon: Phone,
      color: "blue",
      detail: "Call us at 8788941075 or email itspracin750@gmail.com immediately"
    },
    {
      step: 2,
      title: "Review Process",
      description: "We'll review your request and assess the situation",
      icon: CheckCircle,
      color: "green", 
      detail: "Our team will evaluate your concern within 24 hours"
    },
    {
      step: 3,
      title: "Resolution",
      description: "Refund processed within 3-5 days if approved",
      icon: Heart,
      color: "purple",
      detail: "Quick resolution for all approved refund requests"
    }
  ];

  const policyHighlights = [
    {
      icon: Shield,
      title: "Customer Protected",
      description: "Fair and transparent refund process"
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "3-5 days refund processing time"
    },
    {
      icon: Heart,
      title: "Fair Policy",
      description: "Liberal cancellation policy for your peace of mind"
    }
  ];

  const timelineItems = [
    {
      title: "1-2 Days",
      subtitle: "Cancellation Window",
      description: "Request cancellation within this period",
      color: "blue"
    },
    {
      title: "1-2 Days", 
      subtitle: "Quality Issue Reporting",
      description: "Report damaged/defective items",
      color: "orange"
    },
    {
      title: "3-5 Days",
      subtitle: "Refund Processing",
      description: "Time for approved refunds to process",
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div 
        className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 50%, ${colorTheme.accent} 100%)`
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
            <RotateCcw size={60} className="sm:w-20 sm:h-20 mx-auto" style={{ color: colorTheme.text }} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ color: colorTheme.text }}>
            Cancellations & Refunds
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl px-4 sm:px-0" style={{ color: `${colorTheme.text}CC` }}>
            Liberal cancellation policy designed for your peace of mind and satisfaction
          </p>
          
          {/* Mobile-optimized policy highlights */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 sm:flex sm:justify-center gap-2 sm:gap-8 text-xs sm:text-sm max-w-2xl mx-auto">
            {policyHighlights.map((highlight, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                <highlight.icon size={14} style={{ color: colorTheme.highlight }} />
                <span style={{ color: colorTheme.text }} className="text-center leading-tight">{highlight.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-First Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16">
          
          {/* Introduction - Mobile Optimized */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 sm:p-8 rounded-2xl border-l-4 border-green-400">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
                <CheckCircle size={28} />
                <span>Our Commitment to You</span>
              </h2>
              <p className="text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                <strong>DEVARAM GUNESHARAM CHOUDHARI</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy to ensure complete customer satisfaction and peace of mind.
              </p>
            </div>
          </section>

          {/* Timeline Section - Mobile First */}
          <section className="mb-8 sm:mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center"
              style={{ color: colorTheme.primary }}
            >
              Quick Reference Timeline
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {timelineItems.map((item, index) => (
                <div key={index} className={`bg-${item.color}-50 p-6 rounded-2xl border-l-4 border-${item.color}-400 text-center hover:shadow-lg transition-all duration-300`}>
                  <div className={`text-2xl sm:text-3xl font-bold text-${item.color}-600 mb-2`}>
                    {item.title}
                  </div>
                  <div className="font-semibold mb-2" style={{ color: colorTheme.primary }}>
                    {item.subtitle}
                  </div>
                  <p className="text-sm" style={{ color: colorTheme.darkText }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cancellation Policy - Mobile Cards */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <XCircle size={32} />
              <span>Cancellation Policy</span>
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl border-l-4" style={{ borderColor: colorTheme.highlight }}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                  <Clock className="text-blue-600" size={32} />
                  <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" style={{ color: colorTheme.primary }}>
                    Cancellation Timeline
                  </h3>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-base sm:text-lg mb-4" style={{ color: colorTheme.darkText }}>
                    Cancellations will be considered only if the request is made within{" "}
                    <span className="bg-blue-200 px-3 py-1 rounded-lg font-bold text-lg mx-1">1-2 days</span>
                    of placing the order.
                  </p>
                  <p className="text-sm opacity-80" style={{ color: colorTheme.darkText }}>
                    This ensures we can stop processing before your order enters production
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-6 sm:p-8 rounded-2xl border-l-4 border-yellow-400">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <AlertTriangle className="text-yellow-600 mt-1 mx-auto sm:mx-0 flex-shrink-0" size={28} />
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: colorTheme.secondary }}>
                      Processing Status Limitation
                    </h3>
                    <p className="text-base sm:text-lg mb-3" style={{ color: colorTheme.darkText }}>
                      The cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                    </p>
                    <p className="text-sm opacity-80" style={{ color: colorTheme.darkText }}>
                      This is why we encourage early cancellation requests
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-100 p-6 sm:p-8 rounded-2xl border-l-4 border-red-400">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <XCircle className="text-red-600 mt-1 mx-auto sm:mx-0 flex-shrink-0" size={28} />
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: colorTheme.secondary }}>
                      Non-Cancellable Items
                    </h3>
                    <p className="text-base sm:text-lg mb-4" style={{ color: colorTheme.darkText }}>
                      We do not accept cancellation requests for perishable items like flowers, eatables, etc.
                    </p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                        <strong>However:</strong> Refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Policy - Mobile Friendly */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <RotateCcw size={32} />
              <span>Refund & Return Policy</span>
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border-l-4 border-green-400">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                  <CheckCircle className="text-green-600" size={28} />
                  <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" style={{ color: colorTheme.secondary }}>
                    Damaged or Defective Items
                  </h3>
                </div>
                <div className="space-y-4 text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  <p>
                    In case of receipt of damaged or defective items, please report the same to our Customer Service team immediately.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p>
                      <strong>Reporting Timeline:</strong> This should be reported within{" "}
                      <span className="bg-green-200 px-2 py-1 rounded font-semibold mx-1">1-2 days</span>
                      of receipt of the products.
                    </p>
                  </div>
                  <p>
                    The request will be entertained once the merchant has checked and determined the same at their own end.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border-l-4 border-orange-400">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                  <AlertTriangle className="text-orange-600" size={28} />
                  <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" style={{ color: colorTheme.secondary }}>
                    Product Quality Issues
                  </h3>
                </div>
                <div className="space-y-4 text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  <p>
                    If you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within{" "}
                    <span className="bg-orange-200 px-2 py-1 rounded font-semibold mx-1">1-2 days</span>
                    of receiving the product.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p>
                      The Customer Service Team after looking into your complaint will take an appropriate decision based on the specific circumstances.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border-l-4 border-blue-400">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                  <Shield className="text-blue-600" size={28} />
                  <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" style={{ color: colorTheme.secondary }}>
                    Warranty Items
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue directly to the manufacturer for the fastest resolution.
                </p>
              </div>
            </div>
          </section>

          {/* Refund Processing Time - Mobile Highlight */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-100 p-6 sm:p-8 rounded-2xl border-l-4 border-indigo-400">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
                <Clock size={28} />
                <span>Refund Processing Time</span>
              </h2>
              <p className="text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                In case of any refunds approved by <strong>DEVARAM GUNESHARAM CHOUDHARI</strong>, it'll take{" "}
                <span className="bg-indigo-200 px-3 py-1 rounded-lg font-bold mx-1">3-5 business days</span>
                for the refund to be processed to the end customer.
              </p>
            </div>
          </section>

          {/* Process Steps - Mobile Optimized */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center" style={{ color: colorTheme.primary }}>
              How to Request Cancellation or Refund
            </h2>
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className={`p-6 sm:p-8 bg-${step.color}-50 rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
                    <div className={`bg-${step.color}-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 text-lg sm:text-xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                      {step.step}
                    </div>
                    <step.icon size={32} className={`mx-auto mb-4 text-${step.color}-600 sm:w-10 sm:h-10`} />
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: colorTheme.primary }}>
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base mb-3" style={{ color: colorTheme.darkText }}>
                      {step.description}
                    </p>
                    <p className="text-xs sm:text-sm opacity-80" style={{ color: colorTheme.darkText }}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Service Contact - Mobile Optimized */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Phone size={32} />
              <span>Customer Service Contact</span>
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl">
              <p className="mb-6 text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                For cancellations, refunds, or any concerns regarding your order, please contact our dedicated customer service team:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <Phone className="text-blue-600" size={24} />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-lg" style={{ color: colorTheme.primary }}>Phone Support</p>
                    <p className="text-lg" style={{ color: colorTheme.darkText }}>8788941075</p>
                    <p className="text-sm opacity-75" style={{ color: colorTheme.darkText }}>Available Mon-Sat, 9AM-7PM</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <Mail className="text-blue-600" size={24} />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-lg" style={{ color: colorTheme.primary }}>Email Support</p>
                    <p className="text-lg break-all" style={{ color: colorTheme.darkText }}>itspracin750@gmail.com</p>
                    <p className="text-sm opacity-75" style={{ color: colorTheme.darkText }}>24-hour response time</p>
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
                    <span>Email Support</span>
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

export default RefundPolicy;