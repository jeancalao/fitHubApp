// ============================================================
//  FITHUB - Exercise Library & Constants
// ============================================================

const OBJECTIVES = [
  { value: 'perder_peso',    label: 'Perder peso',    icon: 'fa-fire' },
  { value: 'ganhar_energia', label: 'Ganhar energia', icon: 'fa-bolt' },
  { value: 'ganhar_forca',   label: 'Ganhar força',   icon: 'fa-dumbbell' },
  { value: 'saude_geral',    label: 'Saúde geral',    icon: 'fa-heart' },
];

const LEVELS = [
  { value: 'sedentario',    label: 'Sedentário',    icon: 'fa-couch' },
  { value: 'iniciante',     label: 'Iniciante',     icon: 'fa-person-walking' },
  { value: 'intermediario', label: 'Intermediário', icon: 'fa-person-running' },
  { value: 'avancado',      label: 'Avançado', icon: 'fa-person-running' },
];

const EXERCISES_BODYWEIGHT = [
  {
    id: 'bw1',
    name: 'Caminhada Estacionária',
    description: 'Caminhe no mesmo lugar elevando bem os joelhos.',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80',
  },
  {
    id: 'bw2',
    name: 'Agachamento na Cadeira',
    description: 'Sente e levante de uma cadeira devagar e com controle.',
    imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&q=80',
  },
  {
    id: 'bw3',
    name: 'Flexão na Parede',
    description: 'Flexão de braços apoiado na parede, cotovelos perto do corpo.',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80',
  },
  {
    id: 'bw4',
    name: 'Polichinelos',
    description: 'Abra braços e pernas simultaneamente. Se precisar, faça sem salto.',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80',
  },
];

const EXERCISES_ELASTIC = [
  {
    id: 'el1',
    name: 'Agachamento com Elástico',
    description: 'Pise no elástico com os dois pés e agache mantendo as costas retas.',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  },
  {
    id: 'el2',
    name: 'Remada com Elástico',
    description: 'Puxe o elástico em direção ao corpo, contraindo as costas.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
  },
  {
    id: 'el3',
    name: 'Elevação Frontal',
    description: 'Eleve os braços esticados com o elástico até a altura dos ombros.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  },
  {
    id: 'el4',
    name: 'Ponte Pélvica com Elástico',
    description: 'Deite-se, coloque o elástico nas pernas e eleve o quadril.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  {
    id: 'el5',
    name: 'Puxador Frontal Articulado',
    description: 'Na máquina de polia, inclua a carga desejada e faça movimento frontal.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  {
    id: 'el6',
    name: 'Pull Down Articulado',
    description: 'Realize o Pull Down, puxando a barra contra o abdomen.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  {
    id: 'el7',
    name: 'Remada Baixa',
    description: 'Maquina de Remada, puxe o peso, contra o abdomen, pressionando a omoplata.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
];

const DAILY_TIPS = [
  { icon: 'fa-droplet',        text: 'Beba pelo menos 2 litros de água por dia. A hidratação é essencial para o desempenho e a recuperação.' },
  { icon: 'fa-moon',           text: 'Durma de 7 a 8 horas por noite. O sono é quando seu corpo se recupera e seus músculos crescem.' },
  { icon: 'fa-stopwatch',      text: 'Não esqueça de dar intervalos de pelo menos 1 minuto entre as séries para sua musculatura recuperar.' },
  { icon: 'fa-brain',          text: 'Cultive boas práticas mentais, como meditação e relaxamento. Uma mente sã potencializa o corpo saudável.' },
  { icon: 'fa-utensils',       text: 'Prefira refeições balanceadas com proteínas, carboidratos complexos e gorduras boas antes e após o treino.' },
  { icon: 'fa-person-walking', text: 'Nos dias de descanso, caminhadas leves mantêm o corpo ativo sem sobrecarregar os músculos.' },
  { icon: 'fa-heart-pulse',    text: 'Ouça seu corpo. Dor intensa diferente do cansaço normal é sinal para parar e descansar.' },
  { icon: 'fa-sun',            text: 'Treinar de manhã aumenta o metabolismo e melhora o humor ao longo de todo o dia.' },
  { icon: 'fa-apple-whole',    text: 'Uma fruta antes do treino fornece energia rápida e natural para você render mais nos exercícios.' },
  { icon: 'fa-rotate',         text: 'Consistência vale mais do que intensidade. Treinar regularmente 3× na semana supera treinos esporádicos.' },
  { icon: 'fa-lungs',          text: 'Respire corretamente: expire no esforço e inspire no retorno. Isso melhora o desempenho e evita tonturas.' },
  { icon: 'fa-person-stretching', text: 'Alongue-se por 5 minutos ao final do treino. Isso reduz o risco de lesões e a dor muscular tardia.' },
  { icon: 'fa-fire-flame-curved', text: 'O aquecimento é obrigatório! Dedique 5 minutos antes do treino para preparar articulações e músculos.' },
  { icon: 'fa-chart-line',     text: 'Registre sua evolução. Ver o progresso ao longo do tempo é um dos maiores motivadores para continuar.' },
  { icon: 'fa-mug-hot',        text: 'Evite cafeína em excesso. Prefira água ou chás naturais para manter a energia equilibrada durante o dia.' },
];

const OBJECTIVE_GREETINGS = {
  perder_peso:    'Bora queimar calorias! 🔥',
  ganhar_energia: 'Hora de se energizar! ⚡',
  ganhar_forca:   'Vamos ganhar força! 💪',
  saude_geral:    'Cuide-se hoje! ❤️',
};
