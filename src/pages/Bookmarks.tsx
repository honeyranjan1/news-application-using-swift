
import { useEffect, useState } from "react";
import { Bookmark } from "@/types/news";
import { getBookmarks, removeBookmark } from "@/lib/storage";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BookmarkX } from "lucide-react";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);
  
  const handleRemoveBookmark = (bookmark: Bookmark) => {
    removeBookmark(bookmark.id);
    setBookmarks(getBookmarks());
    toast({
      title: "Removed from bookmarks",
      description: "The article has been removed from your bookmarks",
    });
  };
  
  const clearAllBookmarks = () => {
    bookmarks.forEach(bookmark => removeBookmark(bookmark.id));
    setBookmarks([]);
    toast({
      title: "Bookmarks cleared",
      description: "All bookmarks have been removed",
    });
  };
  
  return (
    <div className="container py-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        
        {bookmarks.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllBookmarks}>
            <BookmarkX className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">You haven't bookmarked any articles yet</p>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Browse articles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <NewsCard 
              key={bookmark.id} 
              article={bookmark.article} 
              onBookmark={() => handleRemoveBookmark(bookmark)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
