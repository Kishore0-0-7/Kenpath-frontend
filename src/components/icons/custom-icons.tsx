import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Custom bespoke SVG icon set for Sweety Blood Glucose Tracker.
 * Crafted to eliminate generic stock AI icons with distinct medical-journal geometry.
 */

// 0. Sweety Brand Emblem / App Icon
export function SweetyBrandIcon({
  size = 28,
  withBackground = false,
  className = "",
  ...props
}: IconProps & { withBackground?: boolean }) {
  if (withBackground) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        {...props}
      >
        <defs>
          <linearGradient id="brand-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#286B55" />
            <stop offset="100%" stopColor="#1C4F3F" />
          </linearGradient>
          <linearGradient id="brand-drop-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6F0EB" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#brand-sq-bg)" />
        <rect x="2" y="2" width="60" height="60" rx="16" stroke="#4DA387" strokeWidth="1.5" strokeOpacity="0.3" />
        <path
          d="M32 12C32 12 18 25.5 18 35.5C18 43.5 24.2 49 32 49C39.8 49 46 43.5 46 35.5C46 25.5 32 12 32 12Z"
          fill="url(#brand-drop-glow)"
        />
        <path
          d="M24 37C24.5 37 27 33.5 30 33.5C33 33.5 33.5 38 36.5 38C39 38 40.5 35.5 40.5 35.5"
          stroke="#1F5443"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="24.5" r="2.25" fill="#1F5443" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M16 4C16 4 7 13.5 7 20C7 25 11 28.5 16 28.5C21 28.5 25 25 25 20C25 13.5 16 4 16 4Z"
        fill="currentColor"
      />
      <path
        d="M11 21C11.5 21 13 19 15 19C17 19 17.5 22 19 22C20.5 22 21.5 20.5 21.5 20.5"
        stroke="#151B18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="12.5" r="1.5" fill="#151B18" />
    </svg>
  );
}

// 1. Clinical Envelope / Mail Icon
export function CustomMailIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="M3.5 6.5L11.08 12.35C11.62 12.77 12.38 12.77 12.92 12.35L20.5 6.5" />
      <path d="M3.5 18.5L8.5 13.5" strokeOpacity="0.4" />
      <path d="M20.5 18.5L15.5 13.5" strokeOpacity="0.4" />
    </svg>
  );
}

// 2. Clinical Journal Calendar Icon
export function CustomCalendarIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
      <path d="M8 2.5V5.5" strokeWidth="2" />
      <path d="M16 2.5V5.5" strokeWidth="2" />
      <path d="M3 9.5H21" />
      <rect x="7" y="13" width="2.5" height="2.5" rx="0.5" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <circle cx="12" cy="14.25" r="1.25" fill="currentColor" fillOpacity="0.3" stroke="none" />
      <circle cx="16.5" cy="14.25" r="1.25" fill="currentColor" fillOpacity="0.3" stroke="none" />
    </svg>
  );
}

// 3. Timezone Meridian Globe Icon
export function CustomGlobeIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" />
      <ellipse cx="12" cy="12" rx="4.5" ry="9.25" />
      <path d="M3.2 9H20.8" />
      <path d="M3.2 15H20.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" fillOpacity="0.8" stroke="none" />
    </svg>
  );
}

// 4. Botanical Radiant Sun Icon (Light Mode)
export function CustomSunIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" stroke="none" />
      <path d="M12 2.5V5" strokeWidth="2" />
      <path d="M12 19V21.5" strokeWidth="2" />
      <path d="M2.5 12H5" strokeWidth="2" />
      <path d="M19 12H21.5" strokeWidth="2" />
      <path d="M5.3 5.3L7.1 7.1" />
      <path d="M16.9 16.9L18.7 18.7" />
      <path d="M5.3 18.7L7.1 16.9" />
      <path d="M16.9 7.1L18.7 5.3" />
    </svg>
  );
}

