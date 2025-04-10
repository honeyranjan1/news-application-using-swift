
import { Article, Bookmark } from "@/types/news";

// LocalStorage keys
const BOOKMARKS_KEY = "news_app_bookmarks";
const OFFLINE_ARTICLES_KEY = "news_app_offline_articles";

// Bookmark management
export const getBookmarks = (): Bookmark[] => {
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBookmark = (article: Article): Bookmark => {
  const bookmarks = getBookmarks();
  const id = `bookmark-${Date.now()}`;
  
  const newBookmark: Bookmark = {
    id,
    article,
    savedAt: new Date().toISOString()
  };
  
  const updatedBookmarks = [newBookmark, ...bookmarks];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  
  return newBookmark;
};

export const removeBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
};

export const isArticleBookmarked = (articleUrl: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(bookmark => bookmark.article.url === articleUrl);
};

export const getBookmarkByArticleUrl = (articleUrl: string): Bookmark | undefined => {
  const bookmarks = getBookmarks();
  return bookmarks.find(bookmark => bookmark.article.url === articleUrl);
};

// Offline articles management
export const saveArticleOffline = (article: Article): void => {
  const offlineArticles = getOfflineArticles();
  
  // Check if article already exists
  if (!offlineArticles.some(a => a.url === article.url)) {
    offlineArticles.push(article);
    localStorage.setItem(OFFLINE_ARTICLES_KEY, JSON.stringify(offlineArticles));
  }
};

export const getOfflineArticles = (): Article[] => {
  const stored = localStorage.getItem(OFFLINE_ARTICLES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const removeOfflineArticle = (articleUrl: string): void => {
  const offlineArticles = getOfflineArticles();
  const filteredArticles = offlineArticles.filter(article => article.url !== articleUrl);
  localStorage.setItem(OFFLINE_ARTICLES_KEY, JSON.stringify(filteredArticles));
};

export const isArticleSavedOffline = (articleUrl: string): boolean => {
  const offlineArticles = getOfflineArticles();
  return offlineArticles.some(article => article.url === articleUrl);
};
