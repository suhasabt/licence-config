import { useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { cn } from '@/lib/utils';
import useClickOutside from '@/hooks/useClickOutside';
import { Megaphone, X } from 'lucide-react';

const transition: any = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.25,
};

export default function AnnouncementMic({ position = 'left' }: { position?: 'left' | 'right' }) {
  const [contentRef, { height: heightContent }] = useMeasure();
  const [menuRef, { width: widthContainer }] = useMeasure();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (!widthContainer || maxWidth > 0) return;
    setMaxWidth(widthContainer);
  }, [widthContainer, maxWidth]);

  return (
    <MotionConfig transition={transition}>
      <div className={`absolute top-0 z-50 ${position === 'left' ? '-left-14 xl:-left-16' : '-right-14 xl:-right-16'}`} ref={ref}>
        <div className='h-full w-full rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden'>
          <div className={`flex p-1.5 ${position === 'right' && !isOpen ? 'justify-end' : ''}`} ref={menuRef}>
            <button
              aria-label="Announcements"
              className={cn(
                'relative flex h-11 shrink-0 scale-100 select-none appearance-none items-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-brand focus-visible:ring-2',
                isOpen ? 'w-full justify-between px-3 text-slate-800' : 'w-11 justify-center'
              )}
              type='button'
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                } else {
                  setIsOpen(false);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Megaphone className={cn('h-5 w-5', isOpen ? 'text-brand' : '')} />
                {isOpen && <span className="font-bold text-[15px]">Announcements</span>}
              </div>
              {!isOpen && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
              {isOpen && <X size={16} className="text-slate-400 hover:text-slate-700" />}
            </button>
          </div>
          <div className='overflow-hidden'>
            <AnimatePresence initial={false} mode='sync'>
              {isOpen ? (
                <motion.div
                  key='content'
                  initial={{ height: 0 }}
                  animate={{ height: heightContent || 0 }}
                  exit={{ height: 0 }}
                  style={{ width: maxWidth > 320 ? maxWidth : 320 }}
                >
                  <div ref={contentRef} className='p-4 pt-0'>
                    <div className="space-y-3 border-t pt-3">
                      <div className="p-3 bg-blue-50/80 text-blue-900 rounded-lg text-sm border border-blue-100/50 hover:bg-blue-50 transition-colors cursor-pointer">
                        <strong className="block mb-1 text-blue-950">✨ New Feature: Advanced Analytics</strong>
                        We've just released the new Workforce Analytics dashboard. Check out the new interactive charts and deep-dive reporting tools!
                      </div>
                      <div className="p-3 bg-amber-50/80 text-amber-900 rounded-lg text-sm border border-amber-100/50 hover:bg-amber-50 transition-colors cursor-pointer">
                        <strong className="block mb-1 text-amber-950">⚙️ Scheduled System Downtime</strong>
                        The core HRIS module will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM EST.
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
