
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCategory } from "@/types/news";
import { 
  Globe, 
  Briefcase, 
  Cpu, 
  Film, 
  Trophy, 
  Microscope, 
  Heart 
} from "lucide-react";

const categories: { value: NewsCategory; label: string; icon: React.ReactNode }[] = [
  { value: "general", label: "Top Stories", icon: <Globe className="h-4 w-4" /> },
  { value: "business", label: "Business", icon: <Briefcase className="h-4 w-4" /> },
  { value: "technology", label: "Tech", icon: <Cpu className="h-4 w-4" /> },
  { value: "entertainment", label: "Entertainment", icon: <Film className="h-4 w-4" /> },
  { value: "sports", label: "Sports", icon: <Trophy className="h-4 w-4" /> },
  { value: "science", label: "Science", icon: <Microscope className="h-4 w-4" /> },
  { value: "health", label: "Health", icon: <Heart className="h-4 w-4" /> },
];

interface CategoryTabsProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="w-full overflow-auto pb-2 no-scrollbar">
      <Tabs value={activeCategory} className="w-fit min-w-full" onValueChange={(value) => onCategoryChange(value as NewsCategory)}>
        <TabsList className="grid grid-flow-col auto-cols-max gap-2">
          {categories.map((category) => (
            <TabsTrigger
              key={category.value}
              value={category.value}
              className="flex items-center gap-1.5 px-3 py-2"
            >
              {category.icon}
              <span>{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
