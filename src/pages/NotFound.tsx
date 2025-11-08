import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(350,60%,97%)] via-[hsl(345,45%,95%)] to-[hsl(35,60%,95%)] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-2 border-[hsl(345,35%,90%)] bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-[hsl(345,75%,70%)] fill-[hsl(345,75%,70%)]" />
          </div>
          <CardTitle className="font-handwriting text-4xl text-[hsl(340,40%,25%)] mb-2">
            עמוד לא נמצא
          </CardTitle>
          <CardDescription className="font-body text-base">
            אופס! העמוד הזה לא קיים, אבל מכתבי האהבה שלנו כן!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/">
            <Button className="w-full font-body bg-[hsl(345,75%,70%)] hover:bg-[hsl(345,75%,65%)] text-white">
              <Home className="ml-2 h-4 w-4" />
              חזרה למכתבי אהבה
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;


