import Link from 'next/link';
import {
  BookOpen, Briefcase, Mail, MapPin, Award, GraduationCap,
  Heart, Stethoscope, Users, ArrowRight, Calendar, Sparkles,
  ChevronRight, Clock, Music, Map, Book
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { profiles, educations, experiences, blogs, stats, socialProfiles } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

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

const EXPERTISE = [
  {
    title: 'Animal Health & Welfare',
    description: 'Providing comprehensive veterinary care, disease prevention, and livestock management for rural communities across Sindhuli district.',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Public Administration',
    description: 'Ensuring efficient government service delivery and implementing policies that bridge the gap between administration and community needs.',
    icon: Briefcase,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Community Development',
    description: 'Empowering local communities through awareness programs, agricultural training, and public health education initiatives.',
    icon: Users,
    gradient: 'from-accent-500 to-teal-500',
  },
];

export const dynamic = 'force-dynamic';

export default async function Home() {
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
  const latestBlogs = await db.select().from(blogs).where(eq(blogs.published, true)).orderBy(desc(blogs.createdAt)).limit(3);
  const dynamicStats = await db.select().from(stats).orderBy(stats.order);
  const socials = await db.select().from(socialProfiles);

  const EXPERIENCE_YEARS = new Date().getFullYear() - 2018;

  const DYNAMIC_EDUCATION = educationsList.map((edu, i) => ({
    degree: edu.degree,
    field: edu.institution,
    icon: getIcon(edu.degree),
    color: ['from-amber-500 to-orange-500', 'from-accent-500 to-teal-500', 'from-blue-500 to-purple-500', 'from-rose-500 to-pink-500'][i % 4],
    tagColor: ['tag-amber', 'tag', 'tag-blue', 'tag-purple'][i % 4],
  }));

  const STATS = dynamicStats.length > 0 ? dynamicStats.map(s => ({
    value: s.value,
    label: s.label,
    icon: getIcon(s.icon)
  })) : [
    { value: `${EXPERIENCE_YEARS}+`, label: 'Years Experience', icon: Calendar },
    { value: '1000+', label: 'Animals Treated', icon: Heart },
    { value: '50+', label: 'Community Programs', icon: Users },
    { value: `${educationsList.length}`, label: 'Qualifications', icon: GraduationCap },
  ];

  const getStatCardClass = (index: number, total: number) => {
    let base = "glass rounded-xl p-4 text-center group hover:border-accent-500/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-center items-center";
    
    if (total % 2 !== 0 && index === 0) {
      return `${base} col-span-2 py-8 bg-gradient-to-br from-accent-500/10 to-teal-500/10 border-accent-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]`;
    }
    return base;
  };

  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center hero-bg pt-20">
        {/* Animated Blobs */}
        <div className="blob-green top-20 -left-32" />
        <div className="blob-teal -top-20 right-0" />
        <div className="blob-purple bottom-20 left-1/3" />

        {/* Floating Shapes */}
        <div className="absolute top-32 right-16 w-20 h-20 border border-accent-500/20 rounded-2xl rotate-12 animate-float hidden lg:block" />
        <div className="absolute bottom-40 left-20 w-14 h-14 border border-teal-500/20 rounded-full animate-float-slow hidden lg:block" />
        <div className="absolute top-48 left-1/4 w-3 h-3 bg-accent-500/40 rounded-full animate-float hidden lg:block" />
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-teal-400/40 rounded-full animate-float-slow hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <AnimatedSection animation="fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-accent-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Welcome to my portfolio</span>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[var(--font-heading)] leading-[1.1] tracking-tight">
                  <span className="text-white">Hi, I&apos;m</span>
                  <br />
                  <span className="gradient-text">{profileRecord?.name || 'Kamal Baral'}</span>
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <p className="text-lg sm:text-xl text-dark-200 leading-relaxed max-w-xl">
                  {profileRecord?.bio ? (
                    profileRecord.bio.substring(0, 200) + '...'
                  ) : (
                    <span>
                      <span className="text-white font-semibold">{experiencesList.length > 0 ? experiencesList[experiencesList.length - 1].role : 'Professional'}</span> with {EXPERIENCE_YEARS}+ years of
                      dedicated service at the {experiencesList.length > 0 ? experiencesList[experiencesList.length - 1].organization : 'Government of Nepal'}. Passionate about
                      animal welfare, public health, and community empowerment.
                    </span>
                  )}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={300}>
                <div className="flex flex-wrap gap-3">
                  {DYNAMIC_EDUCATION.slice(0, 3).map((edu) => (
                    <span key={edu.degree} className="tag">{edu.degree}</span>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={400}>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/contact?tab=booking" className="btn-primary inline-flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" /> Book Appointment
                  </Link>
                  <Link href="/about" className="btn-secondary inline-flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4" /> Learn More
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={500}>
                <div className="flex items-center gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-dark-200">
                    <MapPin className="w-4 h-4 text-accent-500" />
                    <span>{profileRecord?.currentAddress || 'Sindhuli, Nepal'}</span>
                  </div>
                  <span className="text-dark-400">•</span>
                  <div className="flex items-center gap-2 text-sm text-dark-200">
                    <Briefcase className="w-4 h-4 text-accent-500" />
                    <span>{experiencesList.length > 0 ? experiencesList[experiencesList.length - 1].organization : 'Government of Nepal'}</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right - Stats Card */}
            <AnimatedSection animation="slide-right" delay={300} className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="glass-card rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center shadow-lg shadow-accent-500/20">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold font-[var(--font-heading)]">Quick Profile</h3>
                      <p className="text-xs text-dark-200">Career Snapshot</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {STATS.map((stat, i) => (
                      <div
                        key={stat.label}
                        className={getStatCardClass(i, STATS.length)}
                      >
                        {STATS.length % 2 !== 0 && i === 0 && (
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                        <stat.icon className={`text-accent-400 mb-2 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ${STATS.length % 2 !== 0 && i === 0 ? 'w-8 h-8' : 'w-5 h-5'}`} />
                        <p className={`font-bold text-white font-[var(--font-heading)] ${STATS.length % 2 !== 0 && i === 0 ? 'text-4xl' : 'text-2xl'}`}>{stat.value}</p>
                        <p className={`text-dark-200 mt-1 ${STATS.length % 2 !== 0 && i === 0 ? 'text-sm font-medium' : 'text-xs'}`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-dark-300 text-center">Serving since 2018</p>
                  </div>
                </div>

                {/* Decorative */}
                <div className="absolute -z-10 -top-4 -right-4 w-full h-full rounded-3xl border border-accent-500/10" />
                <div className="absolute -z-20 -top-8 -right-8 w-full h-full rounded-3xl border border-accent-500/5" />
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-1000">
          <span className="text-xs text-dark-300 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-dark-400 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-accent-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== STATS BAR (Mobile) ===== */}
      <section className="lg:hidden py-8 px-6">
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={getStatCardClass(i, STATS.length)}>
              <stat.icon className={`text-accent-400 mb-2 ${STATS.length % 2 !== 0 && i === 0 ? 'w-7 h-7' : 'w-5 h-5'}`} />
              <p className={`font-bold text-white font-[var(--font-heading)] ${STATS.length % 2 !== 0 && i === 0 ? 'text-3xl' : 'text-2xl'}`}>{stat.value}</p>
              <p className={`text-dark-200 mt-1 ${STATS.length % 2 !== 0 && i === 0 ? 'text-sm' : 'text-xs'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ===== EDUCATION TIMELINE ===== */}
      <section className="py-20 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <span className="tag mb-4 inline-flex">
              <GraduationCap className="w-3 h-3 mr-2" /> Education
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] mt-4">
              Academic <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-dark-200 mt-4 max-w-xl mx-auto">
              A blend of veterinary science and political science — building expertise in both animal welfare and public administration.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {DYNAMIC_EDUCATION.map((edu, i) => (
              <AnimatedSection key={edu.degree} animation="fade-up" delay={i * 150}>
                <div className="glass-card rounded-2xl p-8 h-full relative group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${edu.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <edu.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-2">{edu.degree}</h3>
                  <p className="text-sm text-dark-200">{edu.field}</p>
                  <div className="absolute top-6 right-6">
                    <span className={`${edu.tagColor} text-[10px]`}>Completed</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ===== EXPERTISE SECTION ===== */}
      <section className="py-20 px-6 lg:px-8 relative">
        <div className="blob-teal -top-32 -right-32 opacity-50" />

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <span className="tag-blue tag mb-4 inline-flex">
              <Sparkles className="w-3 h-3 mr-2" /> What I Do
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] mt-4">
              Areas of <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-dark-200 mt-4 max-w-xl mx-auto">
              Combining veterinary knowledge with public service experience to create meaningful impact.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {EXPERTISE.map((item, i) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={i * 150}>
                <div className="glass-card rounded-2xl p-8 h-full group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-[var(--font-heading)] mb-3">{item.title}</h3>
                  <p className="text-sm text-dark-200 leading-relaxed">{item.description}</p>
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <Link href="/about" className="text-sm text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1 group/link">
                      Learn more <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ===== LATEST BLOG POSTS ===== */}
      <section className="py-20 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up" className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="tag-purple tag mb-4 inline-flex">
                <BookOpen className="w-3 h-3 mr-2" /> Blog
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] mt-4">
                Latest <span className="gradient-text-blue">Insights</span>
              </h2>
              <p className="text-dark-200 mt-3">Thoughts on veterinary science, governance, and community development.</p>
            </div>
            <Link href="/blog" className="btn-secondary text-sm inline-flex items-center gap-2 shrink-0">
              View All Posts <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {latestBlogs.map((post, i) => (
              <AnimatedSection key={post.id} animation="fade-up" delay={i * 150}>
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <article className="glass-card rounded-2xl p-6 h-full flex flex-col group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="tag text-[10px]">Article</span>
                      <span className="text-xs text-dark-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readingTime || '5 min read'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-3 group-hover:text-accent-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-sm text-dark-200 leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-dark-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </span>
                      <span className="text-sm text-accent-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-6 lg:px-8 relative">
        <div className="blob-green bottom-0 right-0 opacity-50" />
        <AnimatedSection animation="scale" className="max-w-4xl mx-auto relative z-10">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-600 to-teal-500 opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative px-8 sm:px-16 py-16 text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-heading)]">
                Let&apos;s Work Together
              </h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Whether it&apos;s about veterinary consultation, community projects, or just a conversation —
                I&apos;d love to hear from you.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  href="/contact?tab=booking"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-accent-700 font-bold rounded-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <BookOpen className="w-4 h-4" /> About Me
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <Footer socials={socials} />
    </main>
  );
}
