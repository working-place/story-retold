export interface AuthorInfo {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  className: string;
  school?: string;
  createdAt?: string;
}

export interface CardData {
  id: string;
  title: string;
  description: string;
  images: string[];
  author: AuthorInfo;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}

// Мок данные для разработки!!!
export const MOCK_CARD_DATA: CardData = {
  id: "card-001",
  title: "Награды и архивные материалы",
  description: "История героя Великой Отечественной войны",
  images: [
    '/image-test-1.png',
    '/image-test-2.png',
    '/image-test-3.png',
  ],
  author: {
    id: "author-001",
    firstName: "Иван",
    lastName: "Иванов",
    patronymic: "Иванович",
    className: "9А",
    school: "Школа №123",
    createdAt: "2024-01-15"
  },
  createdAt: "2024-01-15T10:30:00Z",
  tags: ["война", "герой", "награды"]
};
