
import { useEffect, useState } from "react";
import { fetchTopHeadlines } from "@/lib/api";
import { Article, NewsCategory } from "@/types/news";
import NewsList from "@/components/NewsList";
import CategoryTabs from "@/components/CategoryTabs";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [category, setCategory] = useState<NewsCategory>("general");
  
  const { 
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["news", category],
    queryFn: () => fetchTopHeadlines({ category }),
  });
  
  const handleCategoryChange = (newCategory: NewsCategory) => {
    setCategory(newCategory);
  };
  
  if (error) {
    console.error("Error fetching news:", error);
  }
  
  return (
    <div className="container py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <CategoryTabs 
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-left">
          {category === "general" 
            ? "Today's Top Stories" 
            : `${category.charAt(0).toUpperCase() + category.slice(1)} News`}
        </h1>
      </div>
      
      <NewsList 
        articles={data?.articles || []} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default Home;
