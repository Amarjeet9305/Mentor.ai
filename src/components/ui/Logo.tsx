import React from 'react';

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 450 115" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* 
        Aura AI Logo 
        Graphic "A" is composed of 3 triangles.
        Bottom at y=85, Top at y=5
      */}
      <g transform="translate(10, 5)">
        {/* Top Brown Triangle */}
        <polygon points="35,0 52.5,40 17.5,40" fill="#482d23" />
        {/* Bottom Left Blue Triangle */}
        <polygon points="17.5,40 35,80 0,80" fill="#4189cc" />
        {/* Bottom Right Green Triangle */}
        <polygon points="52.5,40 70,80 35,80" fill="#7db353" />
      </g>

      {/* URA AI Text */}
      {/* 
        Baseline aligned with the bottom of the triangles (y=85)
        We use Arial Black / system bold fonts for thick presentation.
      */}
      <text
        x="95"
        y="85"
        fontFamily="Arial Black, Impact, system-ui, sans-serif"
        fontWeight="bold"
        fontSize="82"
        fill="#333333"
        letterSpacing="-1"
      >
        URA AI
      </text>

      {/* Subtitle */}
      {/* Below the main text */}
      <text
        x="10"
        y="110"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="500"
        fontSize="16"
        fill="#555555"
        letterSpacing="1.2"
      >

      </text>
    </svg>
  );
}
