'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, ChevronDown, Check } from 'lucide-react';

const COMMON_ICONS = [
  'Activity', 'AlertCircle', 'AlertTriangle', 'AlignLeft', 'AlignCenter', 'AlignRight', 'AlignJustify',
  'Anchor', 'Aperture', 'Archive', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Award', 'BarChart',
  'BarChart2', 'Battery', 'BatteryCharging', 'Bell', 'BellOff', 'Bluetooth', 'Book', 'BookOpen', 'Bookmark',
  'Box', 'Briefcase', 'Calendar', 'Camera', 'CameraOff', 'Cast', 'Check', 'CheckCircle', 'CheckSquare',
  'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle',
  'CloudLightning', 'CloudRain', 'CloudSnow', 'Code', 'Coffee', 'Command', 'Compass', 'Copy', 'CornerDownLeft',
  'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp', 'CornerRightDown', 'CornerRightUp', 'CornerUpLeft',
  'CornerUpRight', 'Cpu', 'CreditCard', 'Crop', 'Crosshair', 'Database', 'Delete', 'Disc', 'Divide',
  'DivideCircle', 'DivideSquare', 'DollarSign', 'Download', 'DownloadCloud', 'Droplet', 'Edit', 'Edit2',
  'Edit3', 'Eye', 'EyeOff', 'FastForward', 'Feather', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Film',
  'Filter', 'Flag', 'Folder', 'FolderMinus', 'FolderPlus', 'Frown', 'Gift', 'GitBranch', 'GitCommit',
  'GitMerge', 'GitPullRequest', 'Github', 'Gitlab', 'Globe', 'Grid', 'HardDrive', 'Hash', 'Headphones',
  'Heart', 'HelpCircle', 'Hexagon', 'Home', 'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key', 'Layers',
  'Layout', 'LifeBuoy', 'Link', 'Link2', 'Linkedin', 'List', 'Lock', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin',
  'Maximize', 'Maximize2', 'Meh', 'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 'MicOff', 'Minimize',
  'Minimize2', 'Minus', 'MinusCircle', 'MinusSquare', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical',
  'MousePointer', 'Move', 'Music', 'Navigation', 'Navigation2', 'Octagon', 'Package', 'Paperclip', 'Pause',
  'PauseCircle', 'PenTool', 'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneMissed',
  'PhoneOff', 'PhoneOutgoing', 'PieChart', 'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket',
  'Power', 'Printer', 'Radio', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Rss',
  'Save', 'Scissors', 'Search', 'Send', 'Server', 'Settings', 'Share', 'Share2', 'Shield', 'ShieldOff',
  'ShoppingBag', 'ShoppingCart', 'Shuffle', 'Sidebar', 'SkipBack', 'SkipForward', 'Slack', 'Slash', 'Sliders',
  'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'StopCircle', 'Sun', 'Sunrise', 'Sunset', 'Tablet',
  'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown', 'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Tool',
  'Trash', 'Trash2', 'Trello', 'TrendingDown', 'TrendingUp', 'Triangle', 'Truck', 'Tv', 'Twitch', 'Twitter',
  'Type', 'Umbrella', 'Underline', 'Unlock', 'Upload', 'UploadCloud', 'User', 'UserCheck', 'UserMinus',
  'UserPlus', 'UserX', 'Users', 'Video', 'VideoOff', 'Voicemail', 'Volume', 'Volume1', 'Volume2', 'VolumeX',
  'Watch', 'Wifi', 'WifiOff', 'Wind', 'X', 'XCircle', 'XSquare', 'Youtube', 'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut',
  // Medical/Vet specific
  'Syringe', 'Stethoscope', 'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Rat', 'Bone', 'Dna', 'Microscope',
  'Activity', 'TestTube', 'TestTubes', 'FlaskConical', 'Tablets', 'Pills', 'Bandage', 'Cross', 'HeartPulse'
];

export default function IconPicker({ name, defaultValue = 'Award', className = '' }: { name: string, defaultValue?: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(defaultValue);
  const [currentPage, setCurrentPage] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 100; // 10x10 grid

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredIcons = useMemo(() => {
    if (!search) return COMMON_ICONS;
    return COMMON_ICONS.filter(icon => icon.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [search]);

  const totalPages = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);
  const paginatedIcons = filteredIcons.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  // Handle selected icon component dynamically
  const SelectedIconComponent = (LucideIcons as any)[selectedIcon] || LucideIcons.HelpCircle;

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <input type="hidden" name={name} value={selectedIcon} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between admin-input px-3 py-2 text-sm text-left"
      >
        <div className="flex items-center gap-2 truncate">
          <SelectedIconComponent className="w-4 h-4 text-accent-400 shrink-0" />
          <span className="truncate text-white">{selectedIcon}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-dark-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-[320px] sm:w-[360px] p-2 bg-dark-800 border border-white/10 rounded-xl shadow-2xl shadow-black/50 right-0 sm:left-0">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-900 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent-500/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="grid grid-cols-10 gap-1 pr-1 custom-scrollbar">
            {paginatedIcons.map((iconName) => {
              const IconComponent = (LucideIcons as any)[iconName];
              if (!IconComponent) return null;
              
              const isSelected = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(iconName);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  title={iconName}
                  className={`flex items-center justify-center p-1.5 rounded transition-colors
                    ${isSelected 
                      ? 'bg-accent-500 text-white' 
                      : 'text-dark-100 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                </button>
              );
            })}
            {filteredIcons.length === 0 && (
              <div className="col-span-10 text-center py-4 text-sm text-dark-400">
                No icons found
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(0, p - 1)); }}
                disabled={currentPage === 0}
                className="text-xs px-2 py-1 bg-white/5 rounded text-dark-200 hover:text-white disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-xs text-dark-400">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages - 1, p + 1)); }}
                disabled={currentPage === totalPages - 1}
                className="text-xs px-2 py-1 bg-white/5 rounded text-dark-200 hover:text-white disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
