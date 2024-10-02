import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Navbar from "../../components/Navbars/AuthNavbar.js";
import Footer from "../../components/Footers/Footer.js";
import {keyframes, motion} from 'framer-motion';

const containerVariants = {
  hidden: {opacity: 0, y: 50},
  visible: {opacity: 1, y: 0},
};
const fadeIn = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};
const ContactForm = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
}

const itemVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};



export default function Landing() {

  return (
      <>
        <Navbar transparent/>
        <main>
          <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
            <div
                className="absolute top-0 w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage:
                      "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
                }}
            >
        <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-75 bg-black"
        ></span>
            </div>
            <div className="container relative mx-auto">
              <div className="items-center flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                  <div className="pr-12">
                    {/* Motion component for the heading */}
                    <motion.h1
                        className="text-white font-semibold text-5xl"
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                    >
                      Discover Your Next Favorite Product
                    </motion.h1>
                    {/* Motion component for the paragraph */}
                    <motion.p
                        className="mt-4 text-lg text-blueGray-200"
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                    >
                      Explore a wide range of products and categories at MegStore. From the latest electronics to
                      stylish fashion items, we've got something for everyone.
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
            <div
                className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
                style={{transform: "translateZ(0)"}}
            >
              <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
              >
                <polygon
                    className="text-blueGray-200 fill-current"
                    points="2560 0 2560 100 0 100"
                ></polygon>
              </svg>
            </div>
          </div>
          <section className="pb-20 bg-blueGray-200 -mt-24">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap">
                {/* Animated Feature Cards */}
                <motion.div
                    className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                      <div
                          className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                        <i className="fas fa-tags"></i>
                      </div>
                      <h6 className="text-xl font-semibold">Exclusive Deals</h6>
                      <p className="mt-2 mb-4 text-blueGray-500">
                        Enjoy special discounts and exclusive deals on a wide range of products. Save more on your
                        favorite items with our limited-time offers.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                    className="w-full md:w-4/12 px-4 text-center"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}} // Delay for staggered effect
                >
                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                      <div
                          className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                        <i className="fas fa-truck"></i>
                      </div>
                      <h6 className="text-xl font-semibold">Fast Shipping</h6>
                      <p className="mt-2 mb-4 text-blueGray-500">
                        Get your orders delivered quickly and efficiently. Our fast shipping options ensure you receive
                        your products in no time.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                    className="pt-6 w-full md:w-4/12 px-4 text-center"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}} // Delay for staggered effect
                >
                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                      <div
                          className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                        <i className="fas fa-lock"></i>
                      </div>
                      <h6 className="text-xl font-semibold">Secure Shopping</h6>
                      <p className="mt-2 mb-4 text-blueGray-500">
                        Shop with confidence knowing that your personal information is protected with our secure payment
                        systems and privacy policies.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center mt-32">
                <motion.div
                    className="w-full md:w-5/12 px-4 mr-auto ml-auto"
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5}}
                >
                  <div
                      className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                    <i className="fas fa-star text-xl"></i>
                  </div>
                  <h3 className="text-3xl mb-2 font-semibold leading-normal">
                    Why Shop with MegStore?
                  </h3>
                  <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                    At MegStore, we offer a curated selection of high-quality products across various categories,
                    ensuring
                    that you find exactly what you need. Our dedicated customer support team is here to assist you every
                    step of the way.
                  </p>
                  <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-600">
                    Explore our collection, enjoy seamless shopping experiences, and take advantage of our exclusive
                    deals
                    and promotions.
                  </p>
                  <Link to="/shop" className="font-bold text-blueGray-700 mt-8">
                    Browse Our Collection
                  </Link>
                </motion.div>

                <motion.div
                    className="w-full md:w-4/12 px-4 mr-auto ml-auto"
                    initial={{opacity: 0, x: 50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5}}
                >
                  <div
                      className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                    <img
                        alt="..."
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
                        className="w-full align-middle rounded-t-lg"
                    />
                    <blockquote className="relative p-8 mb-4">
                      <svg
                          preserveAspectRatio="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 583 95"
                          className="absolute left-0 w-full block h-95-px -top-94-px"
                      >
                        <polygon
                            points="-30,95 583,95 583,65"
                            className="text-lightBlue-500 fill-current"
                        ></polygon>
                      </svg>
                      <h4 className="text-xl font-bold text-white">
                        Premium Quality Products
                      </h4>
                      <p className="text-md font-light mt-2 text-white">
                        Discover a range of premium quality products that cater to all your needs. From fashion to
                        electronics, find the best deals on top brands.
                      </p>
                    </blockquote>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>


          <section className="relative py-20">
            <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
                style={{transform: "translateZ(0)"}}
            >
              <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
              >
                <polygon
                    className="text-white fill-current"
                    points="2560 0 2560 100 0 100"
                ></polygon>
              </svg>
            </div>
            <div className="container mx-auto px-4">
              <motion.div
                  className="items-center flex flex-wrap"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  transition={{duration: 0.6}}
              >
                <motion.div
                    className="w-full md:w-4/12 ml-auto mr-auto px-4"
                    variants={itemVariants}
                    transition={{duration: 0.6, delay: 0.2}} // Add delay for staggered effect
                >
                  <img
                      alt="..."
                      className="max-w-full rounded-lg shadow-lg"
                      src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                  />
                </motion.div>
                <motion.div
                    className="w-full md:w-5/12 ml-auto mr-auto px-4"
                    variants={itemVariants}
                    transition={{duration: 0.6, delay: 0.4}} // Add delay for staggered effect
                >
                  <div className="md:pr-12">
                    <div
                        className="text-pink-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-pink-300"
                    >
                      <i className="fas fa-user-friends text-xl"></i>
                    </div>
                    <h3 className="text-3xl font-semibold">Customer Satisfaction Guaranteed</h3>
                    <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                      At MegStore, customer satisfaction is our top priority. We provide high-quality products with
                      excellent customer service to ensure your shopping experience is seamless and enjoyable.
                    </p>
                    <ul className="list-none mt-6">
                      <li className="py-2">
                        <div className="flex items-center">
                          <div>
                      <span
                          className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      >
                        <i className="fas fa-shield-alt"></i>
                      </span>
                          </div>
                          <div>
                            <h4 className="text-blueGray-500">Secure Payment</h4>
                          </div>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center">
                          <div>
                      <span
                          className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </span>
                          </div>
                          <div>
                            <h4 className="text-blueGray-500">Easy Returns</h4>
                          </div>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center">
                          <div>
                      <span
                          className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      >
                        <i className="fas fa-headset"></i>
                      </span>
                          </div>
                          <div>
                            <h4 className="text-blueGray-500">24/7 Support</h4>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
          <section className="pb-20 relative block bg-blueGray-800">
            <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
                style={{transform: "translateZ(0)"}}>
              <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg"
                   preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                <polygon className="text-blueGray-800 fill-current" points="2560 0 2560 100 0 100"></polygon>
              </svg>
            </div>

            <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
              <div className="flex flex-wrap text-center justify-center">
                <div className="w-full lg:w-6/12 px-4">
                  <motion.h2
                      className="text-4xl font-semibold text-white"
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      transition={{duration: 1}}
                  >
                    Welcome to MEGSTORE
                  </motion.h2>
                  <motion.p
                      className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-400"
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      transition={{duration: 1, delay: 0.2}}
                  >
                    Discover the best deals on a variety of products. Shop from the
                    comfort of your home and enjoy a seamless online shopping experience.
                  </motion.p>
                </div>
              </div>
              <div className="flex flex-wrap mt-12 justify-center">
                <motion.div className="w-full lg:w-3/12 px-4 text-center" initial="hidden" animate="visible"
                            variants={fadeIn} transition={{duration: 1, delay: 0.4}}>
                  <div
                      className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                    <i className="fas fa-shipping-fast text-xl"></i>
                  </div>
                  <h6 className="text-xl mt-5 font-semibold text-white">Fast Delivery</h6>
                  <p className="mt-2 mb-4 text-blueGray-400">
                    Get your orders delivered to your doorstep in record time, no delays!
                  </p>
                </motion.div>
                <motion.div className="w-full lg:w-3/12 px-4 text-center" initial="hidden" animate="visible"
                            variants={fadeIn} transition={{duration: 1, delay: 0.4}}>
                  <div
                      className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                    <i className="fas fa-tags text-xl"></i>
                  </div>
                  <h5 className="text-xl mt-5 font-semibold text-white">Best Deals</h5>
                  <p className="mt-2 mb-4 text-blueGray-400">
                    Explore unbeatable offers and discounts on top brands and products.
                  </p>
                </motion.div>
                <motion.div className="w-full lg:w-3/12 px-4 text-center" initial="hidden" animate="visible"
                            variants={fadeIn} transition={{duration: 1, delay: 0.4}}>
                  <div
                      className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                    <i className="fas fa-user-friends text-xl"></i>
                  </div>
                  <h5 className="text-xl mt-5 font-semibold text-white">24/7 Support</h5>
                  <p className="mt-2 mb-4 text-blueGray-400">
                    Our team is available around the clock to assist with any inquiries or
                    issues.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>


          <section className="relative block py-24 lg:pt-0 bg-blueGray-800 fade-in">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{duration: 0.5}}>

              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
                  <div className="w-full lg:w-6/12 px-4">
                    <div
                        className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                      <div className="flex-auto p-5 lg:p-10">
                        <motion.h4 className="text-2xl font-semibold" variants={fadeIn} transition={{duration: 0.5}}>
                          Want to work with us?
                        </motion.h4>
                        <motion.p className="leading-relaxed mt-1 mb-4 text-blueGray-500" variants={fadeIn}
                                  transition={{duration: 0.5}}>
                          Complete this form and we will get back to you in 24 hours.
                        </motion.p>

                        <motion.div className="relative w-full mb-3 mt-8" variants={fadeIn}
                                    transition={{duration: 0.5}}>
                          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                 htmlFor="full-name">
                            Full Name
                          </label>
                          <input
                              type="text"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              placeholder="Full Name"
                          />
                        </motion.div>

                        <motion.div className="relative w-full mb-3" variants={fadeIn} transition={{duration: 0.5}}>
                          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="email">
                            Email
                          </label>
                          <input
                              type="email"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              placeholder="Email"
                          />
                        </motion.div>

                        <motion.div className="relative w-full mb-3" variants={fadeIn} transition={{duration: 0.5}}>
                          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="message">
                            Message
                          </label>
                          <textarea
                              rows="4"
                              cols="80"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              placeholder="Type a message..."
                          />
                        </motion.div>

                        <motion.div className="text-center mt-6" variants={fadeIn} transition={{duration: 0.5}}>
                          <button
                              className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                          >
                            Send Message
                          </button>
                        </motion.div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </main>
        <Footer/>
      </>
  );
}
