"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import HugotBody from "./HugotBody";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp } from "lucide-react";
import People from "./People";

interface TrendingCategory {
  type: string;
  count: number;
}

export default function Component() {
  const [trendingCategories, setTrendingCategories] = useState<
    TrendingCategory[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchTrendingCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost/qouteNia/php/get_trending.php"
        );
        if (response.data.success) {
          setTrendingCategories(response.data.data);
        } else {
          console.error(
            "Error fetching trending categories:",
            response.data.error
          );
        }
      } catch (error) {
        console.error("Error fetching trending categories:", error);
      }
    };

    fetchTrendingCategories();
  }, []);

  const TrendingCategoriesContent = () => (
    <div className="flex flex-col h-screen">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center text-xl font-bold">
          <TrendingUp className="mr-2 h-5 w-5" />
          Trending Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden bg-secondary/50 p-4">
        <div
          className={`flex justify-between items-center mb-4 cursor-pointer rounded-md p-2 transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-background hover:bg-primary/10"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          <span className="font-semibold">Show All</span>
        </div>
        <ScrollArea className="h-[calc(100%-3rem)] w-full pr-4">
          <div className="space-y-2">
            {trendingCategories.map((category) => (
              <div
                key={category.type}
                className={`flex justify-between items-center cursor-pointer rounded-md p-2 transition-colors ${
                  selectedCategory === category.type
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-background hover:bg-primary/10"
                }`}
                onClick={() => setSelectedCategory(category.type)}
              >
                <span className="font-medium">{category.type}</span>
                <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardContent className="mt-4 border-t pt-4 bg-background">
        <People />
      </CardContent>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="md:col-span-1 h-[calc(100vh-5rem)] hidden md:flex flex-col shadow-lg overflow-hidden">
        <TrendingCategoriesContent />
      </Card>

      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4 shadow-sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending Categories
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <Card className="h-full rounded-none">
              <TrendingCategoriesContent />
            </Card>
          </SheetContent>
        </Sheet>
      </div>

      <div className="col-span-1 md:col-span-3">
        <HugotBody filterType={selectedCategory} />
      </div>
    </div>
  );
}
