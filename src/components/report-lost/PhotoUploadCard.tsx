
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadCardProps {
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({
  previewUrl,
  handleFileChange,
}) => {
  return (
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
  );
};

export default PhotoUploadCard;
