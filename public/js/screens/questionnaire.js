// ============================================================
//  Questionnaire Screen (4 steps)
// ============================================================

const QuestionnaireScreen = {
  _step: 0,
  _profile: {
    objective: null,
    objectiveLabel: null,
    level: null,
    levelLabel: null,
    age: 30,
    weight: 70,
    height: 170,
    availableTimeMinutes: 20,
    equipment: [],
  },

  init() {
    this._step = 0;
    this._profile = {
      objective: null, objectiveLabel: null,
      level: null, levelLabel: null,
      age: 30, weight: 70, height: 170,
      availableTimeMinutes: 20, equipment: [],
    };
    this._renderStep();
  },

  _setProgress() {
    const pct = ((this._step + 1) / 4) * 100;
    document.getElementById('q-progress-bar').style.width = pct + '%';
    document.getElementById('q-progress-label').textContent = `Passo ${this._step + 1} de 4`;
  },

  _renderStep() {
    this._setProgress();
    const body = document.getElementById('q-body');
    body.innerHTML = '';

    switch (this._step) {
      case 0: body.appendChild(this._buildStep1()); break;
      case 1: body.appendChild(this._buildStep2()); break;
      case 2: body.appendChild(this._buildStep3()); break;
      case 3: body.appendChild(this._buildStep4()); break;
    }
  },

  _buildStep1() {
    const wrap = document.createElement('div');
    wrap.className = 'q-step';
    wrap.innerHTML = `<h2>Qual seu objetivo principal?</h2>
      <div class="q-options" id="q-options-1"></div>`;

    const opts = wrap.querySelector('#q-options-1');
    OBJECTIVES.forEach(obj => {
      const btn = document.createElement('button');
      btn.className = 'q-option';
      btn.innerHTML = `<i class="fas ${obj.icon}"></i> ${obj.label}`;
      btn.addEventListener('click', () => {
        this._profile.objective = obj.value;
        this._profile.objectiveLabel = obj.label;
        this._step = 1;
        this._renderStep();
      });
      opts.appendChild(btn);
    });
    return wrap;
  },

  _buildStep2() {
    const wrap = document.createElement('div');
    wrap.className = 'q-step';
    wrap.innerHTML = `<h2>Como você avalia seu nível atual?</h2>
      <div class="q-options" id="q-options-2"></div>`;

    const opts = wrap.querySelector('#q-options-2');
    LEVELS.forEach(lvl => {
      const btn = document.createElement('button');
      btn.className = 'q-option';
      btn.innerHTML = `<i class="fas ${lvl.icon}"></i> ${lvl.label}`;
      btn.addEventListener('click', () => {
        this._profile.level = lvl.value;
        this._profile.levelLabel = lvl.label;
        this._step = 2;
        this._renderStep();
      });
      opts.appendChild(btn);
    });
    return wrap;
  },

  _buildStep3() {
    const wrap = document.createElement('div');
    wrap.className = 'q-step';
    wrap.innerHTML = `
      <h2>Seus dados físicos</h2>
      ${this._sliderHTML('age',    'Idade',  18, 80,  this._profile.age,    'anos')}
      ${this._sliderHTML('weight', 'Peso',   40, 150, this._profile.weight, 'kg')}
      ${this._sliderHTML('height', 'Altura', 140, 220, this._profile.height, 'cm')}
      <button class="btn-primary full-width" id="q-step3-next">Continuar</button>
    `;

    // Bind slider live updates
    ['age', 'weight', 'height'].forEach(field => {
      const input = wrap.querySelector(`#slider-${field}`);
      const valEl = wrap.querySelector(`#val-${field}`);
      input.addEventListener('input', () => {
        this._profile[field] = Number(input.value);
        valEl.textContent = input.value;
      });
    });

    wrap.querySelector('#q-step3-next').addEventListener('click', () => {
      this._step = 3;
      this._renderStep();
    });

    return wrap;
  },

  _sliderHTML(id, label, min, max, val, unit) {
    return `
      <div class="slider-group">
        <div class="slider-label">
          <span>${label}</span>
          <span class="slider-value"><span id="val-${id}">${val}</span> ${unit}</span>
        </div>
        <input type="range" id="slider-${id}" min="${min}" max="${max}" value="${val}" step="1" />
      </div>`;
  },

  _buildStep4() {
    const wrap = document.createElement('div');
    wrap.className = 'q-step';
    wrap.innerHTML = `
      <h2>Sua rotina de treino</h2>
      ${this._sliderHTML('time', 'Tempo disponível', 10, 60, this._profile.availableTimeMinutes, 'min')}
      <p style="font-size:15px;font-weight:600;margin-bottom:12px;">Equipamentos disponíveis</p>
      <div class="equipment-group" id="equipment-group"></div>
      <button class="btn-primary full-width" id="q-generate">Gerar meu Plano!</button>
    `;

    const timeInput = wrap.querySelector('#slider-time');
    const timeVal   = wrap.querySelector('#val-time');
    timeInput.step  = '10';
    timeInput.addEventListener('input', () => {
      const v = Math.round(Number(timeInput.value) / 10) * 10;
      this._profile.availableTimeMinutes = v;
      timeVal.textContent = v;
    });

    const equipGroup = wrap.querySelector('#equipment-group');
    const equipOptions = [
      { value: 'nenhum',   label: 'Nenhum (Peso do corpo)', icon: 'fa-person' },
      { value: 'elastico', label: 'Elásticos / Halteres leves', icon: 'fa-circle' },
    ];
    equipOptions.forEach(eq => {
      const div = document.createElement('div');
      div.className = 'equipment-option';
      div.dataset.value = eq.value;
      div.innerHTML = `
        <div class="equipment-check"><i class="fas fa-check"></i></div>
        <i class="fas ${eq.icon}"></i>
        <span>${eq.label}</span>`;
      div.addEventListener('click', () => {
        div.classList.toggle('selected');
        const sel = equipGroup.querySelectorAll('.equipment-option.selected');
        this._profile.equipment = Array.from(sel).map(el => el.dataset.value);
      });
      equipGroup.appendChild(div);
    });

    wrap.querySelector('#q-generate').addEventListener('click', () => {
      // Default to bodyweight if nothing selected
      if (!this._profile.equipment.length) {
        this._profile.equipment = ['nenhum'];
      }
      App.show('planGeneration', { profile: { ...this._profile } });
    });

    return wrap;
  },
};
