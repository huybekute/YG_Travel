    <script setup>
        import { ref, onMounted, computed, watch } from 'vue';
        import apiService from '@/services/APIService';
        import Toast from '../../utils/swal.js';
        import useAuthStore from '@/stores/authStore.js';

        const authStore = useAuthStore();

        // Quan ly Tab
        const activeTab = ref('posts'); 

        // Quan ly post
        const posts = ref([]);
        const blogCategories = ref([]);
        const searchQuery = ref('');
        const selectedCat = ref('');
        const currentPage = ref(1);
        const itemPerPage = 8;

        // Loc post
        const filteredPosts = computed(() => {
            return posts.value.filter(p => {
                const matchSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchCat = selectedCat.value === '' || p.categoryID == selectedCat.value;
                return matchSearch && matchCat;
            });
        });

        // phan trang
        const listPostCurrentPage = computed(() => {
            const start = (currentPage.value - 1) * itemPerPage;
            return filteredPosts.value.slice(start, start + itemPerPage);
        });

        const totalPostPage = computed(() => Math.ceil(filteredPosts.value.length / itemPerPage));

        const getBlogData = async () => {
            try {
                const postRes = await apiService.get("/blog/admin/all");
                const catRes = await apiService.get("/blog-category")

                posts.value = postRes.data;
                blogCategories.value = catRes.data;
            } catch (err) {
                console.error("Lỗi load data:", err);
            }
        };

        const toggleStatus = async (post) => {
        const newStatus = post.status === 1 ? 0 : 1;
            try {
                await apiService.put(`/blog/status/${post.postID}`, { status: newStatus });
                post.status = newStatus; 
            } catch (err) {
                Toast.errorToast('Lỗi', 'Không thể đổi trạng thái');
            }
        };

        // create or update post
        const isPostModalOpen = ref(false);
        const isEditMode = ref(false);
        const postForm = ref({
            postID: null, title: '', slug: '', categoryID: '', 
            excerpt: '', content: '', thumbnail: null
        });

        //tu dong tao slug
        const generateSlug = () => {
            postForm.value.slug = postForm.value.title
                .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        };

        const generateCatSlug = () => {
            let str = catForm.value.name;
            if (!str) return;
            str = str.toLowerCase();
            str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a");
            str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e");
            str = str.replace(/i|í|ì|ỉ|ĩ|ị/g, "i");
            str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o");
            str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u");
            str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/[^a-z0-z0-9\s-]/g, ""); 
            str = str.trim().replace(/\s+/g, "-");     
            str = str.replace(/-+/g, "-");           
            catForm.value.slug = str;
        };
        const fileUpload = (e) => { postForm.value.thumbnail = e.target.files[0]; };

        const savePost = async () => {
            if (!postForm.value.title || !postForm.value.categoryID) {
                Toast.errorToast('Thiếu thông tin', 'Vui lòng nhập tiêu đề và chọn danh mục');
                return;
            }
            const formData = new FormData();
            formData.append('title', postForm.value.title);
            formData.append('slug', postForm.value.slug);
            formData.append('excerpt', postForm.value.excerpt || '');
            formData.append('content', postForm.value.content || '');
            formData.append('categoryID', postForm.value.categoryID);
            formData.append('status', postForm.value.status ?? 1);
            const currentUserID = authStore.user?.userID || localStorage.getItem('userID');
            formData.append('userID', currentUserID);
            if (postForm.value.thumbnail instanceof File) {
                formData.append('thumbnail', postForm.value.thumbnail);
            } else {
                formData.append('thumbnail', postForm.value.thumbnail || ''); 
            }
            try {
                const config = {
                    headers: { 'Content-Type': 'multipart/form-data' }
                };

                if (isEditMode.value) {
                    await apiService.put(`/blog/${postForm.value.postID}`, formData, config);
                } else {
                    await apiService.post("/blog", formData, config);
                }
                
                isPostModalOpen.value = false;
                isEditMode.value = false;
                getBlogData(); 
            } catch (err) {
                console.error("Lỗi chi tiết:", err.response?.data);
                Toast.errorToast('Lỗi', err.response?.data?.message || 'Không thể lưu bài viết');
            }
        };

        // Quan ly the loai blog
        const isCatModalOpen = ref(false);
        const catForm = ref({ categoryID: null, name: '', slug: '', description: '' });

        const saveCategory = async () => {
            try {
                if (catForm.value.categoryID) {
                    await apiService.put(`/blog-category/${catForm.value.categoryID}`, catForm.value);
                } else {
                    await apiService.post("/blog-category", catForm.value);
                }
                isCatModalOpen.value = false;
                getBlogData();
            } 
            catch (err) { 
                Toast.errorToast('Lỗi'); 
            }
        };

        const deleteCategory = async (id) => {
            if (!(await Toast.confirmRequestToast('warning', 'Xóa danh mục?', 'Các bài viết thuộc mục này có thể bị ảnh hưởng')).isConfirmed) return;
            try {
                await apiService.delete(`/blog-category/${id}`);
                getBlogData();
            } 
            catch (err) { 
                console.log(err)
                Toast.errorToast('Lỗi', 'Danh mục này đang có bài viết, không thể xóa!'); }
        };

        const editPost = (post) => {
            isEditMode.value = true;
            
            postForm.value = { 
                postID: post.postID,
                title: post.title,
                slug: post.slug,
                categoryID: post.categoryID,
                excerpt: post.excerpt || '', 
                content: post.content || '', 
                thumbnail: post.thumbnail,  
                status: post.status
            };
            isPostModalOpen.value = true;
        };

        const deletePost = async (id) => {
            const confirm = await Toast.confirmRequestToast('warning', 'Xóa bài viết?', 'Dữ liệu sẽ không thể khôi phục!');
            if (!confirm.isConfirmed) return;

            try {
                await apiService.delete(`/blog/${id}`);
                Toast.successToast('Đã xóa', 'Bài viết đã được gỡ bỏ');
                getBlogData(); // Load lại danh sách
            } catch (err) {
                Toast.errorToast('Lỗi', 'Không thể xóa bài viết này');
            }
        };

        onMounted(() => getBlogData());
        watch([searchQuery, selectedCat, activeTab], () => { currentPage.value = 1; });
    </script>

    <template>
        <div class="p-6">
            <div class="flex gap-4 mb-6 border-b">
                <button @click="activeTab = 'posts'" 
                    :class="['pb-2 px-4 font-bold transition-all', activeTab === 'posts' ? 'border-b-4 border-green-600 text-green-600' : 'text-gray-400']">
                    BÀI VIẾT
                </button>
                <button @click="activeTab = 'categories'" 
                    :class="['pb-2 px-4 font-bold transition-all', activeTab === 'categories' ? 'border-b-4 border-green-600 text-green-600' : 'text-gray-400']">
                    THỂ LOẠI
                </button>
            </div>
            <div v-if="activeTab === 'posts'">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-500">Quản lý blog  </h1>
                    <button @click="isEditMode = false; postForm = { postID: null, title: '', slug: '', categoryID: '', excerpt: '', content: '', thumbnail: null, status: 1 }; isPostModalOpen = true" 
                        class="bg-green-600 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2"><i class="fa-solid fa-plus"></i> Thêm bài viết
                </button>
                </div>

                <div class="bg-white p-4 border rounded-t-xl flex gap-4 shadow-sm">
                    <div class="relative flex-1">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
                        <input v-model="searchQuery" type="text" placeholder="Tìm tên bài viết..." class="pl-10 pr-4 py-2 border rounded-md w-full outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <select v-model="selectedCat" class="border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">Tất cả danh mục</option>
                        <option v-for="c in blogCategories" :key="c.categoryID" :value="c.categoryID">{{ c.name }}</option>
                    </select>
                </div>

                <div class="bg-white border-x border-b shadow-sm divide-y overflow-hidden rounded-b-xl">
                    <div class="bg-gray-50 flex gap-3 items-center px-6 py-3 text-[10px] font-bold text-gray-400 tracking-widest">
                        <div class="w-20">Ảnh</div>
                        <div class="flex-1">Tiêu đề & Thông tin</div>
                        <div class="w-40 text-center">Danh mục</div>
                        <div class="w-24 text-center">Lượt xem</div>
                        <div class="w-24 text-center">Trạng thái</div>
                        <div class="w-32 text-center">Hành động</div>
                    </div>
                    <div v-for="post in listPostCurrentPage" :key="post.postID" class="flex items-center px-6 py-4 hover:bg-green-50 transition-all group">
                        <div class="w-20">
                            <img :src="post.thumbnail" class="w-14 h-10 object-cover rounded shadow-sm border" v-if="post.thumbnail">
                            <div v-else class="w-14 h-10 bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-300">NO IMG</div>
                        </div>
                        <div class="flex-1 px-4">
                            <p class="font-bold text-gray-800 line-clamp-1">{{ post.title }}</p>
                            <p class="text-[10px] text-gray-400 mt-1">{{ post.slug }}</p>
                        </div>
                        <div class="w-40 text-center">
                            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">{{ post.categoryName }}</span>
                        </div>
                        <div class="w-24 text-center font-medium text-gray-500 text-sm">{{ post.views }}</div>
                        <!-- <div class="w-24 text-center">
                            <button @click="toggleStatus(post)" 
                                :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer', 
                                post.status === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400']">
                                {{ post.status === 1 ? 'Hiện' : 'Ẩn' }}
                            </button>
                        </div> -->
                        <div class="w-24 text-center flex justify-center">
                        <div @click="toggleStatus(post)" :class="['w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300',
                                    post.status === 1 ? 'bg-green-500' : 'bg-gray-300']">
                                <div :class="['bg-white w-4 h-4 rounded-full',
                                        post.status === 1 ? 'translate-x-6' : 'translate-x-0']">
                                </div>
                            </div>
                        </div>
                        <div class="w-32 flex justify-center gap-2">
                            <button @click="editPost(post)" class="p-2 text-blue-500 cursor-pointer rounded-md transition-all"><i class="fa-solid fa-edit"></i></button>
                            <button @click="deletePost(post.postID)" class="p-2 text-red-500 cursor-pointer rounded-md transition-all"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        
                    </div>
                    
                </div>
            </div>

            <div v-if="activeTab === 'categories'">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-500">Thể loại blog</h1>
                    <button @click="catForm = { categoryID: null, name: '', slug: '', description: '' }; isCatModalOpen = true" class="bg-green-600 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> Thêm danh mục
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="cat in blogCategories" :key="cat.categoryID" class="bg-white p-6 rounded-md border shadow-sm hover:shadow-md transition-all relative group">
                        <h3 class="font-bold text-gray-800 mb-1">{{ cat.name }}</h3>
                        <p class="text-[10px] text-gray-400 mb-3 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded ">
                            /blog/{{ cat.slug }}
                        </p>
                        <p class="text-xs text-gray-500 line-clamp-2  leading-relaxed">
                            "{{ cat.description || 'Không có mô tả' }}"
                        </p>
                        <div class="flex justify-between items-start mt-2">
                            <div class="flex gap-2">
                                <button @click="catForm = {...cat}; isCatModalOpen = true" class="p-2 text-blue-500 cursor-pointer rounded-md">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button @click="deleteCategory(cat.categoryID)" class="p-2 text-red-500 cursor-pointer rounded-md">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isPostModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/20" @click="isPostModalOpen = false"></div>
                <div class="bg-white rounded-md shadow-2xl z-10 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div class="px-6 py-4 border-b bg-green-50 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-green-800">{{ isEditMode ? 'Sửa bài viết' : 'Thêm bài viết' }}</h3>
                        <button @click="isPostModalOpen = false" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                    </div>
                    <div class="p-6 overflow-y-auto space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="text-[10px] font-bold text-gray-400 uppercase">Tiêu đề bài viết</label>
                                <input v-model="postForm.title" @input="generateSlug" type="text" class="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-gray-400 uppercase">Slug</label>
                                <input v-model="postForm.slug" type="text" class="w-full border rounded-md px-4 py-2 bg-gray-50" readonly />
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-gray-400 uppercase">Danh mục</label>
                                <select v-model="postForm.categoryID" class="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500">
                                    <option v-for="c in blogCategories" :key="c.categoryID" :value="c.categoryID">{{ c.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Ảnh</label>
                            <input type="file" @change="fileUpload" class="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Tóm tắt ngắn</label>
                            <textarea v-model="postForm.excerpt" rows="2" class="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Nội dung chi tiết (Markdown/HTML)</label>
                            <textarea v-model="postForm.content" rows="10" class="w-full border rounded-md px-4 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                    </div>
                    <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button @click="savePost" class="px-8 py-2 bg-green-600 text-white rounded-md font-bold shadow-lg hover:bg-green-700 active:scale-95 transition-all">
                            Đăng
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="isCatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/20" @click="isCatModalOpen = false"></div>
                <div class="bg-white rounded-md shadow-2xl z-10 w-full max-w-md overflow-hidden flex flex-col transition-all transform">
                    <div class="px-6 py-4 border-b bg-green-50 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-green-800">{{ catForm.categoryID ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}</h3>
                        <button @click="isCatModalOpen = false" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                    </div>
                    
                    <div class="p-6 space-y-4">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Tên danh mục</label>
                            <input v-model="catForm.name" @input="generateCatSlug" type="text" placeholder="VD: Kinh nghiệm du lịch" 
                                class="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Slug (Đường dẫn)</label>
                            <input v-model="catForm.slug" type="text" readonly 
                                class="w-full border rounded-md px-4 py-2 bg-gray-50 text-gray-500" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Mô tả ngắn</label>
                            <textarea v-model="catForm.description" rows="3" placeholder="Mô tả cho danh mục này..." 
                                    class="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                    </div>

                    <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button @click="isCatModalOpen = false" class="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800">Hủy</button>
                        <button @click="saveCategory" class="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-bold hover:bg-green-700 shadow-md transition-all active:scale-95">
                            {{ catForm.categoryID ? 'CẬP NHẬT' : 'LƯU DANH MỤC' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <!-- <style scoped>
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    </style> -->