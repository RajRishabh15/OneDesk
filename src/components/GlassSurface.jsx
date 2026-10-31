import React, { useId, useMemo } from 'react';

/**
 * GlassSurface component (React Bits)
 * Simulates Apple-style liquid glass with optical refraction,
 * chromatic aberration (RGB channel offsets), backdrop blur,
 * specular meniscus reflections, and custom shape/mask support.
 *
 * Props:
 * - width: number | string (e.g. 320, '100%')
 * - height: number | string (e.g. 76, 'auto')
 * - borderRadius: number | string (e.g. 38, '24px', 9999)
 * - distortionScale: number (default: -180)
 * - displace: number (default: 0.5)
 * - backgroundOpacity: number (default: 0.1)
 * - borderWidth: number | string (default: 0.07)
 * - brightness: number (default: 50)
 * - opacity: number (default: 0.93)
 * - blur: number (default: 11)
 * - saturation: number (default: 1)
 * - redOffset: number (default: 0)
 * - greenOffset: number (default: 10)
 * - blueOffset: number (default: 20)
 * - refraction: boolean (default: true)
 * - renderer: 'auto' | 'svg' | 'webgl' (default: 'auto')
 * - shape: string (SVG URL or path for custom mask)
 * - backdrop: React.RefObject (optional backdrop element)
 * - children: React.ReactNode
 * - className: string
 * - style: React.CSSProperties
 */
export default function GlassSurface({
  width = '100%',
  height = 'auto',
  borderRadius = 20,
  distortionScale = -180,
  displace = 0.5,
  backgroundOpacity = 0.1,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  saturation = 1,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  refraction = true,
  renderer = 'auto',
  shape,
  backdrop,
  children,
  className = '',
  style = {},
  ...restProps
}) {
  const rawId = useId();
  // Safe filter ID for SVG without colons
  const filterId = useMemo(
    () => `glass-filter-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`,
    [rawId]
  );

  // Normalize dimensions
  const formattedWidth = typeof width === 'number' ? `${width}px` : width;
  const formattedHeight = typeof height === 'number' ? `${height}px` : height;
  const formattedRadius =
    typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  // Calculate RGB displacement scales based on distortionScale and channel offsets
  const scaleMultiplier = displace * 0.06;
  const redScale = Math.round((distortionScale + redOffset) * scaleMultiplier);
  const greenScale = Math.round((distortionScale + greenOffset) * scaleMultiplier);
  const blueScale = Math.round((distortionScale + blueOffset) * scaleMultiplier);

  // Computed filter string
  const backdropFilterValue = refraction
    ? `url(#${filterId}) blur(${blur}px) saturate(${saturation * 180}%)`
    : `blur(${blur}px) saturate(${saturation * 180}%)`;

  const webkitBackdropFilterValue = `blur(${blur}px) saturate(${saturation * 180}%)`;

  // Dynamic border thickness
  const resolvedBorderWidth =
    typeof borderWidth === 'number'
      ? `${Math.max(1, Math.round(borderWidth * 14))}px`
      : borderWidth;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: formattedWidth,
        height: formattedHeight,
        opacity,
        ...style,
      }}
      {...restProps}
    >
      {/* Hidden SVG Filter Definition for Optical Refraction & Chromatic Aberration */}
      {refraction && (
        <svg
          className="absolute w-0 h-0 pointer-events-none overflow-hidden"
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
          aria-hidden="true"
        >
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            {/* 1. Procedural Perlin noise for surface displacement */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.02"
              numOctaves="2"
              seed="27"
              result="surfaceNoise"
            />

            {/* 2. Red Channel Displacement */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="surfaceNoise"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={redScale}
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="redOnly"
            />

            {/* 3. Green Channel Displacement */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="surfaceNoise"
              xChannelSelector="G"
              yChannelSelector="B"
              scale={greenScale}
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="greenOnly"
            />

            {/* 4. Blue Channel Displacement */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="surfaceNoise"
              xChannelSelector="B"
              yChannelSelector="R"
              scale={blueScale}
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blueOnly"
            />

            {/* 5. Recombine channels via Screen blending (Chromatic Aberration) */}
            <feBlend mode="screen" in="redOnly" in2="greenOnly" result="rg" />
            <feBlend mode="screen" in="rg" in2="blueOnly" result="chromaticRefraction" />

            {/* 6. Subtle Gaussian diffusion for frosted liquid dispersion */}
            <feGaussianBlur
              in="chromaticRefraction"
              stdDeviation={Math.max(0.4, blur * 0.08)}
            />
          </filter>
        </svg>
      )}

      {/* Main Glass Shell */}
      <div
        className="w-full h-full relative overflow-hidden transition-all duration-300"
        style={{
          borderRadius: formattedRadius,
          background: `linear-gradient(135deg, rgba(255, 255, 255, ${
            backgroundOpacity * 1.8
          }) 0%, rgba(255, 255, 255, ${backgroundOpacity * 0.3}) 45%, rgba(0, 0, 0, ${
            backgroundOpacity * 0.8
          }) 100%), rgba(12, 18, 34, ${backgroundOpacity * 1.2})`,
          border: `${resolvedBorderWidth} solid rgba(255, 255, 255, 0.42)`,
          backdropFilter: backdropFilterValue,
          WebkitBackdropFilter: webkitBackdropFilterValue,
          boxShadow: `inset 0 1.5px 1.2px 0 rgba(255, 255, 255, 0.68), inset 0 -1px 1.5px 0 rgba(0, 0, 0, 0.32), 0 18px 42px -8px rgba(0, 0, 0, 0.45), 0 0 20px -2px var(--accent-glow, rgba(99, 102, 241, 0.25))`,
          maskImage: shape ? `url(${shape})` : undefined,
          WebkitMaskImage: shape ? `url(${shape})` : undefined,
          maskSize: shape ? 'contain' : undefined,
          WebkitMaskSize: shape ? 'contain' : undefined,
          maskRepeat: shape ? 'no-repeat' : undefined,
          WebkitMaskRepeat: shape ? 'no-repeat' : undefined,
          maskPosition: shape ? 'center' : undefined,
          WebkitMaskPosition: shape ? 'center' : undefined,
        }}
      >
        {/* Top Meniscus Specular Reflection Sheen (Liquid Glass Optical Refraction) */}
        <div
          className="absolute inset-x-4 top-0 h-[38%] pointer-events-none rounded-t-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.0) 100%)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Inner Content Slot */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

