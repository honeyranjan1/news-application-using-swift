
import { useState } from "react";
import { Article } from "@/types/news";
import NewsCard from "./NewsCard";
import { saveBookmark, removeBookmark, getBookmarkByArticleUrl } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";

interface NewsListProps {
  articles: Article[];
  isLoading?: boolean;
}

const NewsList = ({ articles, isLoading = false }: NewsListProps) => {
  const { toast } = useToast();
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Record<string, boolean>>({});
  
  const handleBookmark = (article: Article) => {
    const isCurrentlyBookmarked = getBookmarkByArticleUrl(article.url);
    
    if (isCurrentlyBookmarked) {
      removeBookmark(isCurrentlyBookmarked.id);
      setBookmarkedArticles(prev => ({ ...prev, [article.url]: false }));
      toast({
        title: "Removed from bookmarks",
        description: "The article has been removed from your bookmarks",
      });
    } else {
      saveBookmark(article);
      setBookmarkedArticles(prev => ({ ...prev, [article.url]: true }));
      toast({
        title: "Added to bookmarks",
        description: "The article has been added to your bookmarks",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, idx) => (
          <div key={idx} className="h-[400px] rounded-lg animate-pulse bg-muted"></div>
        ))}
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, idx) => (
        <NewsCard 
          key={`${article.url}-${idx}`} 
          article={article} 
          onBookmark={handleBookmark} 
        />
      ))}
    </div>
  );
};

export default NewsList;
