/**
 * Represents a property with basic details.
 */
export interface Property {
  /**
   * The unique identifier of the property.
   */
id: string;
  /**
   * The name of the property.
   */
  name: string;
  /**
   * The URL of the thumbnail image.
   */
  thumbnailImageUrl: string;
  /**
   * A brief description of the property.
   */
  briefDescription: string;
  /**
   * A placeholder score indicating the revival potential.
   */
  revivalPotentialScore: number;
  /**
   * The category of the property.
   */
  category: string;
    /**
   * The peak of the property.
   */
  peak: string;
      /**
   * The years of the property.
   */
  years: string;
        /**
   * The weeks of the property.
   */
  weeks: string;
              /**
   * The rank of the property.
   */
  rank: number;
}

export type RebootType = "Movie" | "TV Show" | "Video Game" | "Toys";

/**
 * Asynchronously retrieves property data by ID.
 *
 * @param id The ID of the property to retrieve.
 * @returns A promise that resolves to a Property object.
 */
export async function getProperty(id: string): Promise<Property> {
  // TODO: Implement this by calling an API.
  return {
    id: id,
    name: 'Example Property',
    thumbnailImageUrl: 'https://example.com/thumbnail.jpg',
    briefDescription: 'This is an example property.',
    revivalPotentialScore: 0.85,
    category: 'Movie',
    peak: 'High',
    years: '1995',
    weeks: '12',
    rank: 1
  };
}

/**
 * Asynchronously retrieves a list of featured properties.
 *
 * @returns A promise that resolves to an array of Property objects.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  // TODO: Implement this by calling an API.
  return [
    {
      id: '1',
      name: 'Property One',
      thumbnailImageUrl: 'https://example.com/thumbnail1.jpg',
      briefDescription: 'Description for property one.',
      revivalPotentialScore: 0.9,
      category: 'TV Show',
      peak: 'High',
      years: '1996',
      weeks: '10',
      rank: 2
    },
    {
      id: '2',
      name: 'Property Two',
      thumbnailImageUrl: 'https://example.com/thumbnail2.jpg',
      briefDescription: 'Description for property two.',
      revivalPotentialScore: 0.75,
      category: 'Video Game',
      peak: 'Medium',
      years: '1994',
      weeks: '8',
      rank: 3
    },
  ];
}

/**
 * Asynchronously retrieves a list of properties with pagination, sorting, and filtering.
 *
 * @param page The page number to retrieve.
 * @param pageSize The number of properties per page.
 * @param sortBy The field to sort by.
 * @param sortOrder The sort order ('asc' or 'desc').
 * @param filters An object containing filters for category, years, and genres.
 * @returns A promise that resolves to an array of Property objects.
 */
export async function getProperties(
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  filters: {
    category?: string;
    years?: string;
  }
): Promise<Property[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      id: '3',
      name: 'Filtered Property',
      thumbnailImageUrl: 'https://example.com/thumbnail3.jpg',
      briefDescription: 'Description for a filtered property.',
      revivalPotentialScore: 0.8,
      category: 'Movie',
      peak: 'Low',
      years: '1997',
      weeks: '6',
      rank: 4
    },
  ];
}
