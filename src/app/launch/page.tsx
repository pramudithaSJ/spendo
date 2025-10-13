'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Brain, Target, Shield, BarChart3, Award, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLaunchStage } from '@/hooks/useLaunchStage';
import DraggableBee from '@/components/launch/DraggableBee';
import LaunchPadCell from '@/components/launch/LaunchPadCell';
import FeatureCard from '@/components/launch/FeatureCard';
import ParticleEffect from '@/components/launch/ParticleEffect';
import LaunchCounter from '@/components/launch/LaunchCounter';
import Logo from '@/components/branding/Logo';

export default function LaunchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { stage, advanceStage } = useLaunchStage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [audioAvailable, setAudioAvailable] = useState(false);

  // Initialize audio with fallback
  useEffect(() => {
    const initAudio = async () => {
      try {
        const audio = new Audio('/sounds/launch-music.mp3');
        audio.loop = true;
        audio.volume = 0.3;

        // Test if audio can be loaded
        audio.addEventListener('canplaythrough', () => {
          setAudioAvailable(true);
        }, { once: true });

        audio.addEventListener('error', () => {
          console.log('Background music not available');
          setAudioAvailable(false);
        }, { once: true });

        // Preload the audio
        audio.load();
        audioRef.current = audio;
      } catch (error) {
        console.log('Audio initialization failed:', error);
        setAudioAvailable(false);
      }
    };

    initAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle audio mute
  const toggleMute = () => {
    if (audioRef.current && audioAvailable) {
      if (isMuted) {
        audioRef.current.play().catch((err) => {
          console.log('Audio play failed:', err);
        });
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  // Start music on first interaction (if available and not muted)
  useEffect(() => {
    if (stage === 1 && audioRef.current && audioAvailable && !isMuted) {
      audioRef.current.play().catch((err) => {
        console.log('Auto-play blocked:', err);
      });
    }
  }, [stage, isMuted, audioAvailable]);

  // Keyboard support: Spacebar or Enter advances stage (not on stage 0 - must drag)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        // Skip stage 0 - user must drag the bee
        if (stage === 1) {
          advanceStage();
        } else if (stage >= 2) {
          router.push('/login');
        }
      } else if (e.key === 'Escape') {
        router.push('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage, advanceStage, router]);

  // Handle bee drop
  const handleBeeDrop = () => {
    advanceStage();
  };

  // Feature cards data
  const features = [
    { icon: TrendingUp, title: 'Expense Tracking', description: 'Monitor spending in real-time' },
    { icon: Brain, title: 'AI Financial Advisor', description: 'Smart insights powered by AI' },
    { icon: Target, title: 'Goal Planning', description: 'Set and achieve financial goals' },
    { icon: Shield, title: 'Secure & Private', description: 'Bank-level security protection' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep financial insights' },
    { icon: Award, title: 'Learning Rewards', description: 'Earn while you learn' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bee-secondary/5 via-background to-bee-primary/5" />

      {/* Particle effects */}
      <ParticleEffect isActive={stage >= 1} count={30} />

      {/* Audio control button - only show if audio is available */}
      {audioAvailable && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-surface-elevated border border-surface-border hover:border-bee-primary/50 transition-all duration-300 shadow-lg group"
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          title={isMuted ? 'Click to play music' : 'Click to mute music'}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-text-secondary group-hover:text-bee-primary transition-colors" />
          ) : (
            <Volume2 size={20} className="text-bee-primary animate-pulse" />
          )}
        </button>
      )}

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 space-y-12">

        {/* Stage 0: Initial state with drag interaction */}
        {stage === 0 && (
          <>
            {/* Large logo at top */}
            <div className="animate-fade-slide-up text-center">
              <Logo size="xl" variant="landscape" className="justify-center mb-6" />
              <p className="text-text-secondary text-lg mt-4">
                Financial Literacy Platform
              </p>
            </div>

            {/* Draggable Bee */}
            <div className="animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
              <DraggableBee />
              <p className="text-center text-text-secondary text-sm mt-4">
                Drag Mr. Bee to Launch Pad
              </p>
            </div>

            {/* Launch Pad */}
            <div className="animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
              <LaunchPadCell onDrop={handleBeeDrop} />
            </div>
          </>
        )}

        {/* Stage 1: Features reveal */}
        {stage === 1 && (
          <>
            {/* Title */}
            <div className="text-center animate-fade-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Platform Activated
              </h1>
              <p className="text-text-secondary text-lg">
                Discover powerful financial tools at your fingertips
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  isActive={stage >= 1}
                  delay={index * 100}
                  onClick={() => stage === 1 && advanceStage()}
                />
              ))}
            </div>

            <p className="text-text-secondary text-sm animate-pulse">
              Click any card to continue
            </p>
          </>
        )}

        {/* Stage 2: Launch complete */}
        {stage >= 2 && (
          <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-4xl mx-auto">
            {/* Logo */}
            <div className="animate-fade-slide-up">
              <Logo size="xl" variant="landscape" className="justify-center" />
            </div>

            {/* Title */}
            <div className="animate-fade-slide-up text-center" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
                {t.launch.launching || 'Launch Successful!'}
              </h1>
            </div>

            {/* Loading Counter */}
            <div className="animate-fade-slide-up w-full flex justify-center" style={{ animationDelay: '200ms' }}>
              <LaunchCounter targetCount={10000} isVisible={stage >= 2} />
            </div>

            {/* Description */}
            <div className="animate-fade-slide-up text-center" style={{ animationDelay: '300ms' }}>
              <p className="text-text-secondary text-lg md:text-xl">
                {t.launch.readyForUsers || 'Platform ready for users worldwide'}
              </p>
            </div>

            {/* Enter button */}
            <div className="animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
              <Button
                size="lg"
                className="btn-bee-primary text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => router.push('/login')}
              >
                {t.launch.enterApp || 'Enter Platform'}
              </Button>
            </div>
          </div>
        )}

        {/* Stage progress indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i <= stage ? 'bg-bee-primary w-12' : 'bg-surface-border w-2'
              }`}
            />
          ))}
        </div>

        {/* Skip button */}
        {stage < 2 && (
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-text-secondary hover:text-bee-primary transition-colors underline"
          >
            Skip to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
