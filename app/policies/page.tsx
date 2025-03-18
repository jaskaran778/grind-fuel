"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Footer from "@/components/footer";

export default function Policies() {
  const [activeTab, setActiveTab] = useState("shipping");
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effects
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  // FAQ animation variants
  const faqVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  useEffect(() => {
    setIsLoaded(true);

    // Could add power-up sound effect here
    // const policyActivateSound = new Audio('/sounds/policy-activate.mp3');
    // policyActivateSound.volume = 0.3;
    // policyActivateSound.play();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedFAQ(null);

    // Could add tab switch sound here
    // const tabSwitchSound = new Audio('/sounds/tab-switch.mp3');
    // tabSwitchSound.volume = 0.2;
    // tabSwitchSound.play();
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const policies = {
    shipping: {
      icon: "🚚",
      title: "SHIPPING POLICY",
      subtitle: "FAST, RELIABLE, NO EXCUSES",
      status: "DELIVERY PROTOCOL: INITIATED",
      content: [
        {
          title: "Speed Mode Activated",
          description:
            "Orders are processed within 24 hours and shipped out as fast as possible. We don't like waiting, and neither should you.",
        },
        {
          title: "Tracking On Point",
          description:
            "Every order comes with real-time tracking, so you know exactly when your fuel arrives. No mysteries, no guessing games.",
        },
        {
          title: "Worldwide Coverage",
          description:
            "No matter where you grind, we'll do our best to get your fuel to you. Some regions might have limitations, but we always find a way.",
        },
        {
          title: "Delays? Not on Our Watch",
          description:
            "If shipping takes longer than expected due to unavoidable reasons, we'll keep you updated and make it right.",
        },
        {
          title: "Delivery Timeframes",
          description:
            "Standard Shipping: 3-5 business days. Express Shipping: 1-2 business days. Priority Rush: Next-day delivery (where available).",
        },
      ],
      faqs: [
        {
          question: "Do you ship to APO/FPO addresses?",
          answer:
            "Yes! We support our military grinders. Standard shipping rates apply, but delivery times may vary.",
        },
        {
          question: "What if my package is damaged during shipping?",
          answer:
            "Take a photo and contact us immediately. We'll send a replacement ASAP without requiring you to return the damaged goods.",
        },
        {
          question: "Can I change my shipping address after ordering?",
          answer:
            "Yes, if the order hasn't shipped yet. Contact customer support immediately and we'll update your delivery coordinates.",
        },
      ],
    },
    returns: {
      icon: "🔄",
      title: "RETURN POLICY",
      subtitle: "NO RAGE QUITS, ONLY SOLUTIONS",
      status: "REFUND MODULE ENGAGED",
      content: [
        {
          title: "Not Feeling It? We Got You.",
          description:
            "If your order isn't what you expected, let us know within 14 days of delivery.",
        },
        {
          title: "Unopened? Full Refund.",
          description: "Return any unopened product for a hassle-free refund.",
        },
        {
          title: "Opened? We'll Figure It Out.",
          description:
            "If there's a defect or issue, we'll replace it or make it right. We believe in fairness, and we play by the rules.",
        },
        {
          title: "Easy Process, No Runarounds.",
          description:
            "Just hit up our customer support team, and we'll handle the rest—fast and simple, no long waits.",
        },
        {
          title: "Return Shipping",
          description:
            "For defective products, we'll cover return shipping. For preference returns, customer covers return shipping.",
        },
      ],
      faqs: [
        {
          question: "How do I start a return?",
          answer:
            "Contact our support team at support@grindfuel.com with your order number and reason for return. We'll provide a return label and instructions.",
        },
        {
          question: "Can I exchange instead of return?",
          answer:
            "Absolutely! Let us know what you'd prefer, and we'll make the swap happen as quickly as possible.",
        },
        {
          question:
            "What if my return is approved but I don't have the original packaging?",
          answer:
            "We understand things happen. Contact us, and we'll work out a solution that works for both of us.",
        },
      ],
    },
    privacy: {
      icon: "🔐",
      title: "PRIVACY POLICY",
      subtitle: "LOCKED & SECURED",
      status: "ENCRYPTION LEVEL: MAXIMUM SECURITY",
      content: [
        {
          title: "Your Data = Your Power",
          description:
            "We collect only what's necessary to get your order to you. No tracking, no shady data-selling—ever.",
        },
        {
          title: "Bulletproof Protection",
          description:
            "Your personal info is protected by top-tier encryption. We treat your data like we treat our formulas—secure and untouchable.",
        },
        {
          title: "No Spam, Just Fuel",
          description:
            "We don't flood your inbox. Expect only updates, special deals, and insider-only drops.",
        },
        {
          title: "Full Control",
          description:
            "Want to update or delete your info? No problem—just hit up our support, and it's done.",
        },
        {
          title: "Third-Party Protection",
          description:
            "We vet all our partners to ensure they uphold the same standards for data protection that we do.",
        },
      ],
      faqs: [
        {
          question: "How can I update my personal information?",
          answer:
            "Log into your account and navigate to the profile section, or contact our support team directly to assist with any changes.",
        },
        {
          question: "Do you sell my data to third parties?",
          answer:
            "Never. Your data is yours and stays with us solely for order processing and improving your experience.",
        },
        {
          question: "How long do you keep my data?",
          answer:
            "We keep your data only as long as your account is active or as needed to provide you with our services. You can request deletion at any time.",
        },
      ],
    },
    support: {
      icon: "📞",
      title: "CUSTOMER SERVICE",
      subtitle: "24/7 SUPPORT FOR THE RELENTLESS",
      status: "GRINDFUEL SUPPORT SYSTEM ENGAGED",
      content: [
        {
          title: "Need help? We move FAST.",
          description:
            "Our customer service team responds within 24 hours because we know you don't have time to wait.",
        },
        {
          title: "Multiple Ways to Reach Us",
          description:
            "Email: support@grindfuel.com\nLive Chat: Available on our website\nPhone: 1-800-GRIND-FUEL",
        },
        {
          title: "No Bots, No BS.",
          description:
            "Real humans, real solutions. If there's a problem, we'll fix it—no automated loops, no dodging responsibility.",
        },
        {
          title: "VIP Support for Subscribers",
          description:
            "Subscription members get priority access to our support team with accelerated response times.",
        },
        {
          title: "Even Faster Rush Support",
          description:
            "Need help RIGHT NOW? Use our emergency support option for critical issues that can't wait.",
        },
      ],
      faqs: [
        {
          question: "What are your customer service hours?",
          answer:
            "Our team is available 24/7 for email support. Live chat is available 8AM-10PM EST, 7 days a week.",
        },
        {
          question: "How quickly can I expect a response?",
          answer:
            "Email responses within 24 hours, usually much faster. Live chat connects you with a support agent in under 5 minutes.",
        },
        {
          question: "Can I get help with my product selection?",
          answer:
            "Absolutely! Our team includes product specialists who can help recommend the perfect fuel for your specific needs and goals.",
        },
      ],
    },
  };

  return (
    <div className="bg-black text-white min-h-screen" ref={containerRef}>
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-green-900/20 to-black"
        style={{ y: headerY, opacity: opacityParallax }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-green-400">⚡</span> GRINDFUEL POLICIES
            </h1>
            <p className="text-xl text-green-400 font-mono mb-8">
              BUILT FOR THE RELENTLESS
            </p>
            <div className="inline-block border border-green-500/30 rounded-lg px-6 py-2 bg-green-500/5 font-mono">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>[STATUS: CUSTOMER-FIRST ENGAGED]</span>
              </div>
            </div>

            <p className="max-w-3xl mx-auto mt-8 text-gray-300">
              Your grind deserves{" "}
              <span className="text-green-400 font-bold">
                no delays, no headaches, no BS.
              </span>{" "}
              Our policies are as straight-up as our fuel—clear, fast, and built
              to keep you in the game.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-[-20] left-1/2 transform -translate-x-1/2 translate-y-1/2"
          >
            <svg
              className="animate-bounce"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Policy Tabs */}
      <section className="py-6 px-4 sticky top-0 z-20 bg-black/90 backdrop-blur-md border-t border-b border-green-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {Object.keys(policies).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative px-4 py-3 rounded-md transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab
                    ? "bg-green-500/10 border border-green-400/60 text-green-400"
                    : "bg-transparent border border-green-500/30 text-gray-400 hover:border-green-500/50 hover:text-gray-300"
                }`}
              >
                <span className="text-xl">{policies[tab].icon}</span>
                <span className="font-mono font-bold text-sm md:text-base">
                  {tab.toUpperCase()}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"
                  ></motion.div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center mb-8">
                <span className="text-4xl mr-4">
                  {policies[activeTab].icon}
                </span>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {policies[activeTab].title}
                  </h2>
                  <p className="text-green-400 text-lg">
                    {policies[activeTab].subtitle}
                  </p>
                </div>
              </div>

              <div className="inline-block mb-8 border border-green-500/30 rounded-lg px-6 py-2 bg-green-500/5">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono font-bold tracking-wide">
                    {policies[activeTab].status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {policies[activeTab].content.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-black border border-green-500/30 rounded-xl p-6 hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                  >
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">
                        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-bold text-green-400">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 ml-6">
                      {item.description.split("\n").map((line, i) => (
                        <span key={i} className="block mb-1">
                          {line}
                        </span>
                      ))}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* FAQs Section */}
              <div
                className="bg-black border border-green-500/30 rounded-xl p-6 md:p-8"
                id="faqs-section"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-green-400 mr-3">❓</span>
                  FREQUENTLY ASKED QUESTIONS
                </h3>

                <div className="space-y-4">
                  {policies[activeTab].faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-green-500/30 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className={`w-full text-left p-4 flex justify-between items-center transition-colors duration-300 ${
                          expandedFAQ === index
                            ? "bg-green-500/10 text-green-400"
                            : "bg-black text-gray-200 hover:bg-green-500/5"
                        }`}
                      >
                        <span className="font-medium">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-300 ${
                            expandedFAQ === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <motion.div
                        variants={faqVariants}
                        initial="closed"
                        animate={expandedFAQ === index ? "open" : "closed"}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-green-500/30 bg-black text-gray-300">
                          {faq.answer}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* GrindFuel Promise Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black -z-10"></div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-black border border-green-500/30 rounded-xl p-8 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-300"></div>

            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="text-green-400 mr-3">🔥</span>
              GRINDFUEL PROMISE
            </h2>
            <h3 className="text-xl text-green-400 mb-6">
              NO LIMITS, NO EXCUSES, JUST PURE PERFORMANCE
            </h3>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Our mission is simple:{" "}
              <span className="text-green-400 font-bold">
                deliver elite-level energy and support that never slows you
                down.
              </span>{" "}
              Whether it's shipping, returns, privacy, or customer service—
              <span className="text-green-400 font-bold">
                we move like you do: fast, efficient, and always ahead of the
                game.
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="text-green-400 font-bold mb-2">SPEED FIRST</h4>
                <p className="text-gray-400 text-sm">
                  We deliver products and solutions at the speed of your grind.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="text-green-400 font-bold mb-2">RELIABILITY</h4>
                <p className="text-gray-400 text-sm">
                  We stand behind our products and our word, every time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="text-green-400 font-bold mb-2">SOLUTIONS</h4>
                <p className="text-gray-400 text-sm">
                  Problems are temporary. Our dedication to fixing them is
                  permanent.
                </p>
              </motion.div>
            </div>

            <div className="mt-12 space-y-4 font-mono text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>STATUS: CUSTOMER-FIRST MODE = ACTIVE</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span>NOW DEPLOYING: NEXT-LEVEL SUPPORT</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">
              STILL HAVE QUESTIONS?
            </h2>

            <p className="text-xl text-gray-300 mb-10">
              The GrindFuel support team is standing by to help. We're built for
              speed, just like you.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-block bg-black border-2 border-green-400 text-green-400 py-3 px-8 rounded-md text-lg font-bold hover:bg-green-400/10 transition-colors duration-300 group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-0 bg-green-400/10 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative flex items-center justify-center">
                  CONTACT SUPPORT
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </a>

              <a
                href="#faqs-section"
                className="inline-block bg-black border border-gray-700 text-gray-300 py-3 px-8 rounded-md text-lg font-bold hover:border-gray-500 transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  const faqSection = document.getElementById("faqs-section");
                  if (faqSection) {
                    const offsetPosition =
                      faqSection.getBoundingClientRect().top +
                      window.pageYOffset -
                      100; // 100px offset
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                VIEW FAQ
              </a>
            </div>
          </motion.div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </section>

      {/* Add required styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          70%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: linear-gradient(
              to right,
              rgba(74, 222, 128, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(74, 222, 128, 0.05) 1px,
              transparent 1px
            );
        }
      `}</style>
    </div>
  );
}
