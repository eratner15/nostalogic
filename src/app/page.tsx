'use client';

import {useEffect, useState} from 'react';
import {getProperty, getFeaturedProperties, Property} from '@/services/property-data';
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

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const featured = await getFeaturedProperties();
        setProperties(featured);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (loading) {
    return <p>Loading featured properties...</p>;
  }

  if (error) {
    return <p>Error loading featured properties: {error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-card rounded-lg shadow-md overflow-hidden">
            <Link href={`/analysis-tools?propertyId=${property.id}`}>
              <img
                src={property.thumbnailImageUrl}
                alt={property.name}
                className="w-full h-48 object-cover pixelated"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground">{property.name}</h3>
                <p className="text-muted-foreground">{property.briefDescription}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Revival Potential: {property.revivalPotentialScore}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <FeaturedProperties/>
    </div>
  );
}
