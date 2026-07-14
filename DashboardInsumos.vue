<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <!-- Header / Navbar -->
    <header class="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-bold tracking-wide">Controle de Insumos</h1>
        <p class="text-xs text-slate-300">Visão Geral da Produção</p>
      </div>
      <button class="bg-industrial-orange hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
        + Novo Item
      </button>
    </header>

    <main class="p-4 max-w-7xl mx-auto">
      <!-- Cards de Métricas Rápidas -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <span class="text-xs text-slate-500 font-semibold uppercase">Total Itens</span>
          <p class="text-2xl font-bold text-slate-800">{{ insumos.length }}</p>
        </div>
        <div class="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
          <span class="text-xs text-red-600 font-semibold uppercase">Estoque Crítico</span>
          <p class="text-2xl font-bold text-red-700">{{ itensCriticos }}</p>
        </div>
      </section>

      <!-- Barra de Pesquisa e Filtros -->
      <section class="mb-6 flex gap-2">
        <input 
          type="text" 
          v-model="busca"
          placeholder="Buscar insumo (ex: Esmalte, Argila)..." 
          class="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-industrial-orange text-slate-700 shadow-sm"
        />
      </section>

      <!-- Lista de Insumos (Grid Responsivo) -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="item in insumosFiltrados" 
          :key="item.id"
          class="bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          :class="item.quantidade <= item.minimo ? 'border-red-300' : 'border-slate-200'"
        >
          <!-- Cabeçalho do Card -->
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ item.categoria }}</span>
              <h3 class="text-lg font-bold text-slate-800 leading-tight">{{ item.nome }}</h3>
            </div>
            
            <!-- Badges Visuais -->
            <span v-if="item.quantidade <= item.minimo" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
              Crítico
            </span>
            <span v-else class="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              OK
            </span>
          </div>
          
          <!-- Quantidade e Mínimo -->
          <div class="my-4 flex items-baseline justify-between bg-slate-50 p-3 rounded-lg">
            <div>
              <span class="text-3xl font-extrabold" :class="item.quantidade <= item.minimo ? 'text-red-600' : 'text-slate-800'">
                {{ item.quantidade }}
              </span>
              <span class="text-xs text-slate-500 ml-1">{{ item.unidade }}</span>
            </div>
            <div class="text-right">
              <span class="block text-xs text-slate-400">Mínimo ideal</span>
              <span class="text-sm font-semibold text-slate-600">{{ item.minimo }} {{ item.unidade }}</span>
            </div>
          </div>

          <!-- Ações Rápidas (Botões grandes para toque na tela) -->
          <div class="mt-2 pt-3 border-t border-slate-100 flex gap-2">
            <button 
              @click="registrarSaida(item)"
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold py-3 px-3 rounded-lg transition-colors active:bg-slate-300 flex items-center justify-center gap-1"
            >
              <span class="text-lg leading-none">-</span> Saída
            </button>
            <button 
              @click="registrarEntrada(item)"
              class="flex-1 bg-industrial-orange hover:bg-orange-600 text-white text-sm font-bold py-3 px-3 rounded-lg transition-colors active:bg-orange-700 flex items-center justify-center gap-1"
            >
              <span class="text-lg leading-none">+</span> Entrada
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Toast de Notificação Simples -->
    <div v-if="notificacao.ativa" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium transition-all z-50">
      {{ notificacao.mensagem }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Estado da busca e notificações
const busca = ref('')
const notificacao = ref({ ativa: false, mensagem: '' })

// Mock de dados (Pronto para ser substituído pelas coleções do Firebase/Firestore)
const insumos = ref([
  { id: 1, nome: 'Esmalte Branco Brilhante', categoria: 'Esmaltes', quantidade: 450, minimo: 500, unidade: 'kg' },
  { id: 2, nome: 'Argila Micronizada M7', categoria: 'Matéria Prima', quantidade: 12000, minimo: 8000, unidade: 'kg' },
  { id: 3, nome: 'Corante Azul Cobalto', categoria: 'Aditivos', quantidade: 15, minimo: 50, unidade: 'kg' },
  { id: 4, nome: 'Óleo Lubrificante Engrenagem', categoria: 'Manutenção', quantidade: 40, minimo: 20, unidade: 'L' },
])

// Computed Properties
const itensCriticos = computed(() => {
  return insumos.value.filter(item => item.quantidade <= item.minimo).length
})

const insumosFiltrados = computed(() => {
  if (!busca.value) return insumos.value
  return insumos.value.filter(item => 
    item.nome.toLowerCase().includes(busca.value.toLowerCase()) || 
    item.categoria.toLowerCase().includes(busca.value.toLowerCase())
  )
})

// Métodos de Interação
const mostrarNotificacao = (msg) => {
  notificacao.value = { ativa: true, mensagem: msg }
  setTimeout(() => {
    notificacao.value.ativa = false
  }, 2500)
}

const registrarEntrada = (item) => {
  // Lógica para abrir modal ou incrementar direto. Aqui incrementamos +10 para demonstração.
  item.quantidade += 10
  mostrarNotificacao(`Entrada registrada para: ${item.nome}`)
  
  // Aqui você chamaria o updateDoc do Firebase Firestore
  // await updateDoc(doc(db, "insumos", item.id), { quantidade: item.quantidade })
}

const registrarSaida = (item) => {
  if (item.quantidade >= 10) {
    item.quantidade -= 10
    mostrarNotificacao(`Saída registrada para: ${item.nome}`)
    
    // Aqui você chamaria o updateDoc do Firebase Firestore
  } else {
    mostrarNotificacao(`Aviso: Estoque insuficiente de ${item.nome}!`)
  }
}
</script>

<style scoped>
/* Transições suaves e ajustes finos */
button {
  touch-action: manipulation; /* Evita zoom duplo em telas mobile */
}
</style>
