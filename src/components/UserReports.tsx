
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getRecordsByUser, RecordItem } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, MapPin, Calendar, Fingerprint, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserReportsProps {
  userId: string;
}

const UserReports: React.FC<UserReportsProps> = ({ userId }) => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await getRecordsByUser(userId);
        setRecords(data.records);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch your reports",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [userId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No reports found</h3>
        <p className="text-muted-foreground">You haven't submitted any reports yet.</p>
      </div>
    );
  }

  const getFolderBadge = (folder: string) => {
    if (folder === "db/lost") {
      return <Badge className="bg-red-500 hover:bg-red-600">Lost</Badge>;
    }
    if (folder === "db/found") {
      return <Badge className="bg-green-500 hover:bg-green-600">Found</Badge>;
    }
    if (folder === "db/live_feed") {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Live Feed</Badge>;
    }
    return null;
  };

  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Reports</h2>
        <Badge variant="outline" className="text-sm py-1.5">
          Total: {records.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => {
          const metadata = record.metadata;
          const isLost = record.folder === "db/lost";
          const isFound = record.folder === "db/found";
          const isLiveFeed = record.folder === "db/live_feed";
          
          return (
            <Card 
              key={metadata.face_id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50"
            >
              <CardHeader className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {metadata.name || "Unknown"}
                  </CardTitle>
                  {getFolderBadge(record.folder)}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden relative">
                  {metadata.face_blob ? (
                    <img 
                      src={`data:image/jpeg;base64,${metadata.face_blob}`} 
                      alt={metadata.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>{getInitials(metadata.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  {metadata.emotion && (
                    <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full text-sm shadow-md border font-medium">
                      {metadata.emotion}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Fingerprint className="h-4 w-4 text-primary" />
                      <span className="font-medium text-xs text-gray-500">Face ID:</span>
                    </div>
                    <div className="font-mono text-xs bg-white p-1.5 rounded overflow-x-auto break-all max-h-10 overflow-y-auto">
                      {metadata.face_id}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <User className="h-4 w-4 text-gray-500" />
                      <div className="overflow-hidden">
                        <div className="text-xs text-gray-500">Gender</div>
                        <div className="truncate text-sm font-medium">{metadata.gender}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="overflow-hidden">
                        <div className="text-xs text-gray-500">Age</div>
                        <div className="truncate text-sm font-medium">{metadata.age}</div>
                      </div>
                    </div>
                  </div>

                  {(isLost && metadata.where_lost) && (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <div className="overflow-hidden">
                        <div className="text-xs text-gray-500">Lost at</div>
                        <div className="truncate text-sm font-medium">{metadata.where_lost}</div>
                      </div>
                    </div>
                  )}
                  
                  {(isFound || isLiveFeed) && metadata.where_found && (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <div className="overflow-hidden">
                        <div className="text-xs text-gray-500">Found at</div>
                        <div className="truncate text-sm font-medium">{metadata.where_found}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-3 bg-gray-50 border-t">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserReports;
