// IPK Calculator - Complete Logic
let semesters = [];
let currentSemesterIndex = null;
let expandedSemesters = {};
let dashboardChartInstance = null;

// Grade mapping
const gradeMap = {
    '4.0': 'A',
    '3.7': 'A-',
    '3.3': 'B+',
    '3.0': 'B',
    '2.7': 'B-',
    '2.3': 'C+',
    '2.0': 'C',
    '1.7': 'C-',
    '1.3': 'D+',
    '1.0': 'D',
    '0.0': 'E'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('ipk_theme');
    document.documentElement.removeAttribute('data-theme');
    loadData();
    render();
});

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('ipk_semesters');
    if (saved) {
        semesters = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('ipk_semesters', JSON.stringify(semesters));
}

// Add new semester
function addSemester() {
    const semesterNumber = semesters.length + 1;
    const newSemester = {
        id: Date.now(),
        number: semesterNumber,
        courses: [],
        ip: 0,
        totalSKS: 0
    };
    semesters.push(newSemester);
    saveData();
    render();
    
    // Show notification
    showNotification('Semester ' + semesterNumber + ' ditambahkan!', 'success');
}

// Delete semester
function deleteSemester(index) {
    if (!confirm('Hapus Semester ' + semesters[index].number + '?\n\nSemua data mata kuliah akan hilang!')) {
        return;
    }
    
    semesters.splice(index, 1);
    
    // Renumber semesters
    semesters.forEach((sem, idx) => {
        sem.number = idx + 1;
    });
    
    saveData();
    render();
    showNotification('Semester dihapus!', 'success');
}

// Open course modal
function openCourseModal(semesterIndex) {
    currentSemesterIndex = semesterIndex;
    document.getElementById('courseModal').classList.add('show');
    document.getElementById('courseName').value = '';
    document.getElementById('courseSKS').value = '';
    document.getElementById('courseGrade').value = '';
    document.getElementById('courseName').focus();
}

// Close course modal
function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('show');
    currentSemesterIndex = null;
}

// Save course
function saveCourse() {
    const name = document.getElementById('courseName').value.trim();
    const sks = parseInt(document.getElementById('courseSKS').value);
    const grade = parseFloat(document.getElementById('courseGrade').value);
    
    // Validation
    if (!name) {
        alert('Nama mata kuliah harus diisi!');
        return;
    }
    
    if (!sks || sks < 1 || sks > 6) {
        alert('SKS harus antara 1-6!');
        return;
    }
    
    if (grade === '' || isNaN(grade)) {
        alert('Pilih nilai mata kuliah!');
        return;
    }
    
    // Add course
    const course = {
        id: Date.now(),
        name: name,
        sks: sks,
        grade: grade,
        gradeLetter: gradeMap[grade.toFixed(1)]
    };
    
    semesters[currentSemesterIndex].courses.push(course);
    
    // Recalculate IP
    calculateSemesterIP(currentSemesterIndex);
    
    saveData();
    render();
    closeCourseModal();
    
    showNotification('Mata kuliah ditambahkan!', 'success');
}

// Delete course
function deleteCourse(semesterIndex, courseIndex) {
    semesters[semesterIndex].courses.splice(courseIndex, 1);
    calculateSemesterIP(semesterIndex);
    saveData();
    render();
    showNotification('Mata kuliah dihapus!', 'success');
}

// Calculate IP for a semester
function calculateSemesterIP(index) {
    const semester = semesters[index];
    
    if (semester.courses.length === 0) {
        semester.ip = 0;
        semester.totalSKS = 0;
        return;
    }
    
    let totalPoints = 0;
    let totalSKS = 0;
    
    semester.courses.forEach(course => {
        totalPoints += course.grade * course.sks;
        totalSKS += course.sks;
    });
    
    semester.ip = (totalPoints / totalSKS).toFixed(2);
    semester.totalSKS = totalSKS;
}

// Calculate cumulative IPK
function calculateIPK() {
    if (semesters.length === 0) {
        return {
            ipk: 0,
            totalSKS: 0,
            predikat: '-'
        };
    }
    
    let totalPoints = 0;
    let totalSKS = 0;
    
    semesters.forEach(semester => {
        semester.courses.forEach(course => {
            totalPoints += course.grade * course.sks;
            totalSKS += course.sks;
        });
    });
    
    const ipk = totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : 0;
    const predikat = getPredikat(parseFloat(ipk), totalSKS, semesters.length);
    
    return {
        ipk: ipk,
        totalSKS: totalSKS,
        predikat: predikat
    };
}

