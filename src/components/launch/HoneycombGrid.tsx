'use client';

import HexCell from './HexCell';
import { useLanguage } from '@/contexts/LanguageContext';

interface HoneycombGridProps {
  activeRing: number; // 0 = none, 1 = center + ring1, 2 = + ring2, 3 = all
  onCellClick?: () => void;
}

export default function HoneycombGrid({ activeRing, onCellClick }: HoneycombGridProps) {
  const { t } = useLanguage();

  // Cell data with rings
  const cells = [
    // Center (Ring 0)
    { id: 0, ring: 0, label: t.launch.aiPowered, icon: '🤖', delay: 0 },

    // Ring 1 - Core features (6 cells)
    { id: 1, ring: 1, label: t.launch.expenseTracking, icon: '💰', delay: 100 },
    { id: 2, ring: 1, label: t.launch.aiAdvisor, icon: '🧠', delay: 200 },
    { id: 3, ring: 1, label: t.launch.smartBudgeting, icon: '📊', delay: 300 },
    { id: 4, ring: 1, label: t.launch.learningModules, icon: '🎓', delay: 400 },
    { id: 5, ring: 1, label: t.launch.investmentInsights, icon: '💹', delay: 500 },
    { id: 6, ring: 1, label: t.launch.reportsAnalytics, icon: '📈', delay: 600 },

    // Ring 2 - Extended features (12 cells - desktop only)
    { id: 7, ring: 2, label: t.launch.multiCurrency, icon: '💱', delay: 100 },
    { id: 8, ring: 2, label: t.launch.billReminders, icon: '🔔', delay: 150 },
    { id: 9, ring: 2, label: t.launch.goalSetting, icon: '🎯', delay: 200 },
    { id: 10, ring: 2, label: t.launch.debtManagement, icon: '💳', delay: 250 },
    { id: 11, ring: 2, label: t.launch.taxCalculator, icon: '🧮', delay: 300 },
    { id: 12, ring: 2, label: t.launch.loanAnalysis, icon: '🏦', delay: 350 },
    { id: 13, ring: 2, label: t.launch.savingsOptimizer, icon: '🏅', delay: 400 },
    { id: 14, ring: 2, label: t.launch.creditMonitoring, icon: '📊', delay: 450 },
    { id: 15, ring: 2, label: t.launch.exportTools, icon: '📤', delay: 500 },
    { id: 16, ring: 2, label: t.launch.community, icon: '👥', delay: 550 },
    { id: 17, ring: 2, label: t.launch.securityFirst, icon: '🔒', delay: 600 },
    { id: 18, ring: 2, label: t.launch.crossPlatform, icon: '📱', delay: 650 },
  ];

  // Filter cells based on screen size and active ring
  const visibleCells = cells.filter((cell) => {
    if (activeRing === 0) return false; // Nothing active yet
    if (activeRing === 1) return cell.ring <= 1; // Center + Ring 1
    if (activeRing === 2) return cell.ring <= 2; // Center + Ring 1 + Ring 2
    return true; // Show all
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Desktop & Tablet: Honeycomb layout */}
      <div className="hidden md:block">
        <div className="relative flex flex-col items-center gap-2">
          {/* Ring 0 - Center */}
          <div className="flex justify-center mb-2">
            {cells
              .filter((c) => c.ring === 0 && visibleCells.includes(c))
              .map((cell) => (
                <HexCell
                  key={cell.id}
                  label={cell.label}
                  icon={cell.icon}
                  isActive={activeRing >= cell.ring}
                  delay={cell.delay}
                  onClick={onCellClick}
                />
              ))}
          </div>

          {/* Ring 1 - 6 cells */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {cells
              .filter((c) => c.ring === 1 && visibleCells.includes(c))
              .map((cell) => (
                <HexCell
                  key={cell.id}
                  label={cell.label}
                  icon={cell.icon}
                  isActive={activeRing >= cell.ring}
                  delay={cell.delay}
                  onClick={onCellClick}
                />
              ))}
          </div>

          {/* Ring 2 - 12 cells (desktop only) */}
          {activeRing >= 2 && (
            <div className="hidden lg:flex flex-wrap justify-center gap-2 max-w-4xl mt-2">
              {cells
                .filter((c) => c.ring === 2 && visibleCells.includes(c))
                .map((cell) => (
                  <HexCell
                    key={cell.id}
                    label={cell.label}
                    icon={cell.icon}
                    isActive={activeRing >= cell.ring}
                    delay={cell.delay}
                    onClick={onCellClick}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Vertical stack */}
      <div className="flex md:hidden flex-col items-center gap-3">
        {cells
          .filter((c) => c.ring <= 1 && visibleCells.includes(c))
          .map((cell) => (
            <HexCell
              key={cell.id}
              label={cell.label}
              icon={cell.icon}
              isActive={activeRing >= cell.ring}
              delay={cell.delay}
              onClick={onCellClick}
            />
          ))}
      </div>

      {/* Connecting lines - subtle SVG overlay (optional enhancement) */}
      {activeRing >= 2 && (
        <svg
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ zIndex: 0 }}
        >
          {/* Add subtle connection lines here if needed */}
        </svg>
      )}
    </div>
  );
}
