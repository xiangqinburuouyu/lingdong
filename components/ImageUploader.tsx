'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  multiple?: boolean;
  maxCount?: number;
  maxSize?: number; // MB
}

export default function ImageUploader({ 
  value, 
  onChange, 
  multiple = false, 
  maxCount = 1,
  maxSize = 5 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string[]>(value ? [value] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 检查文件数量
    if (!multiple && files.length > 1) {
      alert('只能上传一个文件');
      return;
    }

    if (multiple && preview.length + files.length > maxCount) {
      alert(`最多只能上传 ${maxCount} 个文件`);
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      
      Array.from(files).forEach(file => {
        // 检查文件大小
        if (file.size > maxSize * 1024 * 1024) {
          alert(`文件 ${file.name} 超过 ${maxSize}MB 限制`);
          return;
        }
        formDataUpload.append('files', file);
      });

      const url = multiple ? '/api/upload/batch' : '/api/upload';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        const urls = multiple 
          ? data.files.map((f: any) => f.url)
          : [data.url];
        
        const newPreview = multiple 
          ? [...preview, ...urls]
          : urls;
        
        setPreview(newPreview);
        onChange(multiple ? newPreview.join(',') : urls[0]);
        alert(multiple ? `成功上传 ${urls.length} 张图片` : '上传成功');
      } else {
        alert(data.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newPreview = preview.filter((_, i) => i !== index);
    setPreview(newPreview);
    onChange(multiple ? newPreview.join(',') : '');
  };

  return (
    <div className="space-y-4">
      {/* 预览区域 */}
      {preview.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {preview.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={url} 
                  alt={`预览 ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 上传按钮 */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || (multiple && preview.length >= maxCount)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mb-2"></div>
              <span className="text-sm text-gray-500">上传中...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">
                {multiple 
                  ? `点击上传图片（最多 ${maxCount} 张，单张最大 ${maxSize}MB）`
                  : `点击上传图片（最大 ${maxSize}MB）`
                }
              </span>
              <span className="text-xs text-gray-400 mt-1">
                支持格式：JPG, PNG, GIF, WebP
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
