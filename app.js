
        // Equipment catalog is loaded from equipment-data.js.

// LOGIN UI HANDLER
// IMPORTANT: this is a front-end prototype only. Real student authentication must be
// validated by a PHP backend using a database, password_hash/password_verify, and sessions.
let loginFailureCount = 0;
let loginLockedUntil = 0;

function handleLogin(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const now = Date.now();

    if (now < loginLockedUntil) {
        const secondsLeft = Math.ceil((loginLockedUntil - now) / 1000);
        errorBox.textContent = `Too many attempts. Please wait ${secondsLeft} seconds and try again.`;
        errorBox.classList.remove('hidden');
        return;
    }
    if (!username || !password) {
        errorBox.textContent = 'Enter your student ID and password.';
        errorBox.classList.remove('hidden');
        return;
    }
    if (password.length < 8) {
        errorBox.textContent = 'Your password must contain at least 8 characters.';
        errorBox.classList.remove('hidden');
        passwordInput.focus();
        return;
    }

    // Prototype behavior only: replace this block with a fetch() request to the PHP login endpoint.
    // Do not treat this front-end check as secure identity verification.
    if (username === 'student' && password === 'student123') {
        loginFailureCount = 0;
        document.getElementById('login-screen').classList.add('hidden');

        const mainApp = document.getElementById('main-app');
        mainApp.classList.remove('hidden');
        mainApp.classList.add('flex');

        errorBox.classList.add('hidden');
        errorBox.textContent = '';

        showToast('Welcome to CAMPUSMATE!');
        return;
    }   
    errorBox.textContent = 'Invalid demo username or password.';
    errorBox.classList.remove('hidden');
    
    loginFailureCount += 1;
    if (loginFailureCount >= 5) {
        loginLockedUntil = Date.now() + 30000;
        loginFailureCount = 0;
    }
}