// 5. Crisp Crescent Moon Icon (Dark Mode)
export function CustomMoonIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path
        d="M20.35 14.5A8.5 8.5 0 0 1 9.5 3.65C9.35 3.65 9.2 3.66 9.05 3.67A9.5 9.5 0 1 0 20.33 14.95C20.34 14.8 20.35 14.65 20.35 14.5Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="9" cy="14" r="1.2" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="13" cy="17" r="0.8" fill="currentColor" fillOpacity="0.4" stroke="none" />
    </svg>
  );
}

// 6. Dual-State System Device Icon
export function CustomSystemIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2.5" y="3.5" width="19" height="13" rx="2.5" />
      <path d="M12 3.5V16.5" strokeDasharray="2 2" strokeOpacity="0.6" />
      <path d="M8 20.5H16" strokeWidth="2" />
      <path d="M12 16.5V20.5" />
      <path d="M3 12.5H12" strokeOpacity="0.3" />
    </svg>
  );
}

// 7. Clinical Glucose Gauge / Droplet Icon
export function CustomGlucoseGaugeIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Glucose Droplet silhouette */}
      <path
        d="M12 2.75C12 2.75 6 9.8 6 14.5C6 17.81 8.69 20.5 12 20.5C15.31 20.5 18 17.81 18 14.5C18 9.8 12 2.75 12 2.75Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Measurement scale ticks inside droplet */}
      <path d="M10 11.5H13" strokeWidth="1.6" />
      <path d="M9.5 14H14.5" strokeWidth="1.6" />
      <path d="M10.5 16.5H13.5" strokeWidth="1.6" />
    </svg>
  );
}

// 8. Patient Security Shield Icon
export function CustomShieldSecurityIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path
        d="M12 2.75L4 6.25V12.25C4 17.3 7.4 21.05 12 22.25C16.6 21.05 20 17.3 20 12.25V6.25L12 2.75Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Centered medical security cross */}
      <path d="M12 8.5V15.5" strokeWidth="2" />
      <path d="M8.5 12H15.5" strokeWidth="2" />
    </svg>
  );
}

// 9. Session Egress / Logout Icon
export function CustomLogoutIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" />
      <path d="M16 17L21 12L16 7" strokeWidth="2" />
      <path d="M21 12H9" strokeWidth="2" />
    </svg>
  );
}

// 10. Checkmark Icon
export function CustomCheckIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4.5 10.5L8 14L15.5 6" />
    </svg>
  );
}

// 11. Clinical Pulse / Rhythm Wave Icon
export function CustomPulseIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2.5 12H6.5L9 5L13.5 19L16.5 10L18.5 13H21.5" />
    </svg>
  );
}

// 12. Patient Identification Badge Icon
export function CustomUserBadgeIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="7.5" r="4.25" fill="currentColor" fillOpacity="0.15" />
      <path d="M4.5 20.5C4.5 16.5 7.8 14.5 12 14.5C16.2 14.5 19.5 16.5 19.5 20.5" />
    </svg>
  );
}

// 13. Offline / Disconnected Icon
export function CustomWifiOffIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />
      <path d="M8.5 16.5C9.5 15.5 10.7 15 12 15C13.3 15 14.5 15.5 15.5 16.5" />
      <path d="M5 12.5C7 10.5 9.4 9.5 12 9.5C13.2 9.5 14.4 9.8 15.5 10.4" />
      <path d="M1.5 8.5C3.5 6.5 6.2 5.3 9 4.8" />
      <path d="M17.5 5.5C19.8 6.3 21.8 7.8 22.5 8.5" />
      <circle cx="12" cy="20" r="1.25" fill="currentColor" />
    </svg>
  );
}

// 14. Reconnected / Online Icon
export function CustomWifiOnIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 12.5C9 8.5 15 8.5 19 12.5" />
      <path d="M1.5 8.5C7.5 2.5 16.5 2.5 22.5 8.5" />
      <path d="M8.5 16.5C10.5 14.5 13.5 14.5 15.5 16.5" />
      <circle cx="12" cy="20" r="1.25" fill="currentColor" />
    </svg>
  );
}
