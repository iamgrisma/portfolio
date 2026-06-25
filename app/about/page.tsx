import {
  GraduationCap, Briefcase, Heart, Stethoscope, MapPin,
  Award, BookOpen, Users, Target, Leaf, Calendar, Music, Map, Book
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { profiles, educations, experiences, interests } from '@/src/db/schema';

// Helper to map icon names based on string
const getIcon = (name: string) => {
  const lName = name.toLowerCase();
  if (lName.includes('literature') || lName.includes('reading') || lName.includes('book')) return Book;
  if (lName.includes('music') || lName.includes('song')) return Music;
  if (lName.includes('travel') || lName.includes('map')) return Map;
  if (lName.includes('vet') || lName.includes('animal') || lName.includes('health')) return Stethoscope;
  if (lName.includes('welfare') || lName.includes('heart')) return Heart;
  if (lName.includes('gov') || lName.includes('admin') || lName.includes('poli')) return Briefcase;
  if (lName.includes('edu') || lName.includes('school') || lName.includes('degree')) return GraduationCap;
  if (lName.includes('rural') || lName.includes('community')) return Users;
  return Award;
};

// Define predefined skills 
const SKILLS = [
  { name: 'Animal Health & Diagnosis', level: 95 },
  { name: 'Veterinary Surgery', level: 85 },
  { name: 'Livestock Management', level: 90 },
  { name: 'Public Administration', level: 80 },
  { name: 'Community Outreach', level: 92 },
  { name: 'Policy Implementation', level: 78 },
];

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  const profileRecord = await db.select().from(profiles).limit(1).get();
  const extractYear = (str: string) => {
    const match = str.match(/(\d{4})\s*(AD|BS)/i);
    if (match) {
      let year = parseInt(match[1]);
      if (match[2].toUpperCase() === 'BS') year -= 57;
      return year;
    }
    const genericMatch = str.match(/\d{4}/);
    if (genericMatch) {
      let year = parseInt(genericMatch[0]);
      if (year > 2040) year -= 57;
      return year;
    }
    return 0;
  };

  const educationsRaw = await db.select().from(educations);
  const educationsList = educationsRaw.sort((a, b) => extractYear(b.year) - extractYear(a.year));
  
  const experiencesRaw = await db.select().from(experiences);
  const experiencesList = experiencesRaw.sort((a, b) => {
    const aPres = a.duration.toLowerCase().includes('present');
    const bPres = b.duration.toLowerCase().includes('present');
    if (aPres && !bPres) return -1;
    if (!aPres && bPres) return 1;
    return extractYear(b.duration) - extractYear(a.duration);
  });
  
  const interestsList = await db.select().from(interests);

  const EXPERIENCE_YEARS = new Date().getFullYear() - 2018;

  // Build Timeline dynamically
  const TIMELINE = [
    ...educationsList.map(edu => ({
      year: edu.year,
      title: edu.degree,
      description: edu.institution,
      icon: getIcon(edu.degree),
      color: 'from-accent-500 to-teal-500',
    })),
    ...experiencesList.map(exp => ({
      year: exp.duration,
      title: exp.role,
      description: `${exp.organization}${exp.description ? ` - ${exp.description}` : ''}`,
      icon: getIcon(exp.role),
      color: 'from-rose-500 to-pink-500',
    }))
  ];

  const DYNAMIC_INTERESTS = interestsList.map((interest, i) => ({
    label: interest.name,
    category: interest.category,
    icon: getIcon(interest.name),
    color: ['text-rose-400', 'text-blue-400', 'text-green-400', 'text-amber-400', 'text-purple-400', 'text-teal-400'][i % 6],
  }));

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
              {profileRecord?.tagline || <span>Dedicated to <span className="gradient-text">Service</span> & <span className="gradient-text">Community</span></span>}
            </h1>
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
              <div className="space-y-4 text-dark-200 leading-relaxed whitespace-pre-wrap">
                {profileRecord?.bio ? (
                  <p>{profileRecord.bio}</p>
                ) : (
                  <p>
                    I am <span className="text-white font-semibold">{profileRecord?.name || 'Kamal Baral'}</span>, a veterinary technician
                    currently serving at the Government of Nepal in Sindhuli district. My journey in veterinary
                    science began with a passion for animal welfare and a deep connection to the rural
                    communities of Nepal.
                  </p>
                )}
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
                      <p className="text-sm text-white font-medium">{experiencesList.length > 0 ? experiencesList[experiencesList.length - 1].role : 'Professional'}</p>
                      <p className="text-xs text-dark-300">{experiencesList.length > 0 ? experiencesList[experiencesList.length - 1].organization : 'Government of Nepal'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">{profileRecord?.currentAddress || 'Sindhuli, Nepal'}</p>
                      <p className="text-xs text-dark-300">{profileRecord?.permanentAddress || 'Bagmati Province'}</p>
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
                      <p className="text-sm text-white font-medium">{educationsList.length} Qualifications</p>
                      <p className="text-xs text-dark-300">Diverse educational background</p>
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
              <AnimatedSection key={i + item.title} animation={i % 2 === 0 ? 'slide-left' : 'slide-right'} delay={i * 100}>
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
            {DYNAMIC_INTERESTS.map((interest, i) => (
              <AnimatedSection key={i + interest.label} animation="scale" delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 text-center group cursor-default h-full flex flex-col justify-center items-center">
                  <interest.icon className={`w-8 h-8 ${interest.color} mx-auto mb-3 group-hover:scale-125 transition-transform duration-300`} />
                  <p className="text-sm text-white font-medium">{interest.label}</p>
                  {interest.category && <p className="text-xs text-dark-300 mt-1">{interest.category}</p>}
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
