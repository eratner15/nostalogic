
import {useEffect, useState} from 'react';
import {getProperty, Property, RebootType} from '@/services/property-data';
import {generateRemix} from '@/ai/flows/generate-remix';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const HeroBanner = () => (
  <div className="relative bg-background py-10 md:py-20">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        Unlock the Nostalgia Goldmine
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Identify, analyze, and visualize the next big hit from the 90s
      </p>
      {/* Removed Link Here */}
    </div>
  </div>
);

export default function RemixLab() {
  const [propertyIds, setPropertyIds] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rebootType, setRebootType] = useState<RebootType>('Movie');
  const [remixTitle, setRemixTitle] = useState('');
  const [remixPremise, setRemixPremise] = useState('');
  const [conceptBreakdowns, setConceptBreakdowns] = useState<
    { propertyId: string; conceptBreakdown: string }[]
  >([]);
  const [conceptImageUrl, setConceptImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      // For simplicity, load all properties.  In a real app, you'd want a selection list.
      // Also, this current implementation is not scalable if you have 1000+ properties
      // because we are loading all of them at once.  We'd want to implement pagination to address this.
      // But in the spirit of creating a prototype, we are loading all for now.
      // TODO: Fix implementation to load properties in batches and load properties in chunks.
      try {
        //TODO: Implement this by calling an API.  The API should ideally return a large number of properties
        const property: Property = await getProperty('1');
        setProperties([property]);

      } catch (e: any) {
        setError(e.message);
      }
    };

    loadProperties();
  }, []);

  const handleGenerateRemix = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateRemix({
        propertyIds: propertyIds,
        rebootType: rebootType,
      });

      setRemixTitle(result.remixTitle);
      setRemixPremise(result.remixPremise);
      setConceptBreakdowns(result.conceptBreakdowns);
      setConceptImageUrl(result.conceptImageUrl || null); // Handle undefined URL
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyIds(e.target.value.split(',').map((id) => id.trim()));
  };

  return (
    <div>
      <HeroBanner/>

      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Remix Lab</h2>

        <div className="flex flex-col gap-4 mb-4">
          <Input
            type="text"
            placeholder="Property IDs (comma-separated)"
            value={propertyIds.join(', ')}
            onChange={handlePropertyIdChange}
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

          <Button onClick={handleGenerateRemix} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Remix'}
          </Button>
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}

        {remixTitle && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground">Remix Title: {remixTitle}</h3>
            <p className="text-lg text-foreground mt-2">Premise: {remixPremise}</p>

            <h4 className="text-lg font-semibold text-foreground mt-4">Concept Breakdowns:</h4>
            <ul>
              {conceptBreakdowns.map((item) => (
                <li key={item.propertyId}>
                  Property ID: {item.propertyId} - {item.conceptBreakdown}
                </li>
              ))}
            </ul>

            {conceptImageUrl ? (
              <img
                src={conceptImageUrl}
                alt="Concept Image"
                className="mt-4 pixelated"
              />
            ) : (
              <p className="mt-4">No concept image generated.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
