
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { searchFaceById, RecordItem } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Search, User, MapPin, Building, Phone, Mail, Fingerprint, Calendar,
  AlertCircle, FileSearch, Clock, UserCheck, CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

  const getFolderBadge = (folder: string) => {
    if (folder === "db/lost") {
      return <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> Lost
      </Badge>;
    }
    if (folder === "db/found") {
      return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" /> Found
      </Badge>;
    }
    if (folder === "db/live_feed") {
      return <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
        <Clock className="h-3 w-3" /> Live Feed
      </Badge>;
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
      <h2 className="text-xl font-bold mb-4">Search by Face ID</h2>
      
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            Enter Face ID
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
            <Button type="submit" disabled={loading} className="md:w-auto">
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Results
              <Badge variant="outline" className="ml-2">
                {results.length} found
              </Badge>
            </h3>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {results.map((result) => {
                const metadata = result.metadata;
                const isLost = result.folder === "db/lost";
                const isFound = result.folder === "db/found";
                const isLiveFeed = result.folder === "db/live_feed";
                
                return (
                  <Card key={metadata.face_id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    <CardHeader className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          {metadata.name || "Unknown"}
                        </CardTitle>
                        {getFolderBadge(result.folder)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="aspect-square relative">
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
                        
                        <div className="md:col-span-2 p-6 space-y-4">
                          <div className="bg-gray-50 p-3 rounded-md border text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Fingerprint className="h-4 w-4 text-primary" />
                              <span className="font-medium">Face ID:</span>
                            </div>
                            <div className="font-mono text-xs bg-white p-2 rounded overflow-x-auto break-all">
                              {metadata.face_id}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500 font-medium">Gender & Age</div>
                                  <div className="flex items-center gap-3">
                                    <span className="capitalize">{metadata.gender}</span>
                                    <span className="w-0.5 h-4 bg-gray-300"></span>
                                    <span>{metadata.age} years</span>
                                  </div>
                                </div>
                              </div>
                              
                              {isLost && metadata.where_lost && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                                  <div>
                                    <div className="text-sm text-gray-500 font-medium">Lost at</div>
                                    <div className="break-words">{metadata.where_lost}</div>
                                  </div>
                                </div>
                              )}
                              
                              {(isFound || isLiveFeed) && metadata.where_found && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <div className="text-sm text-gray-500 font-medium">Found at</div>
                                    <div className="break-words">{metadata.where_found}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <UserCheck className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500 font-medium">Reported by</div>
                                  <div className="break-words">{metadata.your_name}</div>
                                </div>
                              </div>
                              
                              {isLost && metadata.relation_with_lost && (
                                <div className="flex items-start gap-3">
                                  <User className="h-5 w-5 text-purple-500 mt-0.5" />
                                  <div>
                                    <div className="text-sm text-gray-500 font-medium">Relation</div>
                                    <div className="break-words">{metadata.relation_with_lost}</div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500 font-medium">Contact</div>
                                  <div className="break-all">{metadata.mobile_no}</div>
                                  <div className="break-all">{metadata.email_id}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {(metadata.organization || metadata.designation) && (
                            <>
                              <Separator />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {metadata.organization && (
                                  <div className="flex items-start gap-3">
                                    <Building className="h-5 w-5 text-gray-600 mt-0.5" />
                                    <div>
                                      <div className="text-sm text-gray-500 font-medium">Organization</div>
                                      <div className="break-words">{metadata.organization}</div>
                                    </div>
                                  </div>
                                )}
                                
                                {metadata.designation && (
                                  <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-600 mt-0.5" />
                                    <div>
                                      <div className="text-sm text-gray-500 font-medium">Designation</div>
                                      <div className="break-words">{metadata.designation}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 bg-gray-50 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No records found</p>
                <p className="text-muted-foreground">No records found for the provided Face ID.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceSearch;