// Get predikat
function getPredikat(ipk, totalSKS = 0, totalSemesters = 0) {
    if (totalSKS === 0) return '—';
    if (totalSKS < 20) return 'Belum cukup data untuk menentukan predikat';
    
    const isFinal = totalSKS >= 120 || totalSemesters >= 7;
    
    if (ipk >= 3.75) return isFinal ? 'Cum Laude' : 'Performa sangat baik — berpotensi Cum Laude';
    if (ipk >= 3.50) return isFinal ? 'Dengan Pujian' : 'Performa sangat baik — berpotensi Dengan Pujian';
    if (ipk >= 3.00) return isFinal ? 'Memuaskan' : 'Performa baik — berpotensi Memuaskan';
    if (ipk >= 2.00) return isFinal ? 'Lulus' : 'Performa cukup';
    if (ipk > 0) return isFinal ? 'Tidak Lulus' : 'Perlu peningkatan performa akademik';
    
    return '—';
}

// Render everything
function render() {
    renderSummary();
    renderSemesters();
    calculateQuickStats();
    renderDashboardChart();
}

function getGPABadgeText(ipk, totalSKS = 0) {
    if (ipk === 0) return '—';
    if (totalSKS < 20) return 'In Progress';
    if (ipk >= 3.75) return 'Excellent';
    if (ipk >= 3.50) return 'Very Good';
    if (ipk >= 3.00) return 'Good';
    if (ipk >= 2.00) return 'Satisfactory';
    if (ipk > 0) return 'Needs Work';
    return '—';
}

// Render summary card
function renderSummary() {
    const result = calculateIPK();
    
    document.getElementById('totalIPK').textContent = result.ipk;
    document.getElementById('totalSKS').textContent = result.totalSKS;
    document.getElementById('totalSemesters').textContent = semesters.length;
    document.getElementById('predikat').textContent = result.predikat;

    const gpaBadge = document.getElementById('gpaStatusBadge');
    if (gpaBadge) {
        const text = getGPABadgeText(parseFloat(result.ipk), result.totalSKS);
        gpaBadge.textContent = text;
        gpaBadge.className = 'kpi-badge';
        if (text === 'Excellent' || text === 'Very Good') {
            gpaBadge.style.backgroundColor = 'var(--success-light)';
            gpaBadge.style.color = 'var(--success)';
        } else if (text === 'Good') {
            gpaBadge.style.backgroundColor = 'var(--accent-light)';
            gpaBadge.style.color = 'var(--accent)';
        } else if (text === 'Satisfactory') {
            gpaBadge.style.backgroundColor = 'var(--warning-light)';
            gpaBadge.style.color = 'var(--warning)';
        } else if (text === 'Needs Work') {
            gpaBadge.style.backgroundColor = 'var(--danger-light)';
            gpaBadge.style.color = 'var(--danger)';
        } else {
            gpaBadge.style.backgroundColor = 'var(--accent-light)';
            gpaBadge.style.color = 'var(--text-secondary)';
        }
    }
}

function toggleSemesterDetails(index) {
    expandedSemesters[index] = !expandedSemesters[index];
    renderSemesters();
}

function renderDashboardChart() {
    const canvas = document.getElementById('ipChartDashboard');
    if (!canvas) return;
    
    if (semesters.length === 0) {
        if (dashboardChartInstance) {
            dashboardChartInstance.destroy();
            dashboardChartInstance = null;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const semesterLabels = semesters.map(s => `Sem ${s.number}`);
    const ipData = semesters.map(s => parseFloat(s.ip));
    
    if (dashboardChartInstance) {
        dashboardChartInstance.destroy();
    }
    
    dashboardChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: semesterLabels,
            datasets: [{
                label: 'IP Semester',
                data: ipData,
                borderColor: '#1A365D',
                backgroundColor: 'rgba(26, 54, 93, 0.05)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#1A365D',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                    bodyFont: { family: 'Inter', size: 12 },
                    padding: 8,
                    cornerRadius: 4,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 11 }, color: '#6B7280' }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 4.0,
                    grid: { color: '#F3F4F6' },
                    ticks: {
                        stepSize: 1.0,
                        font: { family: 'Inter', size: 11 },
                        color: '#6B7280',
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                }
            }
        }
    });
}

