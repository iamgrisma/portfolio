import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import { SocialIcon } from '@/src/components/SocialIcon';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

export default function Footer({ socials = [] }: { socials?: SocialLink[] }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto">
      {/* Gradient Top Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent" />

      <div className="bg-dark-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg font-[var(--font-heading)]">
                  KB
                </div>
                <div>
                  <h3 className="text-white font-bold font-[var(--font-heading)]">Kamal Baral</h3>
                  <p className="text-xs text-dark-200 uppercase tracking-widest">Veterinary Technician</p>
                </div>
              </div>
              <p className="text-dark-200 text-sm leading-relaxed max-w-sm">
                Dedicated veterinary professional serving the community of Sindhuli, Nepal.
                Passionate about animal welfare, public health, and community development.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {socials.map((social) => (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1" title={social.platform}>
                    <SocialIcon platform={social.platform} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest font-[var(--font-heading)]">Navigation</h4>
              <div className="space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/contact', label: 'Contact' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-dark-200 hover:text-accent-400 transition-colors duration-300 group"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest font-[var(--font-heading)]">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="flex items-center gap-2 text-sm text-dark-200 hover:text-accent-400 transition-colors duration-300 group">
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Privacy Policy</span>
                </Link>
                <Link href="/contact" className="flex items-center gap-2 text-sm text-dark-200 hover:text-accent-400 transition-colors duration-300 group">
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-dark-300">
              &copy; {currentYear} Kamal Baral. All rights reserved.
            </p>
            <p className="text-xs text-dark-300 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in Sindhuli, Nepal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