function handleLogout() {
    const modal = document.getElementById('logout-confirm-modal');
    if (!modal) {
        if (window.confirm('Are you sure you want to log out?')) confirmLogout();
        return;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const cancelButton = modal.querySelector('button');
    if (cancelButton) cancelButton.focus();
}

function cancelLogout() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

function confirmLogout() {
    cancelLogout();
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('main-app').classList.remove('flex');
    document.getElementById('login-screen').classList.remove('hidden');
    const form = document.querySelector('#login-screen form');
    if (form) form.reset();
    const errorBox = document.getElementById('login-error');
    if (errorBox) { errorBox.classList.add('hidden'); errorBox.textContent = ''; }
    const passwordInput = document.getElementById('login-password');
    if (passwordInput) passwordInput.value = '';
    showToast('You have been logged out.');
}

// Render Equipment Grids
        function renderEquipmentGrid(items, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            if (!items.length) {
                container.innerHTML = `<div class="col-span-full py-8 text-center text-slate-400"><i class="fa-solid fa-box-open text-3xl mb-2"></i><p class="text-xs font-semibold">No equipment found.</p></div>`;
                return;
            }
            container.innerHTML = items.map(item => `
                <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200/80 flex flex-col">
                    <button type="button" onclick="openModal('${item.id}')" class="relative block w-full text-left group" aria-label="View details for ${item.name}">
                        <img src="${item.image}" alt="${item.name}" loading="lazy" class="w-full h-40 object-cover bg-slate-100 group-hover:scale-[1.02] transition-transform" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="display:none" class="w-full h-40 bg-blue-50 text-rtu-blue items-center justify-center text-4xl"><i class="fa-solid ${item.icon}"></i></div>
                        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${item.available > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}">${item.available > 0 ? 'Available' : 'Unavailable'}</span>
                    </button>
                    <div class="p-4 flex flex-col flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                                <span class="text-[10px] font-bold text-rtu-blue uppercase tracking-wider">${item.type}</span>
                                <button type="button" onclick="openModal('${item.id}')" class="block text-left font-bold text-slate-800 text-sm leading-snug mt-0.5 hover:text-rtu-blue">${item.name}</button>
                            </div>
                            <button type="button" onclick="toggleBookmark('${item.id}')" aria-label="${item.bookmarked ? 'Remove bookmark' : 'Bookmark'} ${item.name}" title="${item.bookmarked ? 'Remove bookmark' : 'Save equipment'}" class="shrink-0 ${item.bookmarked ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-400 transition-all p-1">
                                <i class="${item.bookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-base"></i>
                            </button>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-2 line-clamp-2">${item.desc}</p>
                        <div class="mt-auto pt-3 flex items-center justify-between gap-2">
                            <div><span class="text-[10px] text-slate-400 block font-medium">Sample stock</span><span class="text-xs font-bold ${item.available > 0 ? 'text-emerald-600' : 'text-rose-500'}">${item.available} / ${item.total} units</span></div>
                            <button type="button" onclick="openModal('${item.id}')" class="px-3.5 py-2 bg-rtu-darkBlue text-white text-xs font-bold rounded-xl hover:bg-rtu-blue transition-all shadow-sm">${item.available > 0 ? 'View details' : 'View item'}</button>
                        </div>
                    </div>
                </article>
            `).join('');
        }

        function renderGrids() {
            renderEquipmentGrid(equipmentData, 'home-equipment-grid');
            renderEquipmentGrid(equipmentData, 'full-equipment-grid');
            renderEquipmentGrid(equipmentData.filter(e => e.bookmarked), 'bookmark-equipment-grid');
        }

        // Tab Navigation Switcher
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
            const target = document.getElementById(`tab-${tabId}`);
            if (target) {
                target.classList.remove('hidden');
                target.classList.add('flex');
            }

            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
                btn.classList.add('hover:bg-white/80', 'text-slate-600');
            });

            const activeBtn = document.getElementById(`nav-${tabId}`);
            if (activeBtn) {
                activeBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
                activeBtn.classList.remove('hover:bg-white/80');
            }

            renderGrids();
        }

        function filterCategory(cat) {
            document.querySelectorAll('.cat-pill').forEach(btn => {
                btn.className = 'cat-pill px-3 py-1 rounded-full bg-white text-slate-600 hover:bg-slate-100 font-semibold text-[11px] border border-slate-200';
            });
            event.target.className = 'cat-pill px-3 py-1 rounded-full bg-rtu-darkBlue text-white font-bold text-[11px]';

            if (cat === 'all') {
                renderEquipmentGrid(equipmentData, 'home-equipment-grid');
            } else {
                renderEquipmentGrid(equipmentData.filter(i => i.category === cat), 'home-equipment-grid');
            }
        }

        function filterStatus(status) {
            document.querySelectorAll('.stat-pill').forEach(btn => {
                btn.className = 'stat-pill px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200';
            });
            event.target.className = 'stat-pill px-3 py-1 text-xs rounded-lg bg-rtu-darkBlue text-white font-bold';

            if (status === 'all') {
                renderEquipmentGrid(equipmentData, 'full-equipment-grid');
            } else {
                renderEquipmentGrid(equipmentData.filter(i => i.status === status), 'full-equipment-grid');
            }
        }

        function handleSearch(query) {
            const q = query.toLowerCase().trim();
            const filtered = equipmentData.filter(item => 
                item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
            );
            renderEquipmentGrid(filtered, 'home-equipment-grid');
            renderEquipmentGrid(filtered, 'full-equipment-grid');
        }

        function toggleBookmark(id) {
            const item = equipmentData.find(e => e.id === id);
            if (item) {
                item.bookmarked = !item.bookmarked;
                persistBookmarks();
                renderGrids();
                showToast(item.bookmarked ? `Bookmarked ${item.name}` : `Removed ${item.name} from bookmarks`);
            }
        }

        function openModal(id) {
            const item = equipmentData.find(entry => entry.id === id);
            if (!item) return;

            document.getElementById('modal-item-name').innerText = item.name;
            document.getElementById('modal-category').innerText = item.type;
            document.getElementById('modal-stock').innerText =

                    `${item.available} of ${item.total} sample units available`;

            
            const modalIcon = document.getElementById('modal-icon');
            const modalImage = document.getElementById('modal-product-image');

            modalIcon.className = `fa-solid ${item.icon || 'fa-box'}`;

            if (modalImage) {
                modalImage.onerror = function () {
                    this.style.display = 'none';
                    modalIcon.parentElement.style.display = 'flex';
                };

                modalImage.style.display = 'block';
                modalImage.src = item.image || '';
            }

            const modalDesc = document.getElementById('modal-description');
            if (modalDesc) {
                modalDesc.innerText = item.desc || 'No description available.';
            }

            document.getElementById('modal-selected-id').value = item.id;
            document.getElementById('borrow-modal').classList.remove('hidden');

        }

        function closeModal() {
            document.getElementById('borrow-modal').classList.add('hidden');
        }

        function submitBorrowRequest() {
            closeModal();
            showToast('Borrowing request submitted! Pending Admin Approval.');
        }

        // CAMPUSMATE AI CHATBOT LOGIC
        function appendChatMessage(sender, message) {
            const container = document.getElementById('chat-messages');
            const msgDiv = document.createElement('div');
            msgDiv.className = `flex items-start gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''}`;

            if (sender === 'user') {
                msgDiv.innerHTML = `
                    <div class="w-8 h-8 rounded-xl bg-rtu-darkBlue text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                        SU
                    </div>
                    <div class="bg-rtu-darkBlue text-white text-xs p-3 rounded-2xl max-w-xl chat-bubble-user font-medium">
                        ${message}
                    </div>
                `;
            } else {
                msgDiv.innerHTML = `
                    <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div class="bg-teal-50/80 border border-teal-100 text-slate-800 text-xs p-3.5 rounded-2xl max-w-xl chat-bubble-bot space-y-1 font-medium">
                        ${message}
                    </div>
                `;
            }

            container.appendChild(msgDiv);
            container.scrollTop = container.scrollHeight;
        }

        // Rule-Based Campusmate NLP Response Engine
        async function processCampusmateNLP(query) {
            const q = query.toLowerCase();
            let reply = "";

            if (q.includes("projector") || q.includes("screen")) {
                const projector = equipmentData.find(e => e.id === 'eq1');
                reply = `<strong>Epson LCD Projector Status:</strong><br>We currently have <strong>${projector.available} out of ${projector.total} units</strong> available in stock. Would you like to place a borrow request?`;
            } else if (q.includes("laptop") || q.includes("computer") || q.includes("dell")) {
                const laptop = equipmentData.find(e => e.id === 'eq2');
                reply = `<strong>Dell Latitude Laptops:</strong><br>There are <strong>${laptop.available} units available</strong> for lab use or presentation work.`;
            } else if (q.includes("request") || q.includes("status") || q.includes("pending")) {
                reply = `<strong>Your Current Request Status:</strong><br>• <strong>Epson Projector</strong>: Submitted on Oct 10, 2026 — <span class="text-amber-700 font-bold">Pending Approval</span> by RTU Admin.`;
            } else if (q.includes("borrow") || q.includes("how") || q.includes("rule")) {
                reply = `<strong>How to Borrow Equipment:</strong><br>1. Search for equipment in the Catalog.<br>2. Click <strong>Borrow</strong> & fill in your class code and borrow dates.<br>3. Wait for Admin approval notification!`;
            } else {
                // Gemini API Call integration option with natural fallback
                try {
                    const systemPrompt = "You are Campusmate, an AI equipment assistant for Rizal Technological University (RTU). Answer briefly, politely, and prioritize student borrowing equipment guidance.";
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: query }] }],
                            systemInstruction: { parts: [{ text: systemPrompt }] }
                        })
                    });
                    const result = await response.json();
                    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                        reply = result.candidates[0].content.parts[0].text;
                    } else {
                        throw new Error('No candidate response');
                    }
                } catch (err) {
                    reply = `I understand you're asking about <em>"${query}"</em>. You can search our current available items in the <strong>Equipment Catalog</strong> tab or check your active requests in <strong>My Borrowings</strong>!`;
                }
            }

            appendChatMessage('bot', reply);
        }

        function handleChatSubmit(e) {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const query = input.value.trim();
            if (!query) return;

            appendChatMessage('user', query);
            input.value = '';

            setTimeout(() => {
                processCampusmateNLP(query);
            }, 500);
        }

        function sendQuickPrompt(promptText) {
            document.getElementById('chat-input').value = promptText;
            handleChatSubmit(new Event('submit'));
        }

        function toggleNotifications() {
            document.getElementById('notif-dropdown').classList.toggle('hidden');
        }

        function toggleMobileMenu() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        }

        function showToast(msg) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 transition-all transform translate-y-2 opacity-0 border border-slate-700';
            toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> ${msg}`;
            
            container.appendChild(toast);
            setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
            setTimeout(() => {
                toast.classList.add('opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        function viewRequestStatus(equipmentId) {
            if (equipmentId !== 'eq1') {
                showToast('Request details not found.');
                return;
            }

            switchTab('request-details');
        }
