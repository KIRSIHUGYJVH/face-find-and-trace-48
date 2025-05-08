
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LostPersonResponse, reportLostPerson } from "@/services/api";
import { Loader2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
          <Card>
            <CardHeader>
              <CardTitle>Report Submitted Successfully</CardTitle>
              <CardDescription>Case ID: {response.face_id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{response.message}</p>
              <div className="flex space-x-2 mb-4">
                <Badge variant="outline">Found Matches: {response.matched_found_count}</Badge>
                <Badge variant="outline">Live Feed Matches: {response.matched_live_count}</Badge>
              </div>
              
              {response.matched_records.length > 0 ? (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-4">Matched Records</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {response.matched_records.map((match) => (
                      <Card key={match.match_id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{match.matched_with.name || "Unknown"}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="aspect-square overflow-hidden rounded-md mb-4">
                            <img 
                              src={`data:image/jpeg;base64,${match.matched_with.face_blob}`} 
                              alt={match.matched_with.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Face ID:</span>
                              <span className="truncate text-xs" title={match.matched_with.face_id}>
                                {match.matched_with.face_id.substring(0, 12)}...
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Gender:</span>
                              <span>{match.matched_with.gender}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Age:</span>
                              <span>{match.matched_with.age}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Where Found:</span>
                              <span>{match.matched_with.where_found}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Founder Name:</span>
                              <span>{match.matched_with.your_name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Organization:</span>
                              <span>{match.matched_with.organization}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Designation:</span>
                              <span>{match.matched_with.designation}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Contact:</span>
                              <span>{match.matched_with.mobile_no}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <span className="font-medium">Email:</span>
                              <span className="truncate">{match.matched_with.email_id}</span>
                            </div>
                            {match.matched_with.emotion && (
                              <div className="grid grid-cols-2 gap-x-2">
                                <span className="font-medium">Emotion:</span>
                                <span>{match.matched_with.emotion}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <p>No matches found for this person.</p>
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
