<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { libros, config, loggedUser, actions } from '$lib/store.js';

  let search = '';
  let selectedCategory = '';
  let selectedBook = null;
  let showModal = false;

  // Notificaciones
  let toastMessage = '';
  let toastType = 'success';
  let toastVisible = false;

  function triggerToast(msg, type = 'success') {
    toastMessage = msg;
    toastType = type;
    toastVisible = true;
    setTimeout(() => toastVisible = false, 3500);
  }

  // Suscribirse a URL Params para búsquedas directas
  onMount(() => {
    const s = $page.url.searchParams.get('search');
    if (s) search = s;
  });

  // Categorías únicas
  $: categorias = [...new Set($libros.map(l => l.categoria))];

  // Filtrado reactivo
  $: filteredBooks = $libros.filter(l => {
    const matchesSearch = l.titulo.toLowerCase().includes(search.toLowerCase()) || 
                          l.autor.toLowerCase().includes(search.toLowerCase()) || 
                          l.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === '' || l.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  function openBookModal(libro) {
    selectedBook = libro;
    showModal = true;
  }

  function confirmLoan() {
    if (!selectedBook) return;
    const res = actions.solicitarPrestamo(selectedBook.id, $loggedUser.id);
    showModal = false;

    if (res.success) {
      triggerToast("¡Préstamo concedido! Retira tu libro en la compuerta inteligente.", "success");
    } else {
      triggerToast(res.message, "danger");
    }
  }
</script>

<svelte:head>
  <title>Catálogo de Libros - Biblioteca Inteligente ULEAM</title>
</svelte:head>

<!-- Filtros de búsqueda -->
<div class="dashboard-card" style="padding: 20px; margin-bottom: 25px;">
  <div style="display: flex; gap: 15px; flex-wrap: wrap;">
    <div style="flex-grow: 1; min-width: 250px;">
      <input type="text" bind:value={search} placeholder="Buscar por título, autor o categoría...">
    </div>
    <div style="width: 200px;">
      <select bind:value={selectedCategory}>
        <option value="">Todas las categorías</option>
        {#each categorias as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

<!-- Grid de Libros -->
<div class="books-grid">
  {#each filteredBooks as l}
    <div class="book-card">
      <div class="book-cover-mock" style="background: {l.color}">
        <span class="category">{l.categoria}</span>
        <span class="cover-title">{l.titulo}</span>
      </div>
      <div class="book-details">
        <h4>{l.titulo}</h4>
        <p class="author">{l.autor}</p>
        <div class="meta">
          <span class="stock-badge {l.stock > 0 ? 'available' : 'empty'}">
            {l.stock > 0 ? `Disp: ${l.stock}` : 'Agotado'}
          </span>
          <button on:click={() => openBookModal(l)} class="btn btn-primary btn-sm">Ver Detalles</button>
        </div>
      </div>
    </div>
  {:else}
    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
      <h3>No se encontraron libros para tu búsqueda</h3>
      <p>Intenta con otros términos.</p>
    </div>
  {/each}
</div>

<!-- Modal Detalle del Libro -->
<div class="modal-overlay {showModal ? 'show' : ''}">
  <div class="modal-content">
    {#if selectedBook}
      <div class="modal-header">
        <h4>{selectedBook.titulo}</h4>
        <button class="btn-close" on:click={() => showModal = false}>&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
          <div class="book-cover-mock" style="background: {selectedBook.color}; width: 140px; height: 200px; flex-shrink: 0;">
            <span class="cover-title" style="font-size: 0.75rem;">{selectedBook.titulo}</span>
          </div>
          <div style="flex-grow: 1; min-width: 200px;">
            <table style="width: 100%; border: none; box-shadow: none;">
              <tr style="border: none; background: transparent;"><td style="padding: 4px 0; font-weight: 600; color: var(--text-muted); width: 100px;">Autor:</td><td style="padding: 4px 0;">{selectedBook.autor}</td></tr>
              <tr style="border: none; background: transparent;"><td style="padding: 4px 0; font-weight: 600; color: var(--text-muted); font-size:0.9rem;">Categoría:</td><td style="padding: 4px 0;">{selectedBook.categoria}</td></tr>
              <tr style="border: none; background: transparent;"><td style="padding: 4px 0; font-weight: 600; color: var(--text-muted);">Año:</td><td style="padding: 4px 0;">{selectedBook.anio}</td></tr>
              <tr style="border: none; background: transparent;"><td style="padding: 4px 0; font-weight: 600; color: var(--text-muted);">Páginas:</td><td style="padding: 4px 0;">{selectedBook.paginas} pág.</td></tr>
              <tr style="border: none; background: transparent;"><td style="padding: 4px 0; font-weight: 600; color: var(--text-muted);">ISBN:</td><td style="padding: 4px 0; font-size: 0.85rem;">{selectedBook.isbn}</td></tr>
              <tr style="border: none; background: transparent;"><td style="padding: 4px 0; font-weight: 600; color: var(--text-muted);">Ubicación:</td><td style="padding: 4px 0;">Sección {selectedBook.categoria.split(' ')[0]}</td></tr>
            </table>
          </div>
        </div>

        <div style="margin-top: 25px; padding: 15px; border-radius: var(--radius-sm); background: #f8fafc; border: 1px solid var(--border);">
          <h5 style="margin-bottom: 8px; font-weight: 700; color: var(--text-main);">Información de Préstamo</h5>
          <ul style="list-style-type: none; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 5px;">
            <li>⏱️ Plazo máximo de préstamo: <strong>{$config.diasMaximo} días</strong></li>
            <li>⚠️ Multa por retraso: <strong>${$config.multaDia.toFixed(2)} por día atrasado</strong></li>
            <li>📦 Stock disponible en estantería: <strong>{selectedBook.stock} unidades</strong></li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" on:click={() => showModal = false}>Cerrar</button>
        {#if selectedBook.stock > 0}
          <button class="btn btn-primary" on:click={confirmLoan}>Solicitar Préstamo</button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<!-- Toast notification -->
<div class="toast-container">
  {#if toastVisible}
    <div class="toast {toastType} show">
      <span>
        {#if toastType === 'success'}✅{/if}
        {#if toastType === 'danger'}❌{/if}
        {#if toastType === 'warning'}⚠️{/if}
      </span>
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>
