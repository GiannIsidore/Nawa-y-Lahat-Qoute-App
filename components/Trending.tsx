"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface TrendingCategory {
  type: string;
  count: number;
}

const Trending = () => {
  const [trendingCategories, setTrendingCategories] = useState<
    TrendingCategory[]
  >([]);

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

  return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4">
        <h3 className="text-lg font-bold">Trending Categories</h3>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[200px] w-full pr-4 border rounded-md p-4">
          {trendingCategories.map((category) => (
            <div
              key={category.type}
              className="flex justify-between items-center mb-2"
            >
              <span className="font-bold">{category.type}</span>
              <span className="text-muted-foreground">
                {category.count} posts
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Trending;
