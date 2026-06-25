import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';

const POST_CONTENT = {
  title: 'Digital Governance in Local Municipalities',
  content: `
    Public administration is undergoing a massive shift towards digital governance. 
    By embracing digital tools, local municipalities can significantly improve service delivery, transparency, and citizen engagement.
    
    This shift requires not only technological investment but also a cultural change within government institutions.
    Training public servants to effectively use new systems is just as important as the systems themselves.
  `,
  date: '2023-10-15',
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
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
        <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </header>

      <div className="flex-1 overflow-auto flex flex-col items-center">
        <article className="w-full max-w-3xl p-6 md:p-12">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">
              <Calendar className="w-4 h-4" />
              <span>{new Date(POST_CONTENT.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              {POST_CONTENT.title}
            </h1>
            
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
              {POST_CONTENT.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="leading-relaxed">{paragraph}</p> : null
              ))}
              <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg mt-8 italic border border-slate-100">
                Note: This is a sample post. In a production environment, this content would be fetched from a database based on the slug: <code className="font-mono bg-slate-200 px-1 rounded">{resolvedParams.slug}</code>
              </p>
            </div>
          </div>
        </article>

        <footer className="w-full bg-white border-t border-slate-200 px-8 py-6 mt-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Kamal Baral. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
