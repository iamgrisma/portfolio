"use client";

import {
  GraduationCap, Briefcase, Heart, Stethoscope, MapPin,
  Award, BookOpen, Users, Target, Leaf, Calendar
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';

const EXPERIENCE_YEARS = new Date().getFullYear() - 2018;

const TIMELINE = [
  {
    year: 'Education',
    title: 'Junior Technical Assistant (JTA)',
    description: 'Completed foundational veterinary training with hands-on skills in animal health diagnostics, basic treatment procedures, and laboratory techniques.',
    icon: Award,
    color: 'from-amber-500 to-orange-500',
  },
  {
    year: 'Education',
    title: 'Diploma in Veterinary Science',
    description: 'Advanced studies in veterinary medicine covering animal surgery, pharmacology, parasitology, pathology, and livestock management practices.',
    icon: Stethoscope,
    color: 'from-accent-500 to-teal-500',
  },
  {
    year: 'Education',
    title: 'Bachelor in Political Science',
    description: 'Broadened perspective through political science studies — understanding governance structures, public policy, constitutional law, and democratic processes.',
    icon: GraduationCap,
    color: 'from-blue-500 to-purple-500',
  },
  {
    year: '2018 — Present',
    title: 'Veterinary Technician — Government of Nepal',
    description: `Serving at the Government of Nepal in Sindhuli district for ${EXPERIENCE_YEARS}+ years. Responsible for animal health services, disease surveillance, vaccination campaigns, and community awareness programs.`,
    icon: Briefcase,
    color: 'from-rose-500 to-pink-500',
  },
];

const SKILLS = [
  { name: 'Animal Health & Diagnosis', level: 95 },
  { name: 'Veterinary Surgery', level: 85 },
  { name: 'Livestock Management', level: 90 },
  { name: 'Public Administration', level: 80 },
  { name: 'Community Outreach', level: 92 },
  { name: 'Policy Implementation', level: 78 },
];

const INTERESTS = [
  { label: 'Animal Welfare', icon: Heart, color: 'text-rose-400' },
  { label: 'Rural Development', icon: MapPin, color: 'text-blue-400' },
  { label: 'Agriculture', icon: Leaf, color: 'text-green-400' },
  { label: 'Education', icon: BookOpen, color: 'text-amber-400' },
  { label: 'Community Service', icon: Users, color: 'text-purple-400' },
  { label: 'Good Governance', icon: Target, color: 'text-teal-400' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 hero-bg">
        <div className="blob-green -top-32 -left-32" />
        <div className="blob-teal top-0 right-0 opacity-50" />

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto">
            <span className="tag mb-6 inline-flex">
              <Users className="w-3 h-3 mr-2" /> About Me
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-[var(--font-heading)] leading-tight">
              Dedicated to <span className="gradient-text">Service</span> & <span className="gradient-text">Community</span>
            </h1>
            <p className="text-lg text-dark-200 mt-6 leading-relaxed">
              A veterinary professional and public servant driven by the belief that
              healthy animals and informed communities are the foundation of a thriving society.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left - Bio */}
            <AnimatedSection animation="slide-left" className="lg:col-span-3 space-y-6">
              <h2 className="text-3xl font-bold text-white font-[var(--font-heading)]">
                My Story
              </h2>
              <div className="space-y-4 text-dark-200 leading-relaxed">
                <p>
                  I am <span className="text-white font-semibold">Kamal Baral</span>, a veterinary technician
                  currently serving at the Government of Nepal in Sindhuli district. My journey in veterinary
                  science began with a passion for animal welfare and a deep connection to the rural
                  communities of Nepal.
                </p>
                <p>
                  After completing my <span className="text-accent-400">JTA (Junior Technical Assistant)</span> qualification,
                  I pursued a <span className="text-accent-400">Diploma in Veterinary Science</span>, which gave me the
                  clinical skills to diagnose and treat a wide range of animal diseases. My hands-on experience
                  covers livestock management, vaccination campaigns, and emergency veterinary care.
                </p>
                <p>
                  To broaden my understanding of governance and policy, I also earned a
                  <span className="text-accent-400"> Bachelor&apos;s degree in Political Science</span>. This unique
                  combination allows me to bridge the gap between technical veterinary services and the
                  administrative framework that supports public health initiatives.
                </p>
                <p>
                  Since <span className="text-white font-semibold">2018</span>, I have been serving as a
                  Veterinary Technician, treating over a thousand animals and conducting numerous community
                  awareness programs on animal health, zoonotic diseases, and sustainable livestock practices.
                </p>
              </div>
            </AnimatedSection>

            {/* Right - Quick Info Card */}
            <AnimatedSection animation="slide-right" delay={200} className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8 space-y-6 sticky top-24">
                <h3 className="text-lg font-bold text-white font-[var(--font-heading)] border-b border-white/5 pb-4">
                  At a Glance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">Veterinary Technician</p>
                      <p className="text-xs text-dark-300">Government of Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">Sindhuli, Nepal</p>
                      <p className="text-xs text-dark-300">Bagmati Province</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">Since 2018</p>
                      <p className="text-xs text-dark-300">{EXPERIENCE_YEARS}+ years of service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">3 Qualifications</p>
                      <p className="text-xs text-dark-300">JTA, Diploma, Bachelor&apos;s</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-dark-300 text-center italic">
                    &quot;Healthy animals, healthy communities.&quot;
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Timeline */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <span className="tag-blue tag mb-4 inline-flex">
              <Calendar className="w-3 h-3 mr-2" /> Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-heading)] mt-4">
              Education & <span className="gradient-text">Career</span> Path
            </h2>
          </AnimatedSection>

          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <AnimatedSection key={item.title} animation={i % 2 === 0 ? 'slide-left' : 'slide-right'} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-accent-400 font-medium uppercase tracking-widest">{item.year}</span>
                    <h3 className="text-xl font-bold text-white font-[var(--font-heading)] mt-1 mb-3">{item.title}</h3>
                    <p className="text-sm text-dark-200 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Skills */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <span className="tag-purple tag mb-4 inline-flex">
              <Target className="w-3 h-3 mr-2" /> Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-heading)] mt-4">
              Skills & <span className="gradient-text-blue">Competencies</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            {SKILLS.map((skill, i) => (
              <AnimatedSection key={skill.name} animation="fade-up" delay={i * 80}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <span className="text-xs text-accent-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* Interests */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-heading)]">
              Passions & <span className="gradient-text-warm">Interests</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {INTERESTS.map((interest, i) => (
              <AnimatedSection key={interest.label} animation="scale" delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 text-center group cursor-default">
                  <interest.icon className={`w-8 h-8 ${interest.color} mx-auto mb-3 group-hover:scale-125 transition-transform duration-300`} />
                  <p className="text-sm text-white font-medium">{interest.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
