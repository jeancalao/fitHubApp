// ============================================================
//  Dashboard Screen (Home + Profile tabs)
// ============================================================

const DashboardScreen = {
  _activeTab: 'home',
  _tipIndex: 0,

  init() {
    this._activeTab = 'home';
    // Começa numa dica aleatória a cada sessão
    this._tipIndex = Math.floor(Math.random() * DAILY_TIPS.length);
    this._renderHome();
    this._bindNav();
    this._bindPremium();
  },

  _bindNav() {
    ['home', 'profile'].forEach(tab => {
      const btn = document.getElementById(`nav-${tab}`);
      const clone = btn.cloneNode(true);
      btn.replaceWith(clone);
      clone.addEventListener('click', () => this._switchTab(tab));
    });
  },

  _bindPremium() {
    const btn = document.getElementById('btn-premium');
    if (!btn) return;
    const clone = btn.cloneNode(true);
    btn.replaceWith(clone);
    clone.addEventListener('click', () => {
      App.showToast('Integração de pagamento em breve no V2 🚀');
    });
  },

  _switchTab(tab) {
    this._activeTab = tab;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    if (tab === 'profile') this._renderProfile();
    if (tab === 'home') this._renderHome();
  },

  // ----------------------------------------------------------
  //  HOME TAB
  // ----------------------------------------------------------
  _renderHome() {
    const profile = Storage.getProfile();
    const plan    = Storage.getPlan();
    const streak  = Workout.getStreak();

    const name = profile?.name?.trim();
    const greeting = name
      ? `Olá, ${name}! 💪`
      : (profile ? (OBJECTIVE_GREETINGS[profile.objective] || 'Olá, Campeão!') : 'Olá, Futuro Atleta!');
    document.getElementById('dash-greeting').textContent = greeting;
    document.getElementById('streak-count').textContent = streak;

    // Dica do dia — avança para a próxima a cada visita
    const tip = DAILY_TIPS[this._tipIndex % DAILY_TIPS.length];
    document.getElementById('tip-icon').className = `fas ${tip.icon} tip-icon`;
    document.getElementById('tip-text').textContent = tip.text;
    this._tipIndex = (this._tipIndex + 1) % DAILY_TIPS.length;

    // Botão "Novo Treino"
    const newBtn = document.getElementById('btn-new-workout');
    const newClone = newBtn.cloneNode(true);
    newBtn.replaceWith(newClone);
    newClone.addEventListener('click', () => App.show('workoutEditor', { day: null }));

    const list = document.getElementById('workout-list');
    list.innerHTML = '';
    if (!plan) return;

    plan.workoutDays.forEach(day => {
      const totalSec = day.exercises.reduce((s, e) => s + e.durationSeconds, 0);
      const card = document.createElement('div');
      card.className = `workout-card${day.isCompleted ? ' completed' : ''}`;
      card.innerHTML = `
        <div class="workout-status-icon ${day.isCompleted ? 'done' : 'pending'}">
          <i class="fas ${day.isCompleted ? 'fa-circle-check' : 'fa-dumbbell'}"></i>
        </div>
        <div class="workout-card-info">
          <h3>${day.title}</h3>
          <p>${day.exercises.length} exercícios • ${Workout.formatDuration(totalSec)}</p>
        </div>
        <button class="btn-edit-card" title="Editar treino">
          <i class="fas fa-pen"></i>
        </button>
        <i class="fas fa-chevron-right workout-card-arrow"></i>
      `;
      card.querySelector('.btn-edit-card').addEventListener('click', (e) => {
        e.stopPropagation();
        App.show('workoutEditor', { day });
      });
      card.addEventListener('click', () => App.show('workoutDetail', { day }));
      list.appendChild(card);
    });
  },

  // ----------------------------------------------------------
  //  PROFILE TAB — view
  // ----------------------------------------------------------
  _renderProfile() {
    const profile = Storage.getProfile();
    const photo   = Storage.getPhoto();

    // Photo
    const img      = document.getElementById('profile-photo-img');
    const fallback = document.getElementById('profile-photo-fallback');
    if (photo) {
      img.src = photo;
      img.style.display = 'block';
      fallback.style.display = 'none';
    } else {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    }

    // Name & badge
    document.getElementById('profile-name').textContent  = profile?.name?.trim() || 'Sem nome';
    document.getElementById('profile-level-badge').textContent = profile?.levelLabel || '';

    // Edit button
    const editBtn = document.getElementById('btn-edit-profile');
    const editClone = editBtn.cloneNode(true);
    editBtn.replaceWith(editClone);
    editClone.addEventListener('click', () => this._openEditModal());

    // Info cards
    const cards = document.getElementById('profile-cards');
    cards.innerHTML = '';
    if (!profile) return;

    const items = [
      { icon: 'fa-bullseye',       label: 'Objetivo',   value: profile.objectiveLabel },
      { icon: 'fa-chart-bar',      label: 'Nível',      value: profile.levelLabel },
      { icon: 'fa-cake-candles',   label: 'Idade',      value: `${profile.age} anos` },
      { icon: 'fa-ruler-combined', label: 'Medidas',    value: `${profile.height} cm • ${profile.weight} kg` },
      { icon: 'fa-clock',          label: 'Tempo',      value: `${profile.availableTimeMinutes} min/dia` },
      { icon: 'fa-calendar',       label: 'Frequência', value: '3× por semana' },
    ];

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'profile-info-card';
      div.innerHTML = `
        <i class="fas ${item.icon}"></i>
        <div class="info-text">
          <label>${item.label}</label>
          <span>${item.value}</span>
        </div>`;
      cards.appendChild(div);
    });
  },

  // ----------------------------------------------------------
  //  EDIT PROFILE MODAL
  // ----------------------------------------------------------
  _openEditModal() {
    const profile = Storage.getProfile() || {};
    const photo   = Storage.getPhoto();

    this._edit = {
      name:                 profile.name || '',
      objective:            profile.objective || null,
      objectiveLabel:       profile.objectiveLabel || null,
      level:                profile.level || null,
      levelLabel:           profile.levelLabel || null,
      age:                  profile.age || 30,
      weight:               profile.weight || 70,
      height:               profile.height || 170,
      availableTimeMinutes: profile.availableTimeMinutes || 20,
      equipment:            [...(profile.equipment || [])],
      photoPending:         null,
    };

    const body = document.getElementById('edit-modal-body');
    body.innerHTML = '';
    body.appendChild(this._buildEditForm(photo));

    document.getElementById('edit-profile-modal').classList.remove('hidden');
    body.scrollTop = 0;

    const closeBtn = document.getElementById('btn-close-edit');
    const closeClone = closeBtn.cloneNode(true);
    closeBtn.replaceWith(closeClone);
    closeClone.addEventListener('click', () => {
      document.getElementById('edit-profile-modal').classList.add('hidden');
    });

    const modal = document.getElementById('edit-profile-modal');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
  },

  _buildEditForm(currentPhoto) {
    const frag = document.createDocumentFragment();

    // ---- Photo ----
    const photoSection = document.createElement('div');
    photoSection.className = 'edit-section';
    photoSection.innerHTML = `
      <h3 class="edit-section-title">Foto de perfil</h3>
      <div class="edit-photo-wrap">
        <div class="edit-photo-circle">
          <img id="edit-photo-preview" src="${currentPhoto || ''}"
               style="${currentPhoto ? '' : 'display:none;'}" alt="preview" />
          <div class="edit-photo-fallback" id="edit-photo-fallback"
               style="${currentPhoto ? 'display:none;' : ''}">
            <i class="fas fa-user"></i>
          </div>
          <label class="edit-photo-btn" for="edit-photo-input">
            <i class="fas fa-camera"></i>
          </label>
          <input type="file" id="edit-photo-input" accept="image/*" style="display:none;" />
        </div>
        <button class="btn-remove-photo ${currentPhoto ? '' : 'hidden'}" id="btn-remove-photo">
          <i class="fas fa-trash"></i> Remover foto
        </button>
      </div>`;
    frag.appendChild(photoSection);

    setTimeout(() => {
      document.getElementById('edit-photo-input')
        ?.addEventListener('change', (e) => this._handlePhotoUpload(e));
      document.getElementById('btn-remove-photo')
        ?.addEventListener('click', () => this._removePhoto());
    }, 0);

    // ---- Name ----
    const nameSection = document.createElement('div');
    nameSection.className = 'edit-section';
    nameSection.innerHTML = `
      <h3 class="edit-section-title">Nome</h3>
      <input class="edit-text-input" id="edit-name" type="text"
             placeholder="Como você quer ser chamado?" maxlength="40"
             value="${this._edit.name}" />`;
    frag.appendChild(nameSection);

    // ---- Objective ----
    frag.appendChild(this._buildEditOptions('Objetivo', 'edit-objectives', OBJECTIVES,
      'objective', 'objectiveLabel'));

    // ---- Level ----
    frag.appendChild(this._buildEditOptions('Nível', 'edit-levels', LEVELS,
      'level', 'levelLabel'));

    // ---- Physical sliders ----
    const physSection = document.createElement('div');
    physSection.className = 'edit-section';
    physSection.innerHTML = `
      <h3 class="edit-section-title">Dados físicos</h3>
      ${this._sliderHTML('edit-age',    'Idade',  18, 80,  this._edit.age,    'anos')}
      ${this._sliderHTML('edit-weight', 'Peso',   40, 150, this._edit.weight, 'kg')}
      ${this._sliderHTML('edit-height', 'Altura', 140, 220, this._edit.height, 'cm')}`;
    frag.appendChild(physSection);

    setTimeout(() => {
      [['edit-age','age'],['edit-weight','weight'],['edit-height','height']].forEach(([id, field]) => {
        const input = document.getElementById(id);
        const valEl = document.getElementById(`${id}-val`);
        input?.addEventListener('input', () => {
          this._edit[field] = Number(input.value);
          valEl.textContent = input.value;
        });
      });
    }, 0);

    // ---- Routine ----
    const routineSection = document.createElement('div');
    routineSection.className = 'edit-section';
    routineSection.innerHTML = `
      <h3 class="edit-section-title">Rotina de treino</h3>
      ${this._sliderHTML('edit-time', 'Tempo disponível', 10, 60, this._edit.availableTimeMinutes, 'min')}
      <p class="edit-sublabel">Equipamentos</p>
      <div class="edit-options" id="edit-equipment"></div>`;
    frag.appendChild(routineSection);

    setTimeout(() => {
      const timeInput = document.getElementById('edit-time');
      const timeVal   = document.getElementById('edit-time-val');
      if (timeInput) {
        timeInput.step = '10';
        timeInput.addEventListener('input', () => {
          const v = Math.round(Number(timeInput.value) / 10) * 10;
          this._edit.availableTimeMinutes = v;
          timeVal.textContent = v;
        });
      }
      const wrap = document.getElementById('edit-equipment');
      [{ value:'nenhum', label:'Peso do corpo', icon:'fa-person' },
       { value:'elastico', label:'Elásticos / Halteres', icon:'fa-circle' }]
        .forEach(eq => {
          const btn = document.createElement('button');
          btn.className = `edit-option-btn ${this._edit.equipment.includes(eq.value) ? 'selected' : ''}`;
          btn.dataset.value = eq.value;
          btn.innerHTML = `<i class="fas ${eq.icon}"></i><span>${eq.label}</span>`;
          btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            this._edit.equipment = Array.from(
              wrap.querySelectorAll('.edit-option-btn.selected')
            ).map(b => b.dataset.value);
          });
          wrap?.appendChild(btn);
        });
    }, 0);

    // ---- Save ----
    const saveSection = document.createElement('div');
    saveSection.className = 'edit-section';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-primary full-width';
    saveBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> Salvar alterações';
    saveBtn.addEventListener('click', () => this._saveEditedProfile());
    saveSection.appendChild(saveBtn);
    frag.appendChild(saveSection);

    return frag;
  },

  _buildEditOptions(title, id, options, field, labelField) {
    const section = document.createElement('div');
    section.className = 'edit-section';
    section.innerHTML = `<h3 class="edit-section-title">${title}</h3>
      <div class="edit-options" id="${id}"></div>`;

    setTimeout(() => {
      const wrap = document.getElementById(id);
      if (!wrap) return;
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `edit-option-btn ${this._edit[field] === opt.value ? 'selected' : ''}`;
        btn.dataset.value = opt.value;
        btn.innerHTML = `<i class="fas ${opt.icon}"></i><span>${opt.label}</span>`;
        btn.addEventListener('click', () => {
          wrap.querySelectorAll('.edit-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this._edit[field]      = opt.value;
          this._edit[labelField] = opt.label;
        });
        wrap.appendChild(btn);
      });
    }, 0);

    return section;
  },

  _sliderHTML(id, label, min, max, val, unit) {
    return `
      <div class="slider-group">
        <div class="slider-label">
          <span>${label}</span>
          <span class="slider-value"><span id="${id}-val">${val}</span> ${unit}</span>
        </div>
        <input type="range" id="${id}" min="${min}" max="${max}" value="${val}" step="1" />
      </div>`;
  },

  _handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
        else                { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.75);
        this._edit.photoPending = base64;
        const preview  = document.getElementById('edit-photo-preview');
        const fallback = document.getElementById('edit-photo-fallback');
        const rmBtn    = document.getElementById('btn-remove-photo');
        preview.src = base64; preview.style.display = 'block';
        fallback.style.display = 'none';
        rmBtn?.classList.remove('hidden');
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  },

  _removePhoto() {
    this._edit.photoPending = 'REMOVE';
    document.getElementById('edit-photo-preview').style.display = 'none';
    document.getElementById('edit-photo-fallback').style.display = 'flex';
    document.getElementById('btn-remove-photo')?.classList.add('hidden');
  },

  _saveEditedProfile() {
    const nameInput = document.getElementById('edit-name');
    if (nameInput) this._edit.name = nameInput.value.trim();

    const oldProfile = Storage.getProfile() || {};
    const planChanged =
      this._edit.objective             !== oldProfile.objective ||
      this._edit.level                 !== oldProfile.level ||
      this._edit.availableTimeMinutes  !== oldProfile.availableTimeMinutes ||
      JSON.stringify(this._edit.equipment) !== JSON.stringify(oldProfile.equipment);

    const updated = {
      ...oldProfile,
      name:                 this._edit.name,
      objective:            this._edit.objective,
      objectiveLabel:       this._edit.objectiveLabel,
      level:                this._edit.level,
      levelLabel:           this._edit.levelLabel,
      age:                  this._edit.age,
      weight:               this._edit.weight,
      height:               this._edit.height,
      availableTimeMinutes: this._edit.availableTimeMinutes,
      equipment: this._edit.equipment.length ? this._edit.equipment : ['nenhum'],
    };

    Storage.saveProfile(updated);

    if (this._edit.photoPending === 'REMOVE') Storage.removePhoto();
    else if (this._edit.photoPending)          Storage.savePhoto(this._edit.photoPending);

    if (planChanged) {
      Workout.generatePlan(updated);
      App.showToast('Perfil e plano de treino atualizados! 🏋️');
    } else {
      App.showToast('Perfil salvo com sucesso!');
    }

    document.getElementById('edit-profile-modal').classList.add('hidden');
    this._renderProfile();
    this._renderHome();
  },
};
