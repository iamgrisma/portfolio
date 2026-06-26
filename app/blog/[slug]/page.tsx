import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, Tag, Share2, ArrowRight, BookOpen } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { CloudflareEnv } from '@/src/db';
import { getCachedSocials, getCachedBlogBySlug, getCachedRelatedBlogs } from '@/src/db/queries';

export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const socials = await getCachedSocials(env.DB);

  const resolvedParams = await params;
  
  // Fetch the specific blog post
  const post = await getCachedBlogBySlug(env.DB, resolvedParams.slug);

  if (!post || !post.published) {
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

  // Fetch related posts
  const relatedPosts = await getCachedRelatedBlogs(env.DB, post.id, post.categoryId);

  const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');

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
            <span className="tag">{post.category?.name || 'Uncategorized'}</span>
            <span className="text-xs text-dark-300 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readingTime || '5 min read'}
            </span>
            <span className="text-xs text-dark-300 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[var(--font-heading)] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                RM
              </div>
              <div>
                <p className="text-sm text-white font-medium">Raksha</p>
                <p className="text-xs text-dark-300">IT Professional</p>
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
              {paragraphs.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed text-dark-100">{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            {post.blogTags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-dark-300" />
                {post.blogTags.map(({ tag }) => (
                  <span key={tag.name} className="tag text-xs">{tag.name}</span>
                ))}
              </div>
            )}

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
                      <span className="tag text-[10px] mb-3 inline-flex">{related.category?.name || 'Uncategorized'}</span>
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
