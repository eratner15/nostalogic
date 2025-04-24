'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {getProperty, Property} from '@/services/property-data';
import {analyzeProperty} from '@/ai/flows/analyze-property';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
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

export default function AnalysisTools() {
  const searchParams = useSearchParams();
  const propertyIdFromURL = searchParams.get('propertyId');

  const [propertyId, setPropertyId] = useState(propertyIdFromURL || '');
  const [property, setProperty] = useState<Property | null>(null);
  const [rebootType, setRebootType] = useState('Movie');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      const loadProperty = async () => {
        try {
          const fetchedProperty = await getProperty(propertyId);
          setProperty(fetchedProperty);
        } catch (e: any) {
          setError(e.message);
        }
      };

      loadProperty();
    }
  }, [propertyId]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeProperty({
        propertyId: propertyId,
        rebootType: rebootType,
      });
      setAnalysis(result.analysis);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeroBanner/>

      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Analysis Tools</h2>

        <div className="flex flex-col gap-4 mb-4">
          <Input
            type="text"
            placeholder="Property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />

          <Select onValueChange={setRebootType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Reboot Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Movie">Movie</SelectItem>
              <SelectItem value="TV Show">TV Show</SelectItem>
              <SelectItem value="Video Game">Video Game</SelectItem>
              <SelectItem value="Toys">Toys</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleAnalyze} disabled={loading || !propertyId}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}

        {analysis && (
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
            <img
              src="https://via.placeholder.com/600x200"
              alt="Placeholder Chart"
              className="mt-4 pixelated"
            />
          </div>
        )}
      </div>
    </div>
  );
}
