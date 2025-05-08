
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getRecordsByUser, RecordItem } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
      <div className="text-center p-12">
        <h3 className="text-lg font-medium">No reports found</h3>
        <p className="text-muted-foreground">You haven't submitted any reports yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Your Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => {
          const metadata = record.metadata;
          const isLost = record.folder === "db/lost";
          const isFound = record.folder === "db/found";
          const isLiveFeed = record.folder === "db/live_feed";
          
          return (
            <Card key={metadata.face_id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{metadata.name}</CardTitle>
                  {isLost && <Badge className="bg-red-500">Lost</Badge>}
                  {isFound && <Badge className="bg-green-500">Found</Badge>}
                  {isLiveFeed && <Badge className="bg-blue-500">Live Feed</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-square overflow-hidden rounded-md mb-4">
                  <img 
                    src={`data:image/jpeg;base64,${metadata.face_blob}`} 
                    alt={metadata.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Gender:</span>
                    <span>{metadata.gender}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Age:</span>
                    <span>{metadata.age}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="font-medium">Face ID:</span>
                    <span className="truncate text-xs" title={metadata.face_id}>
                      {metadata.face_id.substring(0, 12)}...
                    </span>
                  </div>
                  {isLost && metadata.where_lost && (
                    <div className="grid grid-cols-2 gap-x-2">
                      <span className="font-medium">Lost at:</span>
                      <span>{metadata.where_lost}</span>
                    </div>
                  )}
                  {(isFound || isLiveFeed) && metadata.where_found && (
                    <div className="grid grid-cols-2 gap-x-2">
                      <span className="font-medium">Found at:</span>
                      <span>{metadata.where_found}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserReports;
