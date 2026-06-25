import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Twitch,
  Dribbble,
  Figma,
  Codepen,
  Gitlab,
  Slack,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Video,
  Rss
} from 'lucide-react';

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const normalized = platform.toLowerCase();

  if (normalized.includes('facebook') || normalized.includes('fb')) return <Facebook className={className} />;
  if (normalized.includes('twitter') || normalized.includes('x')) return <Twitter className={className} />;
  if (normalized.includes('linkedin')) return <Linkedin className={className} />;
  if (normalized.includes('instagram') || normalized.includes('insta')) return <Instagram className={className} />;
  if (normalized.includes('youtube') || normalized.includes('yt')) return <Youtube className={className} />;
  if (normalized.includes('github') || normalized.includes('git')) return <Github className={className} />;
  if (normalized.includes('twitch')) return <Twitch className={className} />;
  if (normalized.includes('dribbble')) return <Dribbble className={className} />;
  if (normalized.includes('figma')) return <Figma className={className} />;
  if (normalized.includes('codepen')) return <Codepen className={className} />;
  if (normalized.includes('gitlab')) return <Gitlab className={className} />;
  if (normalized.includes('slack')) return <Slack className={className} />;
  if (normalized.includes('whatsapp') || normalized.includes('telegram') || normalized.includes('messenger') || normalized.includes('chat') || normalized.includes('wechat')) return <MessageCircle className={className} />;
  if (normalized.includes('tiktok') || normalized.includes('snapchat') || normalized.includes('video')) return <Video className={className} />;
  if (normalized.includes('viber') || normalized.includes('phone') || normalized.includes('call')) return <Phone className={className} />;
  if (normalized.includes('email') || normalized.includes('mail') || normalized.includes('gmail')) return <Mail className={className} />;
  if (normalized.includes('rss') || normalized.includes('feed') || normalized.includes('blog')) return <Rss className={className} />;
  if (normalized.includes('address') || normalized.includes('location') || normalized.includes('maps')) return <MapPin className={className} />;
  if (normalized.includes('website') || normalized.includes('web') || normalized.includes('site') || normalized.includes('portfolio')) return <Globe className={className} />;
  
  return <Link2 className={className} />;
}
