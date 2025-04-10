
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bookmark, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showSearch, setShowSearch] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
    setShowSearch(false);
  };
  
  // Hide search on mobile when navigating
  useEffect(() => {
    return () => {
      if (isMobile) {
        setShowSearch(false);
      }
    };
  }, [isMobile, navigate]);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 pt-10">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                  Swift Headlines
                </Link>
                <nav className="flex flex-col gap-2">
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/">Home</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/bookmarks">Bookmarks</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={toggleTheme}>
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-1 font-bold text-lg">
            Swift Headlines
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/bookmarks">Bookmarks</Link>
          </Button>
        </nav>
        
        {/* Mobile & Desktop Actions */}
        <div className="flex items-center gap-1">
          {isMobile ? (
            <>
              {showSearch ? (
                <div className="absolute inset-x-0 top-0 bg-background z-50 p-3 border-b">
                  <SearchBar onSearch={handleSearch} />
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </>
          ) : (
            <div className="w-64 mr-2">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}
          
          <Button asChild variant="ghost" size="icon">
            <Link to="/bookmarks">
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">Bookmarks</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
