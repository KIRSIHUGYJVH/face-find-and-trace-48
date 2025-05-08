
const API_URL = "http://localhost:8000"; // Replace with your actual API URL

export interface LostPersonData {
  name: string;
  gender: string;
  age: number;
  where_lost: string;
  your_name: string;
  relation_with_lost: string;
  user_id: string;
  mobile_no: string;
  email_id: string;
  file: File;
}

export interface MatchedRecord {
  match_id: string;
  source: any;
  matched_with: {
    face_id: string;
    name: string;
    gender: string;
    age: number;
    where_found: string;
    your_name: string;
    organization: string;
    designation: string;
    user_id: string;
    mobile_no: string;
    email_id: string;
    face_blob: string;
    face_path: string;
    emotion?: string;
  };
  face_path: string;
}

export interface RecordItem {
  folder: string;
  metadata: {
    face_id: string;
    name: string;
    gender: string;
    age: number;
    where_lost?: string;
    where_found?: string;
    your_name: string;
    relation_with_lost?: string;
    organization?: string;
    designation?: string;
    user_id: string;
    mobile_no: string;
    email_id: string;
    face_blob: string;
    face_path: string;
    emotion?: string;
  };
}

export interface RecordsResponse {
  message: string;
  records: RecordItem[];
}

export interface LostPersonResponse {
  message: string;
  face_id: string;
  matched_found_count: number;
  matched_live_count: number;
  matched_records: MatchedRecord[];
}

export interface FaceSearchResponse {
  message: string;
  records: RecordItem[];
}

export const getRecordsByUser = async (userId: string): Promise<RecordsResponse> => {
  const response = await fetch(`${API_URL}/get_records_by_user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch records");
  }
  return response.json();
};

export const reportLostPerson = async (data: LostPersonData): Promise<LostPersonResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(`${API_URL}/upload_lost`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit lost person report");
  }

  return response.json();
};

export const searchFaceById = async (faceId: string): Promise<FaceSearchResponse> => {
  const response = await fetch(`${API_URL}/search_face/${faceId}`);
  if (!response.ok) {
    throw new Error("Failed to search for face");
  }
  return response.json();
};
