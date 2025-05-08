
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { searchFaceById, RecordItem } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

const FaceSearch: React.FC = () => {
  const { toast } = useToast();
  const [faceId, setFaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecordItem[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faceId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Face ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await searchFaceById(faceId);
      setResults(data.records);
      setSearched(true);
      
      if (data.records.length === 0) {
        toast({
          title: "No results",
          description: "No records found for this Face ID",
        });
      } else {
        toast({
          title: "Success",
          description: `Found ${data.records.length} record(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for face",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Search by Face ID</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Face ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="face-id" className="sr-only">Face ID</Label>
              <Input
                id="face-id"
                placeholder="Enter Face ID"
                value={faceId}
                onChange={(e) => setFaceId(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            Search Results ({results.length})
          </h3>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result) => {
                const metadata = result.metadata;
                const isLost = result.folder === "db/lost";
                const isFound = result.folder === "db/found";
                const isLiveFeed = result.folder === "db/live_feed";
                
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
                            {metadata.face_id}
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
                        
                        <div className="grid grid-cols-2 gap-x-2">
                          <span className="font-medium">Reported by:</span>
                          <span>{metadata.your_name}</span>
                        </div>
                        
                        {isLost && metadata.relation_with_lost && (
                          <div className="grid grid-cols-2 gap-x-2">
                            <span className="font-medium">Relation:</span>
                            <span>{metadata.relation_with_lost}</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-x-2">
                          <span className="font-medium">Contact:</span>
                          <span>{metadata.mobile_no}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-2">
                          <span className="font-medium">Email:</span>
                          <span className="truncate">{metadata.email_id}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No records found for the provided Face ID.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceSearch;
