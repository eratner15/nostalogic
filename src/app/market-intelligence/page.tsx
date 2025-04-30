
import React from 'react';
import ReactMarkdown from 'react-markdown';

const HeroBanner = () => (
  <div className="relative bg-background py-10 md:py-20">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        Unlock the Nostalgia Goldmine
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Identify, analyze, and visualize the next big hit from the 90s
      </p>
      {/*  Removed Link Here */}
    </div>
  </div>
);

const TREND_REPORT_MARKDOWN = `
## 1993-1998 Generative AI Deep Research Trend Report

### Overview

This report analyzes key trends from 1993-1998, a pivotal era for nostalgia-driven revivals. We leverage generative AI to provide insights into potential market opportunities.

### Key Trends

1.  **Rise of Digital Entertainment**:
    *   The internet became more accessible, impacting media consumption.
    *   Key technologies emerged (e.g., early web browsers, online gaming).

2.  **Grunge and Alternative Culture**:
    *   Music: Grunge dominated the charts (Nirvana, Pearl Jam).
    *   Fashion: Anti-establishment styles became mainstream.

3.  **Animated Renaissance**:
    *   Disney: The Lion King, Toy Story reshaped animated films.
    *   Television:  New animated series gained popularity.

4.  **Gaming Revolution**:
    *   Consoles: PlayStation, Nintendo 64 marked a shift to 3D gaming.
    *   PC Games:  Titles like Doom, Quake innovated FPS genre.

### Market Opportunities

*   Reboots targeting millennials who experienced these trends firsthand.
*   Interactive experiences leveraging retro aesthetics.

### Challenges

*   Balancing nostalgia with modern sensibilities.
*   Competition from existing properties and new IPs.

### Conclusion

The 1993-1998 era offers rich source material for revivals.  A data-informed approach is crucial for success.
`;

export default function MarketIntelligence() {
  return (
    <div>
      <HeroBanner/>

      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Market Intelligence</h2>
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <ReactMarkdown>{TREND_REPORT_MARKDOWN}</ReactMarkdown>
          <img
            src="https://via.placeholder.com/800x300"
            alt="Trend Visualization"
            className="mt-4 pixelated"
          />
        </div>
      </div>
    </div>
  );
}
