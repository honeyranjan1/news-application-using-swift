
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Article } from "@/types/news";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bookmark, BookmarkPlus, Download, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  isArticleBookmarked, 
  getBookmarkByArticleUrl, 
  saveBookmark, 
  removeBookmark, 
  saveArticleOffline,
  isArticleSavedOffline
} from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";

const ArticleDetail = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadArticle = async () => {
      if (!url) return;
      
      try {
        setIsLoading(true);
        
        const decodedUrl = decodeURIComponent(url);
        
        // Check if article is bookmarked
        const bookmarked = getBookmarkByArticleUrl(decodedUrl);
        if (bookmarked) {
          setArticle(bookmarked.article);
          setIsBookmarked(true);
          setIsSavedOffline(isArticleSavedOffline(decodedUrl));
          setIsLoading(false);
          return;
        }
        
        // TODO: In a real app, we would fetch the full article content here
        // For this demo, we're using placeholder content
        setArticle({
          source: { id: null, name: "News Source" },
          author: "Author Name",
          title: "Article Title",
          description: "Article description",
          url: decodedUrl,
          urlToImage: "https://source.unsplash.com/random/800x600?news",
          publishedAt: new Date().toISOString(),
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl."
        });
        
        setIsBookmarked(isArticleBookmarked(decodedUrl));
        setIsSavedOffline(isArticleSavedOffline(decodedUrl));
      } catch (error) {
        console.error("Error loading article:", error);
        toast({
          title: "Error",
          description: "Failed to load the article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [url, toast]);
  
  const handleBookmark = () => {
    if (!article) return;
    
    if (isBookmarked) {
      const bookmark = getBookmarkByArticleUrl(article.url);
      if (bookmark) {
        removeBookmark(bookmark.id);
        setIsBookmarked(false);
        toast({
          title: "Removed from bookmarks",
          description: "The article has been removed from your bookmarks",
        });
      }
    } else {
      saveBookmark(article);
      setIsBookmarked(true);
      toast({
        title: "Added to bookmarks",
        description: "The article has been added to your bookmarks",
      });
    }
  };
  
  const handleSaveOffline = () => {
    if (!article) return;
    
    saveArticleOffline(article);
    setIsSavedOffline(true);
    toast({
      title: "Saved for offline reading",
      description: "The article is now available offline",
    });
  };
  
  const handleShare = () => {
    if (!article) return;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description || "",
        url: article.url,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(article.url);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-6 max-w-screen-lg mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-muted rounded mb-4"></div>
          <div className="h-4 w-1/4 bg-muted rounded mb-8"></div>
          <div className="h-64 bg-muted rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="container py-6 max-w-screen-lg mx-auto">
        <div className="text-center py-10">
          <h1 className="text-xl font-bold mb-4">Article not found</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6 max-w-screen-lg mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <article>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-left">{article.title}</h1>
        
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-muted-foreground">
          <span>{article.source.name}</span>
          <span>•</span>
          {article.author && (
            <>
              <span>By {article.author}</span>
              <span>•</span>
            </>
          )}
          <span>
            {formatDistanceToNow(new Date(article.publishedAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            {isBookmarked ? (
              <>
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmarked
              </>
            ) : (
              <>
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Bookmark
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveOffline}
            disabled={isSavedOffline}
          >
            <Download className="mr-2 h-4 w-4" />
            {isSavedOffline ? "Saved offline" : "Save offline"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        
        {article.urlToImage && (
          <div className="mb-6">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full rounded-lg object-cover max-h-[400px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        )}
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="font-medium italic text-muted-foreground">
              {article.description}
            </p>
          </CardContent>
        </Card>
        
        <div className="article-content prose prose-lg dark:prose-invert max-w-none">
          <p>{article.content}</p>
          
          {/* In a real app, this would be the full article content */}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at luctus nibh, ut tincidunt eros. Integer vehicula sapien eu quam laoreet, at finibus quam tincidunt. Sed at consectetur erat, non tincidunt nibh. Etiam vitae est at magna finibus varius.
          </p>
          <p>
            Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.
          </p>
          <p>
            Proin malesuada, magna in imperdiet elementum, velit mi elementum dui, vel feugiat eros massa eget risus. Suspendisse facilisis odio vitae tellus aliquam, in rutrum augue semper. Donec id libero sed purus mattis euismod.
          </p>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Source: <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                {article.source.name}
              </a>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
