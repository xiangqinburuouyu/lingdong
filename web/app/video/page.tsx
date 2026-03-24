'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Video {
  id: number;
  title: string;
  duration: string;
  views: number;
  publishTime: string;
  thumbnail: string;
  category: string;
}

const mockVideos: Video[] = [
  {
    id: 1,
    title: '重大突破！国产 T1000 碳纤维，实现规模化量产！',
    duration: '02:57',
    views: 125000,
    publishTime: '2 小时前',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    category: '硬科技',
  },
  {
    id: 2,
    title: '山姆搞成现在这样，是因为阿里前高管吗？',
    duration: '08:27',
    views: 89000,
    publishTime: '5 小时前',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    category: '商业',
  },
  {
    id: 3,
    title: 'AI 芯片大战：Nvidia、AMD、Google 的三国杀',
    duration: '12:35',
    views: 230000,
    publishTime: '1 天前',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    category: 'AGI',
  },
  {
    id: 4,
    title: '探访宇树科技：人形机器人如何走进千家万户？',
    duration: '15:20',
    views: 180000,
    publishTime: '2 天前',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    category: '机器人',
  },
  {
    id: 5,
    title: '2026 年投资策略：这五个赛道值得关注',
    duration: '20:15',
    views: 95000,
    publishTime: '3 天前',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    category: '财经',
  },
  {
    id: 6,
    title: '深度解析：特斯拉 FSD 入华的影响',
    duration: '18:40',
    views: 156000,
    publishTime: '4 天前',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    category: '汽车',
  },
];

const categories = ['全部', 'AGI', '硬科技', '商业', '机器人', '汽车', '财经', '3C'];

export default function VideoPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [videos] = useState<Video[]>(mockVideos);

  const filteredVideos = selectedCategory === '全部'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">视频</h1>
          <p className="text-gray-600">深度视频内容，解读科技与商业</p>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 视频网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            该分类下暂无视频
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* 封面图 */}
        <div className="relative aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* 时长标签 */}
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
          {/* 播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 信息 */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{video.views.toLocaleString()} 次播放</span>
            <span>{video.publishTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
