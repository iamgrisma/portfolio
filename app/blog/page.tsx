import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Digital Governance in Local Municipalities',
    excerpt: 'Exploring how local governments can leverage digital tools to improve public service delivery and citizen engagement.',
    date: '2023-10-15',
    slug: 'digital-governance'
  },
  {
    id: 2,
    title: 'Community Outreach Strategies for 2024',
    excerpt: 'Effective methods for reaching diverse community groups and ensuring all voices are heard in local decision-making.',
    date: '2023-11-02',
    slug: 'community-outreach'
  },
  {
    id: 3,
    title: 'The Future of Public Administration',
    excerpt: 'How modern technology and data-driven approaches are reshaping the landscape of public administration in Nepal.',
    date: '2023-12-10',
    slug: 'future-public-administration'
  }
];

export default function BlogList() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-xl">KB</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Kamal Baral</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Government of Nepal &bull; Sindhuli</p>
          </div>
        </div>
        <nav className="flex gap-6 items-center text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
          <Link href="/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
        </nav>
      </header>

      <div className="flex-1 overflow-auto flex flex-col items-center">
        <section className="w-full max-w-4xl p-6 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Latest Insights</h2>
          
          <div className="flex flex-col gap-6">
            {BLOG_POSTS.map(post => (
              <article key={post.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{post.excerpt}</p>
                </div>
                <div className="shrink-0">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-900 transition-colors bg-blue-50 px-4 py-2 rounded-lg">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="w-full bg-white border-t border-slate-200 px-8 py-6 mt-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Kamal Baral. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
