import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FORUM_CATEGORIES,
  INITIAL_FORUM_POSTS,
  INITIAL_FORUM_COMMENTS,
  ForumCategoryMeta,
} from '../../data/forumData';
import { ForumPost, ForumComment } from '../../types';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Pin,
  Tag,
  ArrowUpDown,
  Send,
  X,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  User,
  Clock,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { db, auth } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from 'firebase/firestore';

export const ForumView: React.FC = () => {
  const { user, firebaseUser, addXP } = useApp();

  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('unilevelup:forum:posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FORUM_POSTS;
      }
    }
    return INITIAL_FORUM_POSTS;
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, ForumComment[]>>(() => {
    const saved = localStorage.getItem('unilevelup:forum:comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FORUM_COMMENTS;
      }
    }
    return INITIAL_FORUM_COMMENTS;
  });

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'comments'>('newest');

  // Modals
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('tips');
  const [newTags, setNewTags] = useState<string>('Sinh viên, Kinh nghiệm');

  // New Comment Form State
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('unilevelup:forum:posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('unilevelup:forum:comments', JSON.stringify(commentsMap));
  }, [commentsMap]);

  // Load from Firestore if available
  useEffect(() => {
    const fetchRemotePosts = async () => {
      try {
        const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteList: ForumPost[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteList.push({
              id: docSnap.id,
              authorId: data.authorId || 'anon',
              authorName: data.authorName || 'Sinh viên',
              authorAvatar: data.authorAvatar || '🎓',
              title: data.title || '',
              content: data.content || '',
              category: data.category || 'tips',
              tags: data.tags || [],
              likes: data.likes || 0,
              likedBy: data.likedBy || [],
              commentCount: data.commentCount || 0,
              createdAt: data.createdAtStr || 'Gần đây',
              pinned: data.pinned || false,
            });
          });
          // Merge with initial if needed
          setPosts((prev) => {
            const existingIds = new Set(remoteList.map((r) => r.id));
            const remain = prev.filter((p) => !existingIds.has(p.id));
            return [...remoteList, ...remain];
          });
        }
      } catch {
        // Fallback gracefully to local
      }
    };
    fetchRemotePosts();
  }, []);

  // Filter & Sort Logic
  const filteredPosts = posts
    .filter((post) => {
      const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === 'likes') return b.likes - a.likes;
      if (sortBy === 'comments') return b.commentCount - a.commentCount;
      return 0; // Default order
    });

  // Toggle Like on Post
  const handleToggleLike = async (post: ForumPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playReaction();

    const myId = firebaseUser?.uid || 'local-user';
    const isLiked = post.likedBy?.includes(myId);

    const updatedLikes = isLiked ? post.likes - 1 : post.likes + 1;
    const updatedLikedBy = isLiked
      ? (post.likedBy || []).filter((id) => id !== myId)
      : [...(post.likedBy || []), myId];

    const updatedPost = {
      ...post,
      likes: Math.max(0, updatedLikes),
      likedBy: updatedLikedBy,
    };

    setPosts((prev) => prev.map((p) => (p.id === post.id ? updatedPost : p)));
    if (activePost?.id === post.id) {
      setActivePost(updatedPost);
    }

    // Try update Firestore
    try {
      const postRef = doc(db, 'forum_posts', post.id);
      await updateDoc(postRef, {
        likes: updatedPost.likes,
        likedBy: updatedLikedBy,
      });
    } catch {
      // Local fallback handled
    }
  };

  // Submit New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    sound.playSuccess();
    const tagList = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const authorDisplayName = firebaseUser?.displayName || user.name || 'Sinh viên UniLevelUp';
    const authorAvatar = firebaseUser ? '🧑‍🎓' : '🎓';

    const newPostItem: ForumPost = {
      id: 'post-' + Date.now(),
      authorId: firebaseUser?.uid || 'local-user',
      authorName: authorDisplayName,
      authorAvatar: authorAvatar,
      authorEmail: firebaseUser?.email || undefined,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      tags: tagList.length > 0 ? tagList : ['Sinh viên'],
      likes: 1,
      likedBy: [firebaseUser?.uid || 'local-user'],
      commentCount: 0,
      createdAt: 'Vừa xong',
      pinned: false,
    };

    setPosts((prev) => [newPostItem, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');

    // Confetti & XP reward
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    addXP(50, 'Đăng bài viết chia sẻ kinh nghiệm trên diễn đàn');

    // Firestore remote save
    try {
      if (firebaseUser) {
        await addDoc(collection(db, 'forum_posts'), {
          authorId: firebaseUser.uid,
          authorName: authorDisplayName,
          authorAvatar: authorAvatar,
          authorEmail: firebaseUser.email,
          title: newPostItem.title,
          content: newPostItem.content,
          category: newPostItem.category,
          tags: newPostItem.tags,
          likes: 1,
          likedBy: [firebaseUser.uid],
          commentCount: 0,
          createdAt: serverTimestamp(),
          createdAtStr: 'Vừa xong',
          pinned: false,
        });
      }
    } catch {
      // Offline fallback
    }
  };

  // Submit New Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !newCommentText.trim()) return;

    sound.playSuccess();
    const authorDisplayName = firebaseUser?.displayName || user.name || 'Bạn';
    const authorAvatar = firebaseUser ? '🧑‍🎓' : '🎓';

    const newCommentItem: ForumComment = {
      id: 'c-' + Date.now(),
      postId: activePost.id,
      authorId: firebaseUser?.uid || 'local-user',
      authorName: authorDisplayName,
      authorAvatar: authorAvatar,
      content: newCommentText.trim(),
      createdAt: 'Vừa xong',
      likes: 0,
    };

    const currentComments = commentsMap[activePost.id] || [];
    const updatedComments = [...currentComments, newCommentItem];

    setCommentsMap((prev) => ({
      ...prev,
      [activePost.id]: updatedComments,
    }));

    // Update comment count on post
    const updatedPost = {
      ...activePost,
      commentCount: activePost.commentCount + 1,
    };
    setActivePost(updatedPost);
    setPosts((prev) => prev.map((p) => (p.id === activePost.id ? updatedPost : p)));

    setNewCommentText('');
    addXP(15, 'Bình luận thảo luận trên diễn đàn sinh viên');

    // Firestore remote save
    try {
      if (firebaseUser) {
        await addDoc(collection(db, 'forum_comments'), {
          postId: activePost.id,
          authorId: firebaseUser.uid,
          authorName: authorDisplayName,
          authorAvatar: authorAvatar,
          content: newCommentItem.content,
          createdAt: serverTimestamp(),
          createdAtStr: 'Vừa xong',
          likes: 0,
        });
        const postRef = doc(db, 'forum_posts', activePost.id);
        await updateDoc(postRef, {
          commentCount: increment(1),
        });
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#14112E] text-[#F5F3FF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#201642] via-[#2F1C4E] to-[#1C163A] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D8D]/20 via-[#6C4DFF]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF4D8D] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cộng Đồng Học Tập UniLevelUp</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Diễn Đàn Sinh Viên Việt Nam
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Nơi chia sẻ kinh nghiệm kéo GPA, bí kíp sinh tồn đại học, review môn học và kết nối bạn bè cùng tiến. Học thông minh hơn nhờ kinh nghiệm từ những người đi trước!
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCreateModal(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4D8D] to-[#6C4DFF] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#FF4D8D]/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Bài Viết Mới (+50 XP)</span>
              </button>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{posts.length} bài viết thảo luận sôi nổi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white border-transparent shadow-md'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            🔥 Tất cả ({posts.length})
          </button>
          {FORUM_CATEGORIES.map((cat) => {
            const count = posts.filter((p) => p.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.key);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-[#14112E] border-white shadow-md'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung, môn học hoặc hashtag..."
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#6C4DFF]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6C4DFF]"
            >
              <option value="newest">Mới nhất</option>
              <option value="likes">Nhiều lượt thích nhất 🔥</option>
              <option value="comments">Nhiều bình luận nhất 💬</option>
            </select>
          </div>
        </div>

        {/* Posts Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map((post) => {
            const catMeta = FORUM_CATEGORIES.find((c) => c.key === post.category) || FORUM_CATEGORIES[0];
            const myId = firebaseUser?.uid || 'local-user';
            const isLiked = post.likedBy?.includes(myId);

            return (
              <div
                key={post.id}
                onClick={() => {
                  sound.playClick();
                  setActivePost(post);
                }}
                className={`rounded-3xl border transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-2xl hover:scale-[1.01] ${
                  post.pinned
                    ? 'bg-gradient-to-br from-[#24173F]/90 to-[#191330]/90 border-amber-400/40'
                    : 'bg-[#181333]/80 border-white/10 hover:border-white/25'
                }`}
              >
                <div>
                  {/* Top: Category & Pin indicator */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${catMeta.badgeBg}`}
                    >
                      <span>{catMeta.icon}</span>
                      <span>{catMeta.label}</span>
                    </span>

                    {post.pinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-lg">
                        <Pin className="w-3 h-3" /> Ghim Nổi Bật
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-300 transition-colors leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Content snippet */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Author & Interaction Counters */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{post.authorAvatar}</span>
                    <div>
                      <div className="font-semibold text-white text-[11px] line-clamp-1">
                        {post.authorName}
                      </div>
                      <div className="text-[10px] text-slate-400">{post.createdAt}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Like button */}
                    <button
                      onClick={(e) => handleToggleLike(post, e)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                      title={isLiked ? 'Bỏ thích' : 'Thích bài viết'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span className="font-semibold text-xs">{post.likes}</span>
                    </button>

                    {/* Comments count */}
                    <span className="flex items-center gap-1 text-slate-300">
                      <MessageCircle className="w-3.5 h-3.5 text-[#6C4DFF]" />
                      <span className="font-semibold text-xs">{post.commentCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 p-8">
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Không tìm thấy bài viết nào</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Chưa có bài viết nào phù hợp với bộ lọc hiện tại. Bạn có thể là người đầu tiên chia sẻ kinh nghiệm về chủ đề này!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-[#6C4DFF] text-white text-xs font-bold"
            >
              Viết bài mới ngay
            </button>
          </div>
        )}
      </div>

      {/* DETAIL POST MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#1B1536] border border-white/20 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] flex flex-col justify-between overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const catMeta =
                      FORUM_CATEGORIES.find((c) => c.key === activePost.category) || FORUM_CATEGORIES[0];
                    return (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${catMeta.badgeBg}`}
                      >
                        {catMeta.icon} {catMeta.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-slate-400">{activePost.createdAt}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
                  {activePost.title}
                </h2>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Author info */}
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  {activePost.authorAvatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{activePost.authorName}</div>
                  <div className="text-[10px] text-slate-400">Tác giả bài viết</div>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {activePost.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activePost.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Like / Interaction Row */}
              <div className="flex items-center justify-between border-y border-white/10 py-3">
                <button
                  onClick={() => handleToggleLike(activePost)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePost.likedBy?.includes(firebaseUser?.uid || 'local-user')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      activePost.likedBy?.includes(firebaseUser?.uid || 'local-user')
                        ? 'fill-rose-400 text-rose-400'
                        : ''
                    }`}
                  />
                  <span>
                    {activePost.likedBy?.includes(firebaseUser?.uid || 'local-user')
                      ? 'Đã Thích'
                      : 'Thả Tim'}{' '}
                    ({activePost.likes})
                  </span>
                </button>

                <div className="text-xs text-slate-400">
                  {activePost.commentCount} bình luận thảo luận
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#FF4D8D]" /> Bình luận & Thảo luận
                </h4>

                {/* List of comments */}
                <div className="space-y-3">
                  {(commentsMap[activePost.id] || []).map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cmt.authorAvatar}</span>
                          <span className="text-xs font-bold text-white">{cmt.authorName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{cmt.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed pl-6">{cmt.content}</p>
                    </div>
                  ))}

                  {(!commentsMap[activePost.id] || commentsMap[activePost.id].length === 0) && (
                    <p className="text-xs text-slate-400 italic py-2">
                      Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến đóng góp!
                    </p>
                  )}
                </div>

                {/* Add Comment Input Form */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Viết lời bình luận hoặc chia sẻ góc nhìn của bạn... (+15 XP)"
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FF4D8D]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white text-xs font-bold hover:opacity-95"
                  >
                    Gửi
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#1D173A] border border-white/20 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Viết Bài Chia Sẻ Kinh Nghiệm</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] font-medium">
                    +50 XP
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Đóng góp kinh nghiệm bổ ích cho cộng đồng sinh viên UniLevelUp
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Chọn chủ đề phù hợp:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FORUM_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setNewCategory(cat.key)}
                      className={`p-2 rounded-xl text-xs font-semibold text-left border flex items-center gap-2 transition-all ${
                        newCategory === cat.key
                          ? 'bg-[#6C4DFF] text-white border-[#6C4DFF]'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="line-clamp-1">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tiêu đề bài viết:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Bí kíp đạt điểm A môn Giải tích 1 dù mất gốc..."
                  className="w-full bg-black/30 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#6C4DFF]"
                />
              </div>

              {/* Content textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nội dung chi tiết:
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Viết chi tiết kinh nghiệm, các bước thực hiện, lời khuyên và bài học rút ra..."
                  className="w-full bg-black/30 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#6C4DFF]"
                />
              </div>

              {/* Tags input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Hashtags phân loại (cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Kéo GPA, Bách Khoa, Kinh nghiệm, Giải tích..."
                  className="w-full bg-black/30 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#6C4DFF]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#6C4DFF] text-white text-xs font-bold hover:opacity-95"
                >
                  Đăng bài ngay (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
