'use client';

import {Button} from '@/components/ui/button';
import Link from 'next/link';

const HeroBanner = () => (
  <div className="relative bg-background py-10 md:py-20">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        Unlock the Nostalgia Goldmine
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Identify, analyze, and visualize the next big hit from the 90s
      </p>
      <Button asChild size="lg">
        <Link href="/property-library">Explore Properties</Link>
      </Button>
    </div>
  </div>
);

export default HeroBanner;
