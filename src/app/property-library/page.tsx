
import {useEffect, useState} from 'react';
import {getProperty, getProperties, Property} from '@/services/property-data';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

export default function PropertyLibrary() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearsFilter, setYearsFilter] = useState('');

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const fetchedProperties = await getProperties(
          page,
          pageSize,
          sortBy,
          sortOrder,
          {
            category: categoryFilter,
            years: yearsFilter,
          }
        );
        setProperties(fetchedProperties);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    loadProperties();
  }, [page, pageSize, sortBy, sortOrder, categoryFilter, yearsFilter]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return <p>Loading properties...</p>;
  }

  if (error) {
    return <p>Error loading properties: {error}</p>;
  }

  return (
    <div>
      <HeroBanner/>

      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Property Library</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <Select onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Movie">Movie</SelectItem>
              <SelectItem value="TV Show">TV Show</SelectItem>
              <SelectItem value="Video Game">Video Game</SelectItem>
              <SelectItem value="Toys">Toys</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Trends">Trends</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Filter by Year"
            value={yearsFilter}
            onChange={(e) => setYearsFilter(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('rank')}>
                  Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('category')}>
                  Category {sortBy === 'category' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('years')}>
                  Years {sortBy === 'years' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('peak')}>
                  Peak {sortBy === 'peak' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('weeks')}>
                  Weeks {sortBy === 'weeks' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.rank}</TableCell>
                  <TableCell>
                    <img
                      src={property.thumbnailImageUrl}
                      alt={property.name}
                      className="w-20 h-16 object-cover pixelated"
                    />
                  </TableCell>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.category}</TableCell>
                  <TableCell>{property.years}</TableCell>
                  <TableCell>{property.peak}</TableCell>
                  <TableCell>{property.weeks}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link href={`/analysis-tools?propertyId=${property.id}`}>Analyze</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            variant="outline"
          >
            Previous Page
          </Button>
          <span>Page {page}</span>
          <Button
            onClick={() => setPage(page + 1)}
            variant="outline"
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
