'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLaunchStage } from '@/hooks/useLaunchStage';
import HoneycombGrid from '@/components/launch/HoneycombGrid';
import LaunchCounter from '@/components/launch/LaunchCounter';
import Logo from '@/components/branding/Logo';

export default function LaunchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { stage, advanceStage } = useLaunchStage();

  // Keyboard support: Spacebar or Enter advances stage
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (stage < 3) {
          advanceStage();
        } else {
          router.push('/dashboard');
        }
      } else if (e.key === 'Escape') {
        router.push('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage, advanceStage, router]);

  // Get stage-specific content
  const getStageContent = () => {
    switch (stage) {
      case 0:
        return {
          title: t.launch.title,
          subtitle: t.launch.subtitle,
          prompt: t.launch.clickToActivate,
          showGrid: false,
        };
      case 1:
        return {
          title: t.launch.activatePlatform,
          subtitle: '',
          prompt: t.launch.clickToContinue,
          showGrid: true,
        };
      case 2:
        return {
          title: t.launch.connectEcosystem,
          subtitle: '',
          prompt: t.launch.clickToLaunch,
          showGrid: true,
        };
      case 3:
        return {
          title: t.launch.launching,
          subtitle: t.launch.readyForUsers,
          prompt: '',
          showGrid: true,
        };
      default:
        return {
          title: t.launch.title,
          subtitle: t.launch.subtitle,
          prompt: t.launch.clickToActivate,
          showGrid: false,
        };
    }
  };

  const content = getStageContent();

  const handleClick = () => {
    if (stage < 3) {
      advanceStage();
    } else {
      router.push('/login');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      }}
      onClick={handleClick}
    >
      {/* Background hexagon pattern */}
      <div className="absolute inset-0 opacity-5 hexagon-bg" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto text-center space-y-8 md:space-y-12">
        {/* Logo - Top */}
        {stage === 0 && (
          <div className="animate-fade-slide-up mb-8">
            <Logo size="xl" variant="full" className="justify-center" />
          </div>
        )}

        {/* Title */}
        <div className="animate-fade-slide-up">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="text-lg md:text-xl text-slate-300 mt-2">{content.subtitle}</p>
          )}
        </div>

        {/* Honeycomb Grid */}
        {content.showGrid && (
          <div className="my-8 md:my-12">
            <HoneycombGrid activeRing={stage} onCellClick={handleClick} />
          </div>
        )}

        {/* Center Activation Hexagon (Stage 0) */}
        {stage === 0 && (
          <div className="flex justify-center my-12 animate-scale-in">
            <div
              className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: 'rgba(255, 205, 63, 0.1)',
                border: '2px solid rgba(255, 205, 63, 0.3)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <Sparkles size={48} className="text-bee-primary" />
            </div>
          </div>
        )}

        {/* Launch Counter (Stage 3) */}
        {stage === 3 && (
          <div className="my-8">
            <LaunchCounter targetCount={10000} isVisible={stage === 3} />
          </div>
        )}

        {/* Prompt */}
        {content.prompt && stage < 3 && (
          <div className="animate-pulse">
            <p className="text-sm md:text-base text-slate-400 font-medium">{content.prompt}</p>
            <p className="text-xs text-slate-500 mt-2">
              (Click anywhere or press Space)
            </p>
          </div>
        )}

        {/* Enter App Button (Stage 3) */}
        {stage === 3 && (
          <div className="animate-fade-slide-up mt-8">
            <Button
              size="lg"
              className="btn-bee-primary text-lg px-8 py-6"
              onClick={(e) => {
                e.stopPropagation();
                router.push('/dashboard');
              }}
            >
              <Sparkles size={20} className="mr-2" />
              {t.launch.enterApp}
            </Button>

            {/* QR Code Placeholder */}
            <div className="mt-6 inline-block p-4 bg-white rounded-lg">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                QR Code
              </div>
              <p className="text-xs text-slate-600 mt-2">Scan to download</p>
            </div>
          </div>
        )}

        {/* Stage Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= stage ? 'bg-bee-primary w-8' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Skip Button */}
        {stage < 3 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/dashboard');
            }}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline"
          >
            Skip to Dashboard
          </button>
        )}
      </div>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
