// ============================================================
//  Workout Editor Screen
// ============================================================

const WorkoutEditorScreen = {
  _day: null,
  _isNew: false,

  init({ day }) {
    this._isNew = !day;
    // deep-clone so edits don't affect live plan until Save
    this._day = day
      ? JSON.parse(JSON.stringify(day))
      : {
          id: `day_custom_${Date.now()}`,
          dayNumber: 0,
          title: 'Novo Treino',
          exercises: [],
          isCompleted: false,
        };

    document.getElementById('we-screen-title').textContent =
      this._isNew ? 'Novo Treino' : 'Editar Treino';
    document.getElementById('we-name-input').value = this._day.title;

    // Delete button — only for existing workouts, and only if plan has >1 day
    const delBtn = document.getElementById('we-btn-delete');
    const plan = Storage.getPlan();
    const canDelete = !this._isNew && plan && plan.workoutDays.length > 1;
    delBtn.classList.toggle('hidden', !canDelete);
    const delClone = delBtn.cloneNode(true);
    delBtn.replaceWith(delClone);
    delClone.classList.toggle('hidden', !canDelete);
    delClone.addEventListener('click', () => this._confirmDelete());

    this._renderExList();
    this._bindControls();
  },

  // ----------------------------------------------------------
  //  Exercise list rendering
  // ----------------------------------------------------------
  _renderExList() {
    const list  = document.getElementById('we-exercise-list');
    const count = document.getElementById('we-ex-count');
    list.innerHTML = '';
    count.textContent = `(${this._day.exercises.length})`;

    if (!this._day.exercises.length) {
      list.innerHTML = `<p class="we-empty">Nenhum exercício. Adicione pelo menos um.</p>`;
      return;
    }

    this._day.exercises.forEach((ex, idx) => {
      const mins = ex.durationSeconds >= 60
        ? `${Math.floor(ex.durationSeconds / 60)}min ${ex.durationSeconds % 60 ? ex.durationSeconds % 60 + 's' : ''}`.trim()
        : `${ex.durationSeconds}s`;

      const item = document.createElement('div');
      item.className = 'we-ex-item';
      item.dataset.idx = idx;
      item.innerHTML = `
        <div class="we-ex-drag"><i class="fas fa-grip-vertical"></i></div>
        <div class="we-ex-info">
          <span class="we-ex-name">${ex.name}</span>
          <button class="we-ex-dur-btn" data-action="edit-dur" data-idx="${idx}">
            <i class="fas fa-clock"></i> ${mins}
          </button>
        </div>
        <div class="we-ex-actions">
          <button class="we-ex-btn" data-action="up"   data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>
            <i class="fas fa-chevron-up"></i>
          </button>
          <button class="we-ex-btn" data-action="down" data-idx="${idx}" ${idx === this._day.exercises.length - 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-down"></i>
          </button>
          <button class="we-ex-btn danger" data-action="delete" data-idx="${idx}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      list.appendChild(item);
    });

    // Single delegated listener on the list
    list.onclick = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const idx    = Number(btn.dataset.idx);
      if (action === 'up')       this._moveEx(idx, -1);
      if (action === 'down')     this._moveEx(idx,  1);
      if (action === 'delete')   this._deleteEx(idx);
      if (action === 'edit-dur') this._editDuration(idx);
    };
  },

  _moveEx(idx, dir) {
    const arr = this._day.exercises;
    const to  = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    this._renderExList();
  },

  _deleteEx(idx) {
    this._day.exercises.splice(idx, 1);
    this._renderExList();
  },

  _editDuration(idx) {
    const ex = this._day.exercises[idx];
    DurationModal.open(ex.name, ex.durationSeconds, (newSecs) => {
      ex.durationSeconds = newSecs;
      this._renderExList();
    });
  },

  // ----------------------------------------------------------
  //  Controls
  // ----------------------------------------------------------
  _bindControls() {
    const backBtn = document.getElementById('we-btn-back');
    const backClone = backBtn.cloneNode(true);
    backBtn.replaceWith(backClone);
    backClone.addEventListener('click', () => App.show('dashboard'));

    const saveBtn = document.getElementById('we-btn-save');
    const saveClone = saveBtn.cloneNode(true);
    saveBtn.replaceWith(saveClone);
    saveClone.addEventListener('click', () => this._save());

    const addBtn = document.getElementById('we-btn-add-ex');
    const addClone = addBtn.cloneNode(true);
    addBtn.replaceWith(addClone);
    addClone.addEventListener('click', () => {
      ExercisePicker.open((ex) => {
        this._day.exercises.push({ ...ex });
        this._renderExList();
      });
    });
  },

  _save() {
    const nameVal = document.getElementById('we-name-input').value.trim();
    if (!nameVal)                     { App.showToast('Informe um nome para o treino.'); return; }
    if (!this._day.exercises.length)  { App.showToast('Adicione pelo menos 1 exercício.'); return; }

    this._day.title = nameVal;
    if (this._isNew) Workout.addWorkoutDay(this._day);
    else             Workout.updateWorkoutDay(this._day);

    App.showToast(this._isNew ? 'Treino criado! 🎉' : 'Treino salvo! ✅');
    App.show('dashboard');
  },

  _confirmDelete() {
    App.showModal({
      icon: 'fa-triangle-exclamation',
      title: 'Excluir treino?',
      message: `"${this._day.title}" será removido permanentemente.`,
      btnLabel: 'Excluir',
      onClose: () => {
        Workout.removeWorkoutDay(this._day.id);
        App.showToast('Treino excluído.');
        App.show('dashboard');
      },
    });
  },
};

// ============================================================
//  Duration Modal — inline editor for exercise duration
// ============================================================
const DurationModal = {
  open(exerciseName, currentSecs, onSave) {
    const currentMins = Math.max(1, Math.round(currentSecs / 60));

    // Reuse the existing modal infrastructure
    const overlay  = document.getElementById('modal-overlay');
    const iconEl   = document.getElementById('modal-icon-i');
    const titleEl  = document.getElementById('modal-title');
    const msgEl    = document.getElementById('modal-message');
    const btn      = document.getElementById('modal-btn');

    iconEl.className = 'fas fa-clock';
    titleEl.textContent = 'Duração do exercício';

    // Replace message element with an input
    msgEl.innerHTML = `
      <span style="font-size:14px;color:#757575;display:block;margin-bottom:12px;">${exerciseName}</span>
      <div style="display:flex;align-items:center;gap:10px;justify-content:center;">
        <input id="dur-input" type="number" min="1" max="60" value="${currentMins}"
          style="width:80px;text-align:center;font-size:22px;font-weight:700;
                 border:2px solid #4CAF50;border-radius:8px;padding:8px;" />
        <span style="font-size:16px;color:#757575;">minutos</span>
      </div>`;

    btn.textContent = 'Confirmar';
    overlay.classList.remove('hidden');

    const close = () => {
      overlay.classList.add('hidden');
      btn.removeEventListener('click', close);
      // Restore original message element
      msgEl.innerHTML = '';
    };

    btn.addEventListener('click', () => {
      const input = document.getElementById('dur-input');
      const mins  = parseInt(input.value, 10);
      if (isNaN(mins) || mins < 1) { App.showToast('Informe um valor válido (mínimo 1 min).'); return; }
      close();
      onSave(mins * 60);
    });
  },
};

// ============================================================
//  Exercise Picker — bottom-sheet modal
// ============================================================
const ExercisePicker = {
  _onSelect: null,

  open(onSelect) {
    this._onSelect = onSelect;
    this._render('library');

    const modal = document.getElementById('exercise-picker-modal');
    modal.classList.remove('hidden');

    // Tabs
    modal.querySelectorAll('.picker-tab').forEach(tab => {
      const clone = tab.cloneNode(true);
      tab.replaceWith(clone);
    });
    modal.querySelectorAll('.picker-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.picker-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._render(tab.dataset.tab);
      });
    });

    // Close
    const closeBtn = document.getElementById('btn-close-picker');
    const closeClone = closeBtn.cloneNode(true);
    closeBtn.replaceWith(closeClone);
    closeClone.addEventListener('click', () => modal.classList.add('hidden'));
    modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
  },

  _render(tab) {
    const body = document.getElementById('picker-body');
    body.innerHTML = '';
    if (tab === 'library') this._renderLibrary(body);
    else                   this._renderCustom(body);
  },

  _renderLibrary(body) {
    const all = [...EXERCISES_BODYWEIGHT, ...EXERCISES_ELASTIC];
    const listEl = document.createElement('div');
    listEl.className = 'picker-ex-list';

    all.forEach(ex => {
      const item = document.createElement('button');
      item.className = 'picker-ex-item';
      item.innerHTML = `
        <div class="picker-ex-info">
          <span class="picker-ex-name">${ex.name}</span>
          <span class="picker-ex-desc">${ex.description}</span>
        </div>
        <i class="fas fa-plus picker-add-icon"></i>
      `;
      item.addEventListener('click', () => {
        const profile = Storage.getProfile();
        const defSec  = profile ? Math.floor((profile.availableTimeMinutes * 60) / 4) : 60;
        this._onSelect({ ...ex, durationSeconds: defSec });
        document.getElementById('exercise-picker-modal').classList.add('hidden');
      });
      listEl.appendChild(item);
    });

    body.appendChild(listEl);
  },

  _renderCustom(body) {
    body.innerHTML = `
      <div class="edit-section">
        <h3 class="edit-section-title">Nome do exercício</h3>
        <input class="edit-text-input" id="custom-ex-name" type="text"
               placeholder="Ex: Prancha, Burpee..." maxlength="50" />
      </div>
      <div class="edit-section">
        <h3 class="edit-section-title">Descrição (opcional)</h3>
        <input class="edit-text-input" id="custom-ex-desc" type="text"
               placeholder="Como executar o exercício" maxlength="100" />
      </div>
      <div class="edit-section">
        <h3 class="edit-section-title">Duração (minutos)</h3>
        <input class="edit-text-input" id="custom-ex-dur" type="number"
               placeholder="Ex: 2" min="1" max="60" value="2" />
      </div>
      <div class="edit-section">
        <button class="btn-primary full-width" id="btn-add-custom-ex">
          <i class="fas fa-plus"></i> Adicionar ao Treino
        </button>
      </div>`;

    document.getElementById('btn-add-custom-ex').addEventListener('click', () => {
      const name = document.getElementById('custom-ex-name').value.trim();
      const desc = document.getElementById('custom-ex-desc').value.trim();
      const dur  = parseInt(document.getElementById('custom-ex-dur').value, 10);

      if (!name)              { App.showToast('Informe o nome do exercício.'); return; }
      if (isNaN(dur) || dur < 1) { App.showToast('Informe uma duração válida.'); return; }

      this._onSelect({
        id: `custom_${Date.now()}`,
        name,
        description: desc || 'Exercício personalizado.',
        durationSeconds: dur * 60,
        imageUrl: null,
        isCustom: true,
      });
      document.getElementById('exercise-picker-modal').classList.add('hidden');
    });
  },
};
