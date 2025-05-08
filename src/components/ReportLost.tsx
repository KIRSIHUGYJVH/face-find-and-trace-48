
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LostPersonResponse, reportLostPerson } from "@/services/api";
import { Loader2, Upload, Heart, Smile, Frown, Meh, Info, User, GenderMale, GenderFemale, MapPin, Building, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReportLostProps {
  userId: string;
}

const ReportLost: React.FC<ReportLostProps> = ({ userId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<LostPersonResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    where_lost: "",
    your_name: "",
    relation_with_lost: "",
    mobile_no: "",
    email_id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await reportLostPerson({
        ...formData,
        age: parseInt(formData.age),
        user_id: userId,
        file,
      });

      setResponse(data);
      toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit lost person report",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get emotion icon based on the emotion value
  const getEmotionIcon = (emotion: string | undefined) => {
    switch (emotion?.toLowerCase()) {
      case "happy":
        return <Smile className="text-green-500" />;
      case "sad":
        return <Frown className="text-blue-500" />;
      case "angry":
        return <Frown className="text-red-500" />;
      case "neutral":
        return <Meh className="text-gray-500" />;
      default:
        return <Meh className="text-gray-500" />;
    }
  };

  // Function to get gender icon
  const getGenderIcon = (gender: string) => {
    return gender.toLowerCase() === "female" ? 
      <GenderFemale className="text-pink-500" /> : 
      <GenderMale className="text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Report a Lost Person</h2>

      {!response ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Person Information</CardTitle>
              <CardDescription>Provide details about the lost person</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Person's Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="where_lost">Where Lost</Label>
                  <Input
                    id="where_lost"
                    name="where_lost"
                    value={formData.where_lost}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Provide your contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="your_name">Your Name</Label>
                  <Input
                    id="your_name"
                    name="your_name"
                    value={formData.your_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relation_with_lost">Relation with Lost Person</Label>
                  <Input
                    id="relation_with_lost"
                    name="relation_with_lost"
                    value={formData.relation_with_lost}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile_no">Mobile Number</Label>
                  <Input
                    id="mobile_no"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_id">Email</Label>
                  <Input
                    id="email_id"
                    name="email_id"
                    type="email"
                    value={formData.email_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photo Upload</CardTitle>
              <CardDescription>Upload a clear photo of the lost person</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="file">Select Photo</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-md overflow-hidden w-48 h-48">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Report Lost Person
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Report Submitted Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="mb-2 text-lg">{response.message}</p>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <span className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Case ID:
                  </span>
                  <span className="font-mono text-sm bg-gray-100 p-1 rounded mt-1 block overflow-auto">
                    {response.face_id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge 
                    variant={response.matched_found_count > 0 ? "default" : "outline"}
                    className={response.matched_found_count > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                  >
                    Found Matches: {response.matched_found_count}
                  </Badge>
                  <Badge 
                    variant={response.matched_live_count > 0 ? "default" : "outline"}
                    className={response.matched_live_count > 0 ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                  >
                    Live Feed Matches: {response.matched_live_count}
                  </Badge>
                </div>
              </div>
              
              {(response.matched_found_count > 0 || response.matched_live_count > 0) ? (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Matched Records
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {response.matched_records.map((match) => (
                      <Card key={match.match_id} className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <User className="h-5 w-5 text-primary" />
                              {match.matched_with.name || "Unknown"}
                            </CardTitle>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              Match
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-shrink-0">
                              <div className="relative w-full aspect-square max-w-[180px] overflow-hidden rounded-md mb-4 border-2 border-gray-200">
                                <img 
                                  src={`data:image/jpeg;base64,${match.matched_with.face_blob}`} 
                                  alt={match.matched_with.name} 
                                  className="w-full h-full object-cover"
                                />
                                {match.matched_with.emotion && (
                                  <div className="absolute bottom-0 right-0 bg-white/80 p-1 rounded-tl-md">
                                    {getEmotionIcon(match.matched_with.emotion)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-3 text-sm flex-grow">
                              <div className="grid gap-y-2">
                                <div className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Face ID:</span>
                                  <span className="truncate text-xs font-mono bg-gray-100 p-0.5 rounded" title={match.matched_with.face_id}>
                                    {match.matched_with.face_id.substring(0, 10)}...
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {getGenderIcon(match.matched_with.gender)}
                                  <span className="font-medium">Gender:</span>
                                  <span>{match.matched_with.gender}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Age:</span>
                                  <span>{match.matched_with.age}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-red-500" />
                                  <span className="font-medium">Where Found:</span>
                                  <span>{match.matched_with.where_found}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">Founder:</span>
                                  <span>{match.matched_with.your_name}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Organization:</span>
                                  <span>{match.matched_with.organization}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Designation:</span>
                                  <span>{match.matched_with.designation}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">Contact:</span>
                                  <span>{match.matched_with.mobile_no}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">Email:</span>
                                  <span className="truncate">{match.matched_with.email_id}</span>
                                </div>
                                
                                {match.matched_with.emotion && (
                                  <div className="flex items-center gap-2">
                                    {getEmotionIcon(match.matched_with.emotion)}
                                    <span className="font-medium">Emotion:</span>
                                    <span className="capitalize">{match.matched_with.emotion}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4 p-6 bg-gray-50 rounded-md border border-gray-200 text-center">
                  <Meh className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-center text-muted-foreground text-lg">No matches found for this person.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Button onClick={() => setResponse(null)} className="w-full">
            Report Another Person
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReportLost;
