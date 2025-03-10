export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  category: string;
  readTime: number;
  image?: string;
  featured?: boolean;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Decentralized Finance',
    excerpt: 'How DeFi is reshaping the global financial landscape and what it means for traditional banking systems.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
    author: {
      name: 'Alex Morgan',
      avatar: '/avatars/alex.jpg'
    },
    publishedAt: '2023-10-15',
    category: 'Finance',
    readTime: 8,
    image: '/images/defi.jpg',
    featured: true,
    tags: ['DeFi', 'Blockchain', 'Finance']
  },
  {
    id: '2',
    title: 'AI Governance: The New Frontier',
    excerpt: 'As artificial intelligence becomes more powerful, how should we approach regulation and ethical frameworks?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg'
    },
    publishedAt: '2023-10-12',
    category: 'Technology',
    readTime: 6,
    image: '/images/ai-governance.jpg',
    tags: ['AI', 'Ethics', 'Technology']
  },
  {
    id: '3',
    title: 'The New Space Race: Private Companies Take the Lead',
    excerpt: 'How SpaceX, Blue Origin, and other private companies are redefining space exploration and commercialization.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
    author: {
      name: 'Michael Torres',
      avatar: '/avatars/michael.jpg'
    },
    publishedAt: '2023-10-08',
    category: 'Space',
    readTime: 10,
    image: '/images/space-race.jpg',
    featured: true,
    tags: ['Space', 'Innovation', 'Technology']
  },
  {
    id: '4',
    title: 'Synthetic Biology: Engineering the Future of Life',
    excerpt: 'The latest breakthroughs in synthetic biology and their implications for medicine, agriculture, and beyond.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
    author: {
      name: 'Emily Johnson',
      avatar: '/avatars/emily.jpg'
    },
    publishedAt: '2023-10-05',
    category: 'Science',
    readTime: 7,
    image: '/images/synthetic-biology.jpg',
    tags: ['Biology', 'Science', 'Medicine']
  },
  {
    id: '5',
    title: 'The Metaverse Economy: Virtual Real Estate and Digital Assets',
    excerpt: 'Exploring the emerging economy within virtual worlds and how digital assets are becoming increasingly valuable.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
    author: {
      name: 'David Kim',
      avatar: '/avatars/david.jpg'
    },
    publishedAt: '2023-10-01',
    category: 'Technology',
    readTime: 9,
    image: '/images/metaverse.jpg',
    tags: ['Metaverse', 'NFTs', 'Digital Assets']
  }
]; 