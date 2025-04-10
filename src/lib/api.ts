
import { NewsCategory, NewsResponse } from "@/types/news";

// NewsAPI base URL and endpoints
const API_BASE_URL = "https://newsapi.org/v2";
const API_KEY = "YOUR_API_KEY"; // In production, use environment variables

export interface NewsApiOptions {
  country?: string;
  category?: NewsCategory;
  q?: string;
  pageSize?: number;
  page?: number;
}

export const fetchTopHeadlines = async (options: NewsApiOptions = {}): Promise<NewsResponse> => {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      country: options.country || "us",
      pageSize: (options.pageSize || 20).toString(),
      page: (options.page || 1).toString(),
      ...(options.category && { category: options.category }),
      ...(options.q && { q: options.q }),
    });

    // For development, use a mock response to avoid API limits
    if (process.env.NODE_ENV === "development") {
      return getMockNewsData(options.category);
    }

    const response = await fetch(`${API_BASE_URL}/top-headlines?${params}`);
    
    if (!response.ok) {
      throw new Error(`News API returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const searchNews = async (
  query: string,
  options: Omit<NewsApiOptions, 'q'> = {}
): Promise<NewsResponse> => {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      q: query,
      pageSize: (options.pageSize || 20).toString(),
      page: (options.page || 1).toString(),
    });

    // For development, use a mock response
    if (process.env.NODE_ENV === "development") {
      return getMockSearchData(query);
    }

    const response = await fetch(`${API_BASE_URL}/everything?${params}`);
    
    if (!response.ok) {
      throw new Error(`News API returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
};

// Mock data for development to avoid hitting API limits
const getMockNewsData = (category: NewsCategory = 'general'): NewsResponse => {
  const mockArticles = Array(10).fill(null).map((_, index) => ({
    source: { id: null, name: "Mock News Source" },
    author: "Mock Author",
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article ${index + 1}`,
    description: "This is a mock news article description for development purposes.",
    url: "https://example.com",
    urlToImage: `https://source.unsplash.com/random/800x600?${category}&sig=${index}`,
    publishedAt: new Date().toISOString(),
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl."
  }));

  return {
    status: "ok",
    totalResults: mockArticles.length,
    articles: mockArticles
  };
};

const getMockSearchData = (query: string): NewsResponse => {
  const mockArticles = Array(5).fill(null).map((_, index) => ({
    source: { id: null, name: "Mock Search Result" },
    author: "Search Author",
    title: `Search Result for "${query}" - Article ${index + 1}`,
    description: `This is a mock search result for "${query}".`,
    url: "https://example.com/search",
    urlToImage: `https://source.unsplash.com/random/800x600?${query}&sig=${index}`,
    publishedAt: new Date().toISOString(),
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Search term: ${query}.`
  }));

  return {
    status: "ok",
    totalResults: mockArticles.length,
    articles: mockArticles
  };
};
