import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT CONTACT FORM
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // FRONTEND ONLY FOR NOW
      // -------------------------------------------------

      console.log("Contact Form:", formData);

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      toast.success(
        "Message sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      toast.error(
        "Unable to send your message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-slate-800">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <MessageCircle size={28} />
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Get in touch with us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Have a question about your order, products, delivery,
            or anything else? We're here to help.
          </p>

        </div>

      </section>


      {/* =================================================
          CONTACT INFORMATION + FORM
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">

        <div className="grid gap-10 lg:grid-cols-3">

          {/* =============================================
              CONTACT INFORMATION
          ============================================= */}

          <div className="lg:col-span-1">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Contact Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              We're here to help
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Reach out to us through any of the following
              channels. Our team will be happy to assist you.
            </p>


            {/* Email */}

            <div className="mt-8 flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Mail size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  support@yourstore.com
                </p>
              </div>

            </div>


            {/* Phone */}

            <div className="mt-6 flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Phone size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  +91 98765 43210
                </p>
              </div>

            </div>


            {/* Address */}

            <div className="mt-6 flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Address
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Kolkata, West Bengal,
                  <br />
                  India
                </p>
              </div>

            </div>


            {/* Working Hours */}

            <div className="mt-6 flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Clock size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Working Hours
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Monday - Saturday
                  <br />
                  10:00 AM - 7:00 PM
                </p>
              </div>

            </div>

          </div>


          {/* =============================================
              CONTACT FORM
          ============================================= */}

          <div className="lg:col-span-2">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7">

                <h2 className="text-2xl font-bold text-slate-900">
                  Send us a message
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Fill out the form below and we'll get back to
                  you as soon as possible.
                </p>

              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name + Email */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>

                </div>


                {/* Subject */}

                <div>

                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What can we help you with?"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>


                {/* Message */}

                <div>

                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send size={17} />
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FAQ / HELP SECTION
      ================================================= */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mx-auto max-w-2xl text-center">

            <CheckCircle
              size={30}
              className="mx-auto text-emerald-500"
            />

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Need help with an order?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Keep your order details ready when contacting our
              support team so we can assist you faster.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;