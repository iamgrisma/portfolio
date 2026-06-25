"use client";

import { useState, FormEvent } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const CONTACT_INFO = [
    {
      icon: Mail,
      label: 'Email',
      value: 'kamalbaral@mail.com',
      href: 'mailto:kamalbaral@mail.com',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Sindhuli, Nepal',
      href: null,
      color: 'from-accent-500 to-teal-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: 'Available on request',
      href: null,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 hero-bg">
        <div className="blob-green -top-20 right-0 opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto">
            <span className="tag mb-6 inline-flex">
              <Mail className="w-3 h-3 mr-2" /> Contact
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-[var(--font-heading)]">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-dark-200 mt-4">
              Have a question, project idea, or just want to connect? I&apos;d love to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <AnimatedSection animation="slide-left" className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white font-[var(--font-heading)]">
                Contact Information
              </h2>
              <p className="text-dark-200 text-sm leading-relaxed">
                Feel free to reach out through any of the channels below or use the contact form.
                I typically respond within 24-48 hours.
              </p>

              <div className="space-y-4 pt-4">
                {CONTACT_INFO.map((info) => (
                  <div key={info.label} className="glass-card rounded-xl p-5 flex items-start gap-4 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-dark-300 uppercase tracking-widest font-medium">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-white font-medium hover:text-accent-400 transition-colors text-sm">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white font-medium text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-sm text-dark-300 mb-4 font-medium">Connect on social media</p>
                <div className="flex gap-3">
                  <a href="https://facebook.com/kamalbaral" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://twitter.com/kamalbaral" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://linkedin.com/in/kamalbaral" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection animation="slide-right" delay={200} className="lg:col-span-3">
              <div className="glass-card rounded-2xl p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-2">
                  Send a Message
                </h2>
                <p className="text-sm text-dark-300 mb-8">Fill out the form below and I&apos;ll get back to you soon.</p>

                {status === 'success' ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-accent-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-[var(--font-heading)]">Message Sent!</h3>
                    <p className="text-dark-200 text-sm">Thank you for reaching out. I&apos;ll respond as soon as possible.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-secondary text-sm mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-dark-100 mb-2">Full Name</label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          required
                          placeholder="Your name"
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-dark-100 mb-2">Email Address</label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          required
                          placeholder="you@example.com"
                          className="admin-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-dark-100 mb-2">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        required
                        placeholder="Tell me what's on your mind..."
                        className="admin-input resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Failed to send message. Please try again later.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
