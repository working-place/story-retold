// ============ Auth DTOs ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseRaw {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Внутренний тип (после адаптации)
export interface LoginResponse {
  token: string;
}

export interface SendRestoreCodeRequest {
  email: string;
}

export interface RestorePasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordRequest {
  password: string;
  password_confirmation: string;
}

// ============ Card (Hero) DTOs ============

export type Chapter = 'svo' | 'gpw'; // gpw = Великая Отечественная война (USSR)
export type CardType = 'withPhoto' | 'withoutPhoto';

export interface AdditionalCardImage {
  image?: File;
  id?: number;      // For updates: existing image ID
  delete?: number;  // For updates: mark image ID for deletion
}

export interface CardCreateRequest {
  // Required
  dateBirth: string;           // YYYY-MM-DD
  placeBirth: string;
  name: string;
  nameAndClass: string;
  description: string;
  consent: '1';
  privacyPolicy: '1';
  chapter: Chapter;
  
  // Optional / nullable
  dateDeath?: string | null;
  email?: string;
  militaryRank?: string;
  placeService?: string;
  placeConscription?: string;
  cardType?: CardType;
  
  // Files
  photoHero?: File;
  additionalCardImages?: AdditionalCardImage[];
}

export interface CardUpdateRequest extends Partial<CardCreateRequest> {
  id: number;
  published?: 0 | 1;
  deleteImage?: 0 | 1;  // Delete main photo
}

export interface CardDeleteRequest {
  id: number;
}

export interface CardShowQueryParams {
  chapter?: Chapter;
  published?: boolean;
  perPage?: 25 | 50 | 100 | 250 | 500;
  page?: number;
}

// ============ Card Response DTOs ============

export interface CardImage {
  id: number;
  path: string;
  url: string;
}

export interface CardResponse {
  id: number;
  dateBirth: string;
  dateDeath: string | null;
  placeBirth: string;
  name: string;
  nameAndClass: string;
  email: string | null;
  description: string;
  militaryRank: string | null;
  placeService: string | null;
  placeConscription: string | null;
  chapter: Chapter;
  cardType: CardType;
  consent: boolean;
  privacyPolicy: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  photoHero: CardImage | null;
  additionalImages: CardImage[];
}

export interface CardShowResponse {
  data: CardResponse[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============ Email (Feedback) DTOs ============

export interface SendFeedbackRequest {
  email: string;
  subject: string;
  comment: string;
}

// ============ Generic Error Response ============

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}