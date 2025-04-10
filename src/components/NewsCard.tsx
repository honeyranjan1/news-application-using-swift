
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@/types/news";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, BookmarkPlus, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { isArticleBookmarked } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  article: Article;
  onBookmark?: (article: Article) => void;
}

const NewsCard = ({ article, onBookmark }: NewsCardProps) => {
  const isBookmarked = isArticleBookmarked(article.url);
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(article);
    }
  };
  
  return (
    <Link to={`/article/${encodeURIComponent(article.url)}`}>
      <Card className="news-card h-full overflow-hidden">
        {article.urlToImage && (
          <div className="h-48 overflow-hidden">
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="news-image"
              onError={(e) => {
                // Replace broken images with placeholder
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold line-clamp-2 text-left">
              {article.title}
            </CardTitle>
            <button 
              onClick={handleBookmarkClick}
              className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/5"
            >
              {isBookmarked ? (
                <Bookmark className="h-5 w-5" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
            </button>
          </div>
          <CardDescription className="text-sm text-left">
            {article.source.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-2">
          <p className={cn(
            "text-sm text-left line-clamp-3",
            article.description ? "" : "italic opacity-70"
          )}>
            {article.description || "No description available"}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {article.author && (
            <span className="truncate max-w-[60%] text-right">
              By {article.author}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NewsCard;
