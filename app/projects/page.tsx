export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects',
  description: 'View the professional projects and applications I have worked on.',
};

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { getCachedProjects, getCachedSocials, getCachedSiteSettings } from '@/src/db/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import { Code, Building, Server, Layers, Globe, Zap, ArrowRight, Layout } from 'lucide-react';
import Link from 'next/link';

const getTechIcon = (tech: string) => {
  const lTech = tech.toLowerCase();
  if (lTech.includes('react') || lTech.includes('next.js') || lTech.includes('angular')) return <Globe className="w-4 h-4 mr-1 text-blue-400" />;
  if (lTech.includes('.net') || lTech.includes('c#')) return <Server className="w-4 h-4 mr-1 text-purple-400" />;
  if (lTech.includes('php') || lTech.includes('laravel')) return <Code className="w-4 h-4 mr-1 text-rose-400" />;
  if (lTech.includes('oracle') || lTech.includes('db')) return <Layers className="w-4 h-4 mr-1 text-emerald-400" />;
  return <Zap className="w-4 h-4 mr-1 text-yellow-400" />;
};

export default async function ProjectsPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  const [projectList, socials, settings] = await Promise.all([
    getCachedProjects(env.DB),
    getCachedSocials(env.DB),
    getCachedSiteSettings(env.DB)
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar settings={settings} />
        
        <main className="flex-grow pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
                <Layout className="w-4 h-4" />
                <span>Portfolio</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-transparent bg-clip-text">
                Featured Projects
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-16 leading-relaxed">
                A showcase of the systems I've built, optimized, and supported. From high-stakes government accounting frameworks to integrated healthcare billing platforms.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projectList.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.1}>
                  <div className="group relative h-full">
                    {/* Hover glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                    
                    <div className="relative h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex flex-col transition duration-300 group-hover:border-slate-700">
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                          <Building className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                            {project.title}
                          </h3>
                          {project.organization && (
                            <p className="text-sm text-slate-400 font-medium mt-1">
                              {project.organization}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed flex-grow mb-8">
                        {project.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {project.techStack?.split(',').map((tech, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs font-medium text-slate-300 border border-slate-700/50 group-hover:border-slate-600 transition-colors"
                            >
                              {getTechIcon(tech.trim())}
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            
            <AnimatedSection delay={0.4}>
              <div className="mt-20 text-center">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] group">
                  <span>Start a New Project</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </main>
        
        <Footer socials={socials} settings={settings} />
      </div>
    </div>
  );
}
