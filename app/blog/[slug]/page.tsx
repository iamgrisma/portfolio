import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, Tag, Share2, ArrowRight, BookOpen } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { socialProfiles } from '@/src/db/schema';

const BLOG_CONTENT: Record<string, {
  title: string;
  content: string[];
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
}> = {
  'digital-governance': {
    title: 'Digital Governance in Local Municipalities',
    content: [
      'Public administration is undergoing a massive shift towards digital governance. By embracing digital tools, local municipalities can significantly improve service delivery, transparency, and citizen engagement.',
      'In Nepal, the transition to digital governance presents both opportunities and challenges. Rural municipalities like those in Sindhuli district are gradually adopting technology for citizen services, land records, and public health tracking.',
      'This shift requires not only technological investment but also a cultural change within government institutions. Training public servants to effectively use new systems is just as important as the systems themselves.',
      'Key areas where digital governance can make an immediate impact include: birth and death registration, property tax collection, veterinary service scheduling, and public health reporting. Each of these services, when digitized, reduces paperwork, speeds up processing, and increases accessibility for citizens.',
      'Looking ahead, the integration of mobile platforms and cloud-based solutions will further democratize access to government services, especially for communities in remote hill districts of Nepal.',
    ],
    date: '2023-10-15',
    category: 'Governance',
    tags: ['Digital', 'Government', 'Technology', 'Nepal'],
    readingTime: '5 min read',
  },
  'community-outreach': {
    title: 'Community Outreach Strategies for 2024',
    content: [
      'Effective community outreach is the backbone of good governance. In 2024, local governments need to adopt multi-channel strategies to ensure all community voices are heard.',
      'Traditional methods like town hall meetings remain important, but they must be supplemented with digital platforms, social media engagement, and targeted awareness campaigns.',
      'In my experience working in Sindhuli, the most successful outreach programs are those that combine local knowledge with modern communication tools. Door-to-door campaigns, community radio broadcasts, and partnership with local organizations create a comprehensive outreach network.',
      'Special attention must be given to marginalized groups — women, indigenous communities, and people with disabilities — to ensure inclusive participation in community decision-making processes.',
    ],
    date: '2023-11-02',
    category: 'Community',
    tags: ['Outreach', 'Inclusion', 'Planning'],
    readingTime: '4 min read',
  },
  'future-public-administration': {
    title: 'The Future of Public Administration',
    content: [
      'The landscape of public administration in Nepal is evolving rapidly. Modern technology and data-driven approaches are reshaping how government services are delivered and how policies are implemented.',
      'Artificial intelligence, big data analytics, and automated workflows are no longer concepts reserved for the private sector. Progressive government agencies worldwide are integrating these technologies into their operations.',
      'For Nepal, the future lies in building robust digital infrastructure that can support e-governance at all levels — from central ministries to rural municipalities. This requires investment in both hardware and human capital.',
      'The role of public administrators is also changing. Beyond traditional bureaucratic functions, modern administrators need to be data-literate, technology-savvy, and citizen-centric in their approach to governance.',
      'The fusion of traditional administrative wisdom with modern technological capabilities will define the next era of public administration in Nepal and across South Asia.',
    ],
    date: '2023-12-10',
    category: 'Policy',
    tags: ['Future', 'Innovation', 'Nepal'],
    readingTime: '6 min read',
  },
};

const RELATED_POSTS = [
  { title: 'Community Outreach Strategies for 2024', slug: 'community-outreach', category: 'Community' },
  { title: 'The Future of Public Administration', slug: 'future-public-administration', category: 'Policy' },
  { title: 'Digital Governance in Local Municipalities', slug: 'digital-governance', category: 'Governance' },
];

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  const socials = await db.select().from(socialProfiles);

  const resolvedParams = await params;
  const post = BLOG_CONTENT[resolvedParams.slug];

  if (!post) {
    return (
      <main className="min-h-screen bg-dark-900 overflow-hidden">
        <Navbar />
        <section className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-16 h-16 text-dark-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white font-[var(--font-heading)] mb-4">Post Not Found</h1>
            <p className="text-dark-200 mb-8">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link href="/blog" className="btn-primary inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </section>
        <Footer socials={socials} />
      </main>
    );
  }

  const relatedPosts = RELATED_POSTS.filter((p) => p.slug !== resolvedParams.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      <Navbar />

      {/* Article Header */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 hero-bg">
        <div className="blob-purple -top-32 right-0 opacity-30" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-dark-200 hover:text-accent-400 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="tag">{post.category}</span>
            <span className="text-xs text-dark-300 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readingTime}
            </span>
            <span className="text-xs text-dark-300 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                KB
              </div>
              <div>
                <p className="text-sm text-white font-medium">Kamal Baral</p>
                <p className="text-xs text-dark-300">Veterinary Technician</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <article className="glass-card rounded-2xl p-8 sm:p-12 mb-12">
            <div className="prose-dark space-y-6">
              {post.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-dark-300" />
              {post.tags.map((tag) => (
                <span key={tag} className="tag text-xs">{tag}</span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-sm text-dark-300">Enjoyed this article? Share it!</p>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-accent-400 transition-all duration-300" title="Share">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white font-[var(--font-heading)] mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="block group">
                    <div className="glass-card rounded-xl p-6">
                      <span className="tag text-[10px] mb-3 inline-flex">{related.category}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors leading-snug">
                        {related.title}
                      </h4>
                      <span className="text-xs text-accent-400 flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer socials={socials} />
    </main>
  );
}
