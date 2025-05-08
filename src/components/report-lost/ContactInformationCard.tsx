
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInformationCardProps {
  formData: {
    your_name: string;
    relation_with_lost: string;
    mobile_no: string;
    email_id: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactInformationCard: React.FC<ContactInformationCardProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
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
  );
};

export default ContactInformationCard;
