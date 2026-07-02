// Mock data layer — will be replaced by Express/MongoDB API calls in later phases.
export const rooms = [
  {
    id: 1,
    name: 'Deluxe Garden Room',
    type: 'Deluxe',
    price: 8500,
    capacity: 2,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Garden View', 'Breakfast Included'],
    description:
      'A spacious room overlooking the garden courtyard, perfect for couples seeking a quiet, comfortable stay.'
  },
  {
    id: 2,
    name: 'Executive Suite',
    type: 'Suite',
    price: 15500,
    capacity: 3,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Mini Bar', 'City View', 'Work Desk', 'Breakfast Included'],
    description:
      'Premium suite with a separate living area, ideal for business travelers and small families.'
  },
  {
    id: 3,
    name: 'Standard Twin Room',
    type: 'Standard',
    price: 5200,
    capacity: 2,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Twin Beds'],
    description: 'A cozy and affordable room with two single beds, great for friends or colleagues.'
  },
  {
    id: 4,
    name: 'Family Room',
    type: 'Family',
    price: 12000,
    capacity: 4,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Two Queen Beds', 'Breakfast Included'],
    description: 'Generously sized room designed to comfortably host families with children.'
  },
  {
    id: 5,
    name: 'Presidential Suite',
    type: 'Suite',
    price: 28000,
    capacity: 4,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Private Balcony', 'Jacuzzi', 'Butler Service', 'Breakfast Included'],
    description: 'Our most luxurious offering, featuring panoramic views and dedicated concierge service.'
  },
  {
    id: 6,
    name: 'Budget Single Room',
    type: 'Standard',
    price: 3200,
    capacity: 1,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning'],
    description: 'A compact, no-frills room for solo travelers on a budget.'
  }
]

export function getRoomById(id) {
  return rooms.find((room) => room.id === Number(id))
}
