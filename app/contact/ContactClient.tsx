"use client";

import { useState, FormEvent, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import TurnstileWidget from '@/src/components/TurnstileWidget';
import { SocialIcon } from '@/src/components/SocialIcon';

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
};

type ContactInfoProps = {
  currentAddress: string;
  phone: string;
  publicEmail: string;
  socials: SocialLink[];
};

export default function ContactClient({ currentAddress, phone, publicEmail, socials = [] }: ContactInfoProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'contact' | 'booking'>('contact');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'booking') {
        setActiveTab('booking');
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get('type'),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      animalType: formData.get('animalType'),
      date: formData.get('date'),
      time: formData.get('time'),
      message: formData.get('message'),
      turnstileToken: formData.get('cf-turnstile-response'),
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
      value: publicEmail || 'contact@kamalpb.com.np',
      href: `mailto:${publicEmail || 'contact@kamalpb.com.np'}`,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: currentAddress || 'Sindhuli, Nepal',
      href: null,
      color: 'from-accent-500 to-teal-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: phone || 'Available on request',
      href: phone ? `tel:${phone}` : null,
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
                <div className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1" title={social.platform}>
                      <SocialIcon platform={social.platform} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection animation="slide-right" delay={200} className="lg:col-span-3">
              <div className="glass-card rounded-2xl p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-6 border-b border-white/10 mb-8 pb-4">
                  <button 
                    onClick={() => { setActiveTab('contact'); setStatus('idle'); }} 
                    className={`text-xl font-bold font-[var(--font-heading)] transition-colors ${activeTab === 'contact' ? 'text-white' : 'text-dark-300 hover:text-white'}`}
                  >
                    Send a Message
                  </button>
                  <button 
                    onClick={() => { setActiveTab('booking'); setStatus('idle'); }} 
                    className={`text-xl font-bold font-[var(--font-heading)] transition-colors ${activeTab === 'booking' ? 'text-accent-400' : 'text-dark-300 hover:text-white'}`}
                  >
                    Book Appointment
                  </button>
                </div>

                {status === 'success' ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-accent-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-[var(--font-heading)]">
                      {activeTab === 'booking' ? 'Booking Request Sent!' : 'Message Sent!'}
                    </h3>
                    <p className="text-dark-200 text-sm">
                      {activeTab === 'booking' 
                        ? "Thank you! I've received your appointment request and will get back to you shortly to confirm." 
                        : "Thank you for reaching out. I'll respond as soon as possible."}
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-secondary text-sm mt-4"
                    >
                      {activeTab === 'booking' ? 'Book Another' : 'Send Another Message'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="type" value={activeTab} />
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

                    {activeTab === 'booking' && (
                      <>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="contact-phone" className="block text-sm font-medium text-dark-100 mb-2">Phone Number <span className="text-accent-400">*</span></label>
                            <input type="tel" id="contact-phone" name="phone" required placeholder="+977..." className="admin-input" />
                          </div>
                          <div>
                            <label htmlFor="contact-animal" className="block text-sm font-medium text-dark-100 mb-2">Animal Type</label>
                            <select id="contact-animal" name="animalType" className="admin-input">
                              <option value="Dog">Dog</option>
                              <option value="Cat">Cat</option>
                              <option value="Livestock">Livestock (Cow/Buffalo)</option>
                              <option value="Poultry">Poultry</option>
                              <option value="Goat/Sheep">Goat/Sheep</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="contact-service" className="block text-sm font-medium text-dark-100 mb-2">Service</label>
                            <select id="contact-service" name="service" className="admin-input">
                              <option value="Consultation">Consultation</option>
                              <option value="Vaccination">Vaccination</option>
                              <option value="Surgery">Surgery</option>
                              <option value="Farm Visit">Farm Visit</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="contact-date" className="block text-sm font-medium text-dark-100 mb-2">Preferred Date</label>
                            <input type="date" id="contact-date" name="date" className="admin-input" />
                          </div>
                          <div>
                            <label htmlFor="contact-time" className="block text-sm font-medium text-dark-100 mb-2">Time Slot</label>
                            <select id="contact-time" name="time" className="admin-input">
                              <option value="Morning">Morning</option>
                              <option value="Afternoon">Afternoon</option>
                              <option value="Evening">Evening</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-dark-100 mb-2">
                        {activeTab === 'booking' ? 'Additional Notes (Optional)' : 'Message'}
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={activeTab === 'booking' ? 3 : 6}
                        required={activeTab === 'contact'}
                        placeholder={activeTab === 'booking' ? "Any specific symptoms or details?" : "Tell me what's on your mind..."}
                        className="admin-input resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Failed to submit. Please ensure the captcha is completed.
                      </div>
                    )}

                    <TurnstileWidget siteKey="0x4AAAAAADqzUDL1SGhRb6cZ" />

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {status === 'loading' ? 'Submitting...' : activeTab === 'booking' ? 'Request Appointment' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer socials={socials} />
    </main>
  );
}
