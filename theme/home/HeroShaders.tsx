import { BrowserOnly, useDark } from '@rspress/core/runtime';
import {
  type ComponentType,
  type CSSProperties,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

type GrainGradientProps = {
  colors?: string[];
  colorBack?: string;
  softness?: number;
  intensity?: number;
  noise?: number;
  speed?: number;
  shape?: string;
  minPixelRatio?: number;
  maxPixelCount?: number;
  style?: CSSProperties;
  className?: string;
};

const SILVER_COLORS_DARK = ['#c7d0db', '#6b7785', '#1b243000'] as const;
const SILVER_COLORS_LIGHT = ['#f1f5f9', '#94a3b8', '#64748b20'] as const;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

function useIsVisible<T extends Element>(ref: RefObject<T | null>): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setVisible(entry.isIntersecting);
        }
      },
      { rootMargin: '80px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

/**
 * Hero grain shader only (no Fumadocs dither sphere / moon logo).
 * Client-only via BrowserOnly + dynamic import (WebGL cannot SSR).
 */
function HeroShadersCanvas() {
  const isDark = useDark();
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useIsVisible(rootRef);
  const [GrainGradient, setGrainGradient] =
    useState<ComponentType<GrainGradientProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Delay slightly so slower devices finish WebGL uniform image setup.
    const timer = window.setTimeout(() => {
      void import('@paper-design/shaders-react').then((mod) => {
        if (!cancelled) {
          setGrainGradient(
            () => mod.GrainGradient as ComponentType<GrainGradientProps>,
          );
        }
      });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!GrainGradient) {
    return (
      <div
        ref={rootRef}
        className="fd-hero__shader-fallback"
        aria-hidden="true"
      />
    );
  }

  const speed = reducedMotion || !visible ? 0 : 1;

  return (
    <div ref={rootRef} className="fd-hero__grain">
      <GrainGradient
        colors={[...(isDark ? SILVER_COLORS_DARK : SILVER_COLORS_LIGHT)]}
        colorBack="#00000000"
        softness={1}
        intensity={0.85}
        noise={0.45}
        speed={speed}
        shape="corners"
        minPixelRatio={1}
        maxPixelCount={1920 * 1080}
      />
    </div>
  );
}

export function HeroShaders() {
  return (
    <div className="fd-hero__shaders" aria-hidden="true">
      <BrowserOnly
        fallback={
          <div className="fd-hero__shader-fallback" aria-hidden="true" />
        }
      >
        {() => <HeroShadersCanvas />}
      </BrowserOnly>
    </div>
  );
}
