
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchNews } from "@/lib/api";
import NewsList from "@/components/NewsList";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";
  
  const { 
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchNews(query),
    enabled: query.length > 0,
  });
  
  const handleSearch = (newQuery: string) => {
    if (newQuery) {
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    } else {
      navigate("/");
    }
  };
  
  if (error) {
    console.error("Error searching news:", error);
  }
  
  return (
    <div className="container py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar onSearch={handleSearch} initialQuery={query} />
        </div>
        
        <h1 className="text-2xl font-bold text-left mb-2">
          Search Results
        </h1>
        <p className="text-muted-foreground text-left">
          {data?.totalResults 
            ? `Found ${data.totalResults} results for "${query}"`
            : `Searching for "${query}"...`}
        </p>
      </div>
      
      <NewsList 
        articles={data?.articles || []} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default SearchResults;