// Render semesters list
function renderSemesters() {
    const container = document.getElementById('semestersList');
    const emptyState = document.getElementById('emptyState');
    
    if (semesters.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    let html = '';
    
    semesters.forEach((semester, index) => {
        const ipNum = parseFloat(semester.ip);
        const ipColor = ipNum >= 3.5 ? 'var(--success)' : ipNum >= 3.0 ? 'var(--accent)' : ipNum >= 2.0 ? 'var(--warning)' : 'var(--danger)';
        const isExpanded = expandedSemesters[index] === true;
        const detailsBtnHtml = isExpanded 
            ? `<i class="fa-solid fa-chevron-up"></i> Hide Details` 
            : `<i class="fa-solid fa-chevron-down"></i> View Details`;
            
        html += `
            <div class="semester-card">
                <div class="semester-header">
                    <div class="semester-title">
                        <div class="semester-number-badge">${semester.number}</div>
                        <h3>Semester ${semester.number}</h3>
                    </div>
                    <div class="semester-stats">
                        <span>
                            <i class="fa-solid fa-chart-line"></i>
                            IPS: <span class="ip-value" style="color:${ipColor}">${semester.ip}</span>
                        </span>
                        <span>
                            <i class="fa-solid fa-book"></i>
                            SKS: ${semester.totalSKS}
                        </span>
                        <span>
                            <i class="fa-solid fa-list"></i>
                            MK: ${semester.courses.length}
                        </span>
                    </div>
                    <div class="semester-actions">
                        <button onclick="toggleSemesterDetails(${index})" class="btn-small" id="btn-details-${index}">
                            ${detailsBtnHtml}
                        </button>
                        <button onclick="openCourseModal(${index})" class="btn-small btn-add">
                            <i class="fa-solid fa-plus"></i> Tambah MK
                        </button>
                        <button onclick="deleteSemester(${index})" class="btn-small btn-delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Collapsible details section -->
                <div id="details-${index}" class="semester-details-content" style="display: ${isExpanded ? 'block' : 'none'};">
                    ${(semester.note || semester.tags || semester.lesson) ? `
                        <div class="semester-notes-display">
                            ${semester.note ? `<div class="note-text">📝 ${semester.note}</div>` : ''}
                            ${semester.tags && semester.tags.length > 0 ? `
                                <div class="note-tags">
                                    ${semester.tags.map(tag => `<span class="note-tag">#${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                            ${semester.lesson ? `<div class="note-lesson">💡 ${semester.lesson}</div>` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="semester-notes-action-row" style="margin-bottom: var(--sp-3); display: flex; gap: var(--sp-2);">
                        <button onclick="openNotesModal(${index})" class="btn-small btn-notes">
                            <i class="fa-solid fa-note-sticky"></i> Edit Notes
                        </button>
                    </div>
                    
                    ${semester.courses.length > 0 ? `
                        <table class="courses-table">
                            <thead>
                                <tr>
                                    <th>Mata Kuliah</th>
                                    <th style="text-align: center;">SKS</th>
                                    <th style="text-align: center;">Nilai</th>
                                    <th style="text-align: center;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${semester.courses.map((course, courseIndex) => {
                                    const g = course.grade;
                                    const gc = g >= 3.5 ? 'grade-a' : g >= 2.5 ? 'grade-b' : g >= 1.5 ? 'grade-c' : 'grade-d';
                                    return `
                                    <tr>
                                        <td class="course-name">${course.name}</td>
                                        <td style="text-align: center;">${course.sks}</td>
                                        <td style="text-align: center;" class="course-grade ${gc}">
                                            ${course.gradeLetter} <span style="font-weight:400;font-size:0.8em;opacity:0.7;">(${course.grade.toFixed(1)})</span>
                                        </td>
                                        <td style="text-align: center;">
                                            <button onclick="openEditCourseModal(${index}, ${courseIndex})" class="btn-delete-course" title="Edit" style="color: var(--info); margin-right: 4px;">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button onclick="deleteCourse(${index}, ${courseIndex})" class="btn-delete-course" title="Hapus">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state" style="padding:16px;border:none;background:transparent;text-align:center;">
                            <p class="empty-desc" style="font-size:0.8rem;color:var(--text-secondary);">Belum ada mata kuliah. Klik <strong>Tambah MK</strong> di atas.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}



// Export PDF
function exportPDF() {
    if (semesters.length === 0) {
        alert('Belum ada data untuk di-export!');
        return;
    }
    
    const result = calculateIPK();
    
    let text = '=' .repeat(50) + '\n';
    text += 'TRANSKRIP NILAI AKADEMIK\n';
    text += '='.repeat(50) + '\n\n';
    
    text += `IPK Kumulatif: ${result.ipk}\n`;
    text += `Total SKS: ${result.totalSKS}\n`;
    text += `Predikat: ${result.predikat}\n`;
    text += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    
    text += '='.repeat(50) + '\n\n';
    
    semesters.forEach(semester => {
        text += `SEMESTER ${semester.number}\n`;
        text += `IP: ${semester.ip} | SKS: ${semester.totalSKS}\n`;
        text += '-'.repeat(50) + '\n';
        
        if (semester.courses.length > 0) {
            semester.courses.forEach(course => {
                text += `${course.name.padEnd(30)} ${course.sks} SKS  ${course.gradeLetter} (${course.grade.toFixed(1)})\n`;
            });
        } else {
            text += 'Belum ada mata kuliah\n';
        }
        
        text += '\n';
    });
    
    text += '='.repeat(50) + '\n';
    text += 'Generated by IPK Calculator\n';
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transkrip_${new Date().getTime()}.txt`;
    a.click();
    
    showNotification('Transkrip berhasil di-download!', 'success');
}

// Reset all data
function resetAll() {
    if (!confirm('Reset SEMUA data?\n\nSemua semester dan mata kuliah akan dihapus!\n\nTidak bisa dibatalkan!')) {
        return;
    }
    
    if (!confirm('Yakin 100%? Data tidak bisa dikembalikan!')) {
        return;
    }
    
    semesters = [];
    saveData();
    render();
    
    showNotification('Semua data telah dihapus!', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        notif.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        setTimeout(() => notif.remove(), 260);
    }, 3000);
}

// Close modal on outside click
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Esc to close modal
    if (e.key === 'Escape') {
        closeCourseModal();
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// FEATURE 1: QUICK STATS DASHBOARD
// ========================================

function toggleQuickStats() {
    const statsCard = document.getElementById('quickStats');
    if (statsCard.style.display === 'none' || !statsCard.style.display) {
        calculateQuickStats();
        statsCard.style.display = 'block';
    } else {
        statsCard.style.display = 'none';
    }
}

function calculateQuickStats() {
    if (semesters.length === 0) {
        document.getElementById('highestIP').textContent = '0.00';
        const hLabel = document.getElementById('highestIPLabel');
        if (hLabel) hLabel.textContent = 'Semester —';

        document.getElementById('lowestIP').textContent = '0.00';
        const lLabel = document.getElementById('lowestIPLabel');
        if (lLabel) lLabel.textContent = 'Semester —';

        document.getElementById('avgIP').textContent = '0.00';
        document.getElementById('totalA').textContent = '0';
        const aPercent = document.getElementById('totalAPercent');
        if (aPercent) aPercent.textContent = '0% dari total MK';
        return;
    }
    
    // Calculate stats
    const ips = semesters.map(s => parseFloat(s.ip)).filter(ip => ip > 0);
    if (ips.length === 0) {
        document.getElementById('highestIP').textContent = '0.00';
        document.getElementById('lowestIP').textContent = '0.00';
        document.getElementById('avgIP').textContent = '0.00';
        document.getElementById('totalA').textContent = '0';
        return;
    }
    const highestIP = Math.max(...ips);
    const lowestIP = Math.min(...ips);
    const avgIP = (ips.reduce((a, b) => a + b, 0) / ips.length).toFixed(2);
    
    // Count A grades
    let totalA = 0;
    let totalCourses = 0;
    semesters.forEach(sem => {
        sem.courses.forEach(course => {
            totalCourses++;
            if (course.grade >= 3.5) totalA++;
        });
    });
    
    const percentA = totalCourses > 0 ? ((totalA / totalCourses) * 100).toFixed(0) : 0;
    
    // Find which semester
    const highestSem = semesters.find(s => parseFloat(s.ip) === highestIP);
    const lowestSem = semesters.find(s => parseFloat(s.ip) === lowestIP);
    
    // Update display
    document.getElementById('highestIP').textContent = highestIP.toFixed(2);
    if (highestSem) {
        const hLabel = document.getElementById('highestIPLabel');
        if (hLabel) hLabel.textContent = `Semester ${highestSem.number}`;
    }
    
    document.getElementById('lowestIP').textContent = lowestIP.toFixed(2);
    if (lowestSem) {
        const lLabel = document.getElementById('lowestIPLabel');
        if (lLabel) lLabel.textContent = `Semester ${lowestSem.number}`;
    }
    
    document.getElementById('avgIP').textContent = avgIP;
    document.getElementById('totalA').textContent = totalA;
    const aPercent = document.getElementById('totalAPercent');
    if (aPercent) aPercent.textContent = `${percentA}% dari total MK`;
}

// ========================================
// FEATURE 2: EDIT MATA KULIAH
// ========================================

let editingSemesterIndex = null;
let editingCourseIndex = null;

function openEditCourseModal(semesterIndex, courseIndex) {
    editingSemesterIndex = semesterIndex;
    editingCourseIndex = courseIndex;
    
    const course = semesters[semesterIndex].courses[courseIndex];
    
    document.getElementById('editCourseName').value = course.name;
    document.getElementById('editCourseSKS').value = course.sks;
    document.getElementById('editCourseGrade').value = course.grade.toFixed(1);
    
    document.getElementById('editCourseModal').classList.add('show');
    document.getElementById('editCourseName').focus();
}

function closeEditCourseModal() {
    document.getElementById('editCourseModal').classList.remove('show');
    editingSemesterIndex = null;
    editingCourseIndex = null;
}

function saveEditCourse() {
    const name = document.getElementById('editCourseName').value.trim();
    const sks = parseInt(document.getElementById('editCourseSKS').value);
    const grade = parseFloat(document.getElementById('editCourseGrade').value);
    
    // Validation
    if (!name) {
        alert('Nama mata kuliah harus diisi!');
        return;
    }
    
    if (!sks || sks < 1 || sks > 6) {
        alert('SKS harus antara 1-6!');
        return;
    }
    
    if (grade === '' || isNaN(grade)) {
        alert('Pilih nilai mata kuliah!');
        return;
    }
    
    // Update course
    semesters[editingSemesterIndex].courses[editingCourseIndex] = {
        id: semesters[editingSemesterIndex].courses[editingCourseIndex].id,
        name: name,
        sks: sks,
        grade: grade,
        gradeLetter: gradeMap[grade.toFixed(1)]
    };
    
    // Recalculate IP
    calculateSemesterIP(editingSemesterIndex);
    
    saveData();
    render();
    closeEditCourseModal();
    
    showNotification('Mata kuliah berhasil diupdate!', 'success');
}

// ========================================
// FEATURE 3: SEMESTER NOTES & TAGS
// ========================================

let editingNotesSemesterIndex = null;

function openNotesModal(semesterIndex) {
    editingNotesSemesterIndex = semesterIndex;
    const semester = semesters[semesterIndex];
    
    document.getElementById('notesSemesterNum').textContent = semester.number;
    
    // Load existing notes if any
    document.getElementById('semesterNote').value = semester.note || '';
    document.getElementById('semesterTags').value = semester.tags ? semester.tags.join(', ') : '';
    document.getElementById('semesterLesson').value = semester.lesson || '';
    
    document.getElementById('notesModal').classList.add('show');
    document.getElementById('semesterNote').focus();
}

function closeNotesModal() {
    document.getElementById('notesModal').classList.remove('show');
    editingNotesSemesterIndex = null;
}

function saveSemesterNotes() {
    const note = document.getElementById('semesterNote').value.trim();
    const tagsStr = document.getElementById('semesterTags').value.trim();
    const lesson = document.getElementById('semesterLesson').value.trim();
    
    // Parse tags
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Save to semester
    semesters[editingNotesSemesterIndex].note = note;
    semesters[editingNotesSemesterIndex].tags = tags;
    semesters[editingNotesSemesterIndex].lesson = lesson;
    
    saveData();
    render();
    closeNotesModal();
    
    showNotification('Catatan semester berhasil disimpan!', 'success');
}

// renderSemesters consolidated and override removed.




// Call updated render on load
render();

// ========================================
// FEATURE 1: INTERACTIVE CHARTS
// ========================================

let ipChartInstance = null;
let gradeChartInstance = null;

function showCharts() {
    if (semesters.length === 0) {
        alert('Belum ada data untuk ditampilkan!\n\nTambahkan semester terlebih dahulu.');
        return;
    }
    
    document.getElementById('chartsModal').classList.add('show');
    
    // Delay untuk memastikan canvas sudah terlihat
    setTimeout(() => {
        renderCharts();
    }, 100);
}

function closeChartsModal() {
    document.getElementById('chartsModal').classList.remove('show');
}

function renderCharts() {
    // Data preparation
    const semesterLabels = semesters.map(s => `Sem ${s.number}`);
    const ipData = semesters.map(s => parseFloat(s.ip));
    
    // Count grades per semester
    const gradeData = {
        A: [],
        B: [],
        C: []
    };
    
    semesters.forEach(sem => {
        let countA = 0, countB = 0, countC = 0;
        sem.courses.forEach(course => {
            if (course.grade >= 3.5) countA++;
            else if (course.grade >= 2.5) countB++;
            else countC++;
        });
        gradeData.A.push(countA);
        gradeData.B.push(countB);
        gradeData.C.push(countC);
    });
    
    // Chart 1: IP Progress Line Chart
    const ctx1 = document.getElementById('ipChart').getContext('2d');
    
    if (ipChartInstance) {
        ipChartInstance.destroy();
    }
    
    ipChartInstance = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: semesterLabels,
            datasets: [{
                label: 'IP per Semester',
                data: ipData,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79,70,229,0.08)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'IP Progress per Semester',
                    font: { size: 13, weight: '700', family: 'Inter' },
                    color: '#111827',
                    padding: { bottom: 16 }
                },
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: '#f3f4f6' },
                    ticks: { font: { size: 12, family: 'Inter' }, color: '#6b7280' }
                },
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 4.0,
                    grid: { color: '#f3f4f6' },
                    ticks: {
                        stepSize: 0.5,
                        font: { size: 12, family: 'Inter' },
                        color: '#6b7280'
                    }
                }
            }
        }
    });

    
    // Chart 2: Grade Distribution Bar Chart
    const ctx2 = document.getElementById('gradeChart').getContext('2d');
    
    if (gradeChartInstance) {
        gradeChartInstance.destroy();
    }
    
    gradeChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: semesterLabels,
            datasets: [
                {
                    label: 'A/A-',
                    data: gradeData.A,
                    backgroundColor: '#10b981',
                    borderRadius: 8
                },
                {
                    label: 'B',
                    data: gradeData.B,
                    backgroundColor: '#3b82f6',
                    borderRadius: 8
                },
                {
                    label: 'C/D',
                    data: gradeData.C,
                    backgroundColor: '#f59e0b',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '📊 Distribusi Nilai per Semester',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}

// ========================================
// FEATURE 2: ACHIEVEMENT SYSTEM
// ========================================

const achievements = [
    {
        id: 'perfect_semester',
        icon: '🥇',
        name: 'Perfect Semester',
        desc: 'IP 4.0 di satu semester',
        check: () => semesters.some(s => parseFloat(s.ip) === 4.0)
    },
    {
        id: 'cum_laude',
        icon: '🎓',
        name: 'Cum Laude Track',
        desc: 'IPK 3.75 atau lebih',
        check: () => {
            const result = calculateIPK();
            return parseFloat(result.ipk) >= 3.75;
        }
    },
    {
        id: 'bookworm',
        icon: '📚',
        name: 'Bookworm',
        desc: 'Total 50+ mata kuliah',
        check: () => {
            let total = 0;
            semesters.forEach(s => total += s.courses.length);
            return total >= 50;
        }
    },
    {
        id: 'hot_streak',
        icon: '🔥',
        name: 'Hot Streak',
        desc: 'IP naik 3 semester berturut-turut',
        check: () => {
            let streak = 0;
            for (let i = 1; i < semesters.length; i++) {
                if (parseFloat(semesters[i].ip) > parseFloat(semesters[i-1].ip)) {
                    streak++;
                    if (streak >= 3) return true;
                } else {
                    streak = 0;
                }
            }
            return false;
        }
    },
    {
        id: 'all_as',
        icon: '⭐',
        name: "All A's",
        desc: 'Semua A di satu semester',
        check: () => semesters.some(s => {
            if (s.courses.length === 0) return false;
            return s.courses.every(c => c.grade >= 3.7);
        })
    },
    {
        id: 'consistency',
        icon: '💎',
        name: 'Consistency King',
        desc: 'IP stabil ±0.1 selama 4 semester',
        check: () => {
            if (semesters.length < 4) return false;
            const last4 = semesters.slice(-4).map(s => parseFloat(s.ip));
            const avg = last4.reduce((a,b) => a+b) / 4;
            return last4.every(ip => Math.abs(ip - avg) <= 0.1);
        }
    },
    {
        id: 'comeback',
        icon: '🚀',
        name: 'Comeback Kid',
        desc: 'IP naik 0.5+ setelah turun',
        check: () => {
            for (let i = 2; i < semesters.length; i++) {
                const prev = parseFloat(semesters[i-2].ip);
                const dropped = parseFloat(semesters[i-1].ip);
                const current = parseFloat(semesters[i].ip);
                if (dropped < prev && current >= dropped + 0.5) {
                    return true;
                }
            }
            return false;
        }
    },
    {
        id: 'overachiever',
        icon: '🎯',
        name: 'Overachiever',
        desc: '24+ SKS dengan IP 3.5+',
        check: () => semesters.some(s => s.totalSKS >= 24 && parseFloat(s.ip) >= 3.5)
    },
    {
        id: 'rising_star',
        icon: '🌟',
        name: 'Rising Star',
        desc: 'IP naik 0.5+ dari semester pertama',
        check: () => {
            if (semesters.length < 2) return false;
            const first = parseFloat(semesters[0].ip);
            const latest = parseFloat(semesters[semesters.length - 1].ip);
            return latest >= first + 0.5;
        }
    },
    {
        id: 'century',
        icon: '💯',
        name: 'Century Club',
        desc: '100+ SKS total',
        check: () => {
            const result = calculateIPK();
            return result.totalSKS >= 100;
        }
    },
    {
        id: 'brain',
        icon: '🧠',
        name: 'The Brain',
        desc: '10+ nilai A total',
        check: () => {
            let countA = 0;
            semesters.forEach(s => {
                s.courses.forEach(c => {
                    if (c.grade >= 3.7) countA++;
                });
            });
            return countA >= 10;
        }
    },
    {
        id: 'legendary',
        icon: '🏆',
        name: 'Legendary',
        desc: 'IPK 3.90+',
        check: () => {
            const result = calculateIPK();
            return parseFloat(result.ipk) >= 3.90;
        }
    }
];

function showAchievements() {
    document.getElementById('achievementsModal').classList.add('show');
    renderAchievements();
}

function closeAchievementsModal() {
    document.getElementById('achievementsModal').classList.remove('show');
}

function renderAchievements() {
    const unlockedAchievements = achievements.filter(a => a.check());
    const lockedAchievements = achievements.filter(a => !a.check());
    
    let html = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">
                🏆 ${unlockedAchievements.length}/${achievements.length} Unlocked
            </h3>
            <div style="background: var(--gray-100); height: 12px; border-radius: 999px; overflow: hidden;">
                <div style="width: ${(unlockedAchievements.length/achievements.length*100)}%; height: 100%; background: linear-gradient(90deg, var(--success), var(--primary)); transition: width 1s;"></div>
            </div>
        </div>
        <div class="achievements-grid">
    `;
    
    // Unlocked first
    unlockedAchievements.forEach(ach => {
        html += `
            <div class="achievement-item unlocked">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
                <div class="achievement-unlocked-badge">✅ Unlocked</div>
            </div>
        `;
    });
    
    // Then locked
    lockedAchievements.forEach(ach => {
        html += `
            <div class="achievement-item locked">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
                <div class="achievement-progress">🔒 Locked</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    document.getElementById('achievementsList').innerHTML = html;
}

function checkNewAchievements() {
    // Check if new achievement unlocked
    const savedAchievements = JSON.parse(localStorage.getItem('ipk_achievements') || '[]');
    const currentUnlocked = achievements.filter(a => a.check()).map(a => a.id);
    
    // Find newly unlocked
    const newUnlocked = currentUnlocked.filter(id => !savedAchievements.includes(id));
    
    if (newUnlocked.length > 0) {
        // Show popup & confetti for first new achievement
        const achievement = achievements.find(a => a.id === newUnlocked[0]);
        showAchievementPopup(achievement);
        triggerConfetti();
    }
    
    // Save current state
    localStorage.setItem('ipk_achievements', JSON.stringify(currentUnlocked));
}

function showAchievementPopup(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <h2>Achievement Unlocked!</h2>
        <p><strong>${achievement.name}</strong></p>
        <p>${achievement.desc}</p>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 3 + 2,
            rotation: Math.random() * 360
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((piece, index) => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
            ctx.restore();
            
            piece.x += piece.speedX;
            piece.y += piece.speedY;
            piece.rotation += 5;
            
            if (piece.y > canvas.height) {
                confettiPieces.splice(index, 1);
            }
        });
        
        if (confettiPieces.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.style.display = 'none';
        }
    }
    
    animate();
}

// ========================================
// FEATURE 3: SHARE CARDS GENERATOR
// ========================================

function showShareCard() {
    if (semesters.length === 0) {
        alert('Belum ada data untuk dibagikan!\n\nTambahkan semester terlebih dahulu.');
        return;
    }
    
    document.getElementById('shareModal').classList.add('show');
    renderShareCard();
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('show');
}

function renderShareCard() {
    const result = calculateIPK();
    const ipk = parseFloat(result.ipk);
    
    // Count A grades
    let totalA = 0;
    semesters.forEach(s => {
        s.courses.forEach(c => {
            if (c.grade >= 3.5) totalA++;
        });
    });
    
    const html = `
        <div class="share-card-content">
            <h2>🎓 MY GPA CARD</h2>
            <div class="share-card-label">IPK Kumulatif</div>
            <div class="share-card-ipk">${ipk}</div>
            <div class="share-card-label">${result.predikat}</div>
            
            <div class="share-card-stats">
                <div class="share-card-stat">
                    <span class="share-card-stat-value">${result.totalSKS}</span>
                    <span class="share-card-stat-label">Total SKS</span>
                </div>
                <div class="share-card-stat">
                    <span class="share-card-stat-value">${semesters.length}</span>
                    <span class="share-card-stat-label">Semesters</span>
                </div>
                <div class="share-card-stat">
                    <span class="share-card-stat-value">${totalA}</span>
                    <span class="share-card-stat-label">A Grades</span>
                </div>
            </div>
            
            <div class="share-card-footer">
                Made with Gradify ✨
            </div>
        </div>
    `;
    
    document.getElementById('shareCard').innerHTML = html;
}

function downloadShareCard() {
    const card = document.getElementById('shareCard');
    
    html2canvas(card, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `gradify-gpa-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        showNotification('Share card downloaded!', 'success');
    });
}

function copyShareText() {
    const result = calculateIPK();
    
    let text = `🎓 MY ACADEMIC PROGRESS\n\n`;
    text += `IPK: ${result.ipk}\n`;
    text += `Predikat: ${result.predikat}\n`;
    text += `Total SKS: ${result.totalSKS}\n`;
    text += `Semesters: ${semesters.length}\n\n`;
    
    semesters.forEach(s => {
        text += `Semester ${s.number}: IP ${s.ip} (${s.totalSKS} SKS)\n`;
    });
    
    text += `\nMade with Gradify ✨`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Text copied to clipboard!', 'success');
    });
}

// Hook into existing functions to check achievements
const originalSaveCourse = saveCourse;
saveCourse = function() {
    originalSaveCourse();
    setTimeout(checkNewAchievements, 500);
};

const originalSaveEditCourse = saveEditCourse;
saveEditCourse = function() {
    originalSaveEditCourse();
    setTimeout(checkNewAchievements, 500);
};


// ========================================
// STICKY NAVBAR SCROLL EFFECT
// ========================================

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.top-nav');
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});