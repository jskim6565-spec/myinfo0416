// 더미 데이터 생성기 (테스트 목적)
const generateDummyData = () => {
    const lastNames = ['김', '이', '박', '정', '최', '강', '윤', '장', '한', '송'];
    const firstNames = ['철수', '영희', '민수', '지은', '동훈', '서연', '여준', '보람', '지민', '중기', '태리', '보영', '우식', '수지'];
    const domains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

    let data = [];
    // 45명의 가상 유저 생성
    for (let i = 1; i <= 45; i++) {
        const name = lastNames[Math.floor(Math.random() * lastNames.length)] + firstNames[Math.floor(Math.random() * firstNames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = `user${i}@${domain}`;
        const phone = `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

        // 지난 1년 내로 무작위 가입일 생성
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        const dateStr = date.toISOString().split('T')[0];

        // 80% 확률로 ACTIVE 설정
        const status = Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE';

        const paths = ['GOOGLE', 'NAVER', 'EMAIL'];
        const signupPath = paths[Math.floor(Math.random() * paths.length)];

        data.push({
            id: `CST-${i.toString().padStart(4, '0')}`,
            name: name,
            email: email,
            phone: phone,
            signupPath: signupPath,
            createdAt: dateStr,
            status: status
        });
    }

    // 최근 가입자가 먼저 오도록 정렬 (id 역순)
    return data.reverse();
};

// 전역 상태 변수들
let customers = generateDummyData();
let filteredCustomers = [...customers];
let currentPage = 1;
const ITEMS_PER_PAGE = 10;

// DOM 요소 캐싱
const tbody = document.getElementById('customerTableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const paginationControls = document.getElementById('paginationControls');

const startIdxEl = document.getElementById('startIdx');
const endIdxEl = document.getElementById('endIdx');
const totalItemsEl = document.getElementById('totalItems');

// [Read] 테이블 랜더링 기능
const renderTable = () => {
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length);

    const currentData = filteredCustomers.slice(startIndex, endIndex);

    if (currentData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 4rem; color: var(--text-muted); font-size: 1.1rem;">검색 결과가 없습니다.</td></tr>`;
    } else {
        currentData.forEach(customer => {
            const tr = document.createElement('tr');

            const badgeClass = customer.status === 'ACTIVE' ? 'status-active' : 'status-inactive';
            const badgeText = customer.status === 'ACTIVE' ? 'Active' : 'Inactive';

            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" value="${customer.id}"></td>
                <td class="text-muted">${customer.id}</td>
                <td class="font-medium">${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.signupPath || 'EMAIL'}</td>
                <td>${customer.createdAt}</td>
                <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
                <td class="actions">
                    <button class="btn-icon" onclick="openEditModal('${customer.id}')" title="수정">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteCustomer('${customer.id}')" title="삭제">
                       <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                       </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 하단 정보 업데이트
    startIdxEl.textContent = filteredCustomers.length > 0 ? startIndex + 1 : 0;
    endIdxEl.textContent = endIndex;
    totalItemsEl.textContent = filteredCustomers.length;

    renderPagination();
};

// 페이징 랜더링
const renderPagination = () => {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

    if (totalPages <= 0) return;

    // 이전 페이지 버튼
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '&laquo;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    };
    paginationControls.appendChild(prevBtn);

    // 숫자 버튼들
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            renderTable();
        };
        paginationControls.appendChild(btn);
    }

    // 다음 페이지 버튼
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '&raquo;';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    };
    paginationControls.appendChild(nextBtn);
};

// [Filter & Search] 검색 및 필터 적용
const applyFilters = () => {
    const searchText = searchInput.value.toLowerCase();
    const statusVal = statusFilter.value;

    filteredCustomers = customers.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchText) ||
            c.email.toLowerCase().includes(searchText) ||
            c.phone.includes(searchText);
        const matchStatus = statusVal === '' || c.status === statusVal;

        return matchSearch && matchStatus;
    });

    currentPage = 1; // 검색 결과 변경시 첫 페이지로 이동
    renderTable();
};

searchInput.addEventListener('input', applyFilters);
statusFilter.addEventListener('change', applyFilters);

// 전체 선택 기능
document.getElementById('selectAll').addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
});

/* 모달 관련 로직 */
const modal = document.getElementById('customerModal');
const btnAdd = document.getElementById('addCustomerBtn');
const btnClose = document.getElementById('closeModalBtn');
const btnCancel = document.getElementById('cancelModalBtn');
const customerForm = document.getElementById('customerForm');
const modalTitle = document.getElementById('modalTitle');

const openModal = () => {
    modal.classList.add('active');
};

const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
        customerForm.reset();
        document.getElementById('customerId').value = '';
    }, 300); // 닫기 애니메이션 후 폼 초기화
};

// 모달 외부 클릭 시 닫기
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

btnAdd.addEventListener('click', () => {
    modalTitle.textContent = '고객 추가';
    openModal();
});
btnClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
});

// [Update] 수정 모달 띄우기 (전역 스코프로 노출)
window.openEditModal = (id) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        modalTitle.textContent = '고객 정보 수정';
        document.getElementById('customerId').value = customer.id;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
        const formSignupPath = document.getElementById('customerSignupPath');
        if (formSignupPath) formSignupPath.value = customer.signupPath || 'EMAIL';
        document.getElementById('customerStatus').value = customer.status;
        openModal();
    }
};

// [Delete] 고객 삭제
window.deleteCustomer = (id) => {
    if (confirm('정말로 해당 고객의 정보를 삭제하시겠습니까?')) {
        customers = customers.filter(c => c.id !== id);
        applyFilters(); // 삭제 후 리스트 갱신
        showToast('고객 정보가 안전하게 삭제되었습니다.');
    }
};

// [Create & Update] 폼 제출 핸들링
document.getElementById('saveCustomerBtn').addEventListener('click', (e) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!customerForm.checkValidity()) {
        customerForm.reportValidity();
        return;
    }

    const id = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const formSignupPath = document.getElementById('customerSignupPath');
    const signupPath = formSignupPath ? formSignupPath.value : 'EMAIL';
    const status = document.getElementById('customerStatus').value;

    if (id) {
        // 기존 회원의 정보 업데이트
        const idx = customers.findIndex(c => c.id === id);
        if (idx > -1) {
            customers[idx] = { ...customers[idx], name, email, phone, signupPath, status };
        }
        showToast('고객 정보가 수정되었습니다.');
    } else {
        // 새로운 고객 추가
        // 임시로 생성하는 ID 이므로 기존 개수 + 난수 활용
        const newIdSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const newId = `CST-${newIdSuffix}`;
        const date = new Date().toISOString().split('T')[0];

        customers.unshift({
            id: newId,
            name, email, phone, signupPath, status, createdAt: date
        });
        showToast('새로운 고객이 등록되었습니다.');
    }

    closeModal();
    applyFilters(); // 추가/수정 사항 반영을 위해 다시 랜더링
});

// 하단 토스트 알림 표시
const showToast = (message) => {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg class="toast-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    // 애니메이션 트리거
    setTimeout(() => toast.classList.add('show'), 10);

    // 일정 시간 후 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// 초기화
renderTable();
