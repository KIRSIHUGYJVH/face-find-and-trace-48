
import React, { useState } from "react";
import { LostPersonResponse, reportLostPerson } from "@/services/api";
import ReportForm from "./report-lost/ReportForm";
import ResultDisplay from "./report-lost/ResultDisplay";

interface ReportLostProps {
  userId: string;
}

const ReportLost: React.FC<ReportLostProps> = ({ userId }) => {
  const [response, setResponse] = useState<LostPersonResponse | null>(null);

  const handleSubmitSuccess = (data: LostPersonResponse) => {
    setResponse(data);
  };

  const handleReportAnother = () => {
    setResponse(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Report a Lost Person</h2>

      {!response ? (
        <ReportForm 
          userId={userId} 
          onSubmitSuccess={handleSubmitSuccess} 
        />
      ) : (
        <ResultDisplay 
          response={response} 
          onReportAnother={handleReportAnother} 
        />
      )}
    </div>
  );
};

export default ReportLost;
