<script>
  import { loggedUser, libros } from '$lib/store.js';
  import { goto } from '$app/navigation';

  let search = '';
  let selectedCategory = '';
  let showModal = false;
  let isEditing = false;
  let editingBookId = null;

  // Campos del formulario modal
  let bkTitulo = '';
  let bkAutor = '';
  let bkAnio = '';
  let bkPaginas = '';
  let bkCategoria = '';
  let bkIsbn = '';
  let bkStock = '';

  // Toast
  let toastMessage = '';
  let toastType = 'success';
  let toastVisible = false;

  function triggerToast(msg, type = 'success') {
    toastMessage = msg;
    toastType = type;
    toastVisible = true;
    setTimeout(() => {
      toastVisible = false;
    }, 3500);
  }

  // Categorías únicas para filtro
  const categorias = $derived([...new Set($libros.map(l => l.categoria))]);

  // Filtrado reactivo de libros
  const filteredBooks = $derived($libros.filter(l => {
    const matchesSearch =
      (l.titulo || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.autor || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.isbn || '').includes(search);
    const matchesCat = selectedCategory === '' || l.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  }));

  function showAddBookModal() {
    isEditing = false;
    editingBookId = null;
    bkTitulo = '';
    bkAutor = '';
    bkAnio = '';
    bkPaginas = '';
    bkCategoria = '';
    bkIsbn = '';
    bkStock = '';
    showModal = true;
  }

  function showEditBookModal(libro) {
    isEditing = true;
    editingBookId = libro.id;
    bkTitulo = libro.titulo;
    bkAutor = libro.autor;
    bkAnio = libro.anio;
    bkPaginas = libro.paginas;
    bkCategoria = libro.categoria;
    bkIsbn = libro.isbn;
    bkStock = libro.stock;
    showModal = true;
  }

  function closeBookModal() {
    showModal = false;
  }

  function saveBook() {
    const anioVal = parseInt(bkAnio);
    const paginasVal = parseInt(bkPaginas);
    const stockVal = parseInt(bkStock);

    if (!bkTitulo.trim() || !bkAutor.trim() || isNaN(anioVal) || isNaN(paginasVal) || !bkCategoria.trim() || !bkIsbn.trim() || isNaN(stockVal)) {
      triggerToast("Por favor, llena correctamente todos los campos.", "warning");
      return;
    }

    if (!isEditing) {
      // Agregar libro
      libros.update(list => {
        const id = list.length > 0 ? Math.max(...list.map(l => l.id)) + 1 : 1;
        const gradients = [
          "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          "linear-gradient(135deg, #10b981, #047857)",
          "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          "linear-gradient(135deg, #ec4899, #be185d)",
          "linear-gradient(135deg, #f59e0b, #d97706)",
          "linear-gradient(135deg, #14b8a6, #0f766e)"
        ];
        const color = gradients[Math.floor(Math.random() * gradients.length)];
        list.push({
          id,
          titulo: bkTitulo.trim(),
          autor: bkAutor.trim(),
          anio: anioVal,
          paginas: paginasVal,
          categoria: bkCategoria.trim(),
          isbn: bkIsbn.trim(),
          stock: stockVal,
          precio: 12.00,
          color
        });
        return list;
      });
      triggerToast("¡Nuevo libro añadido al catálogo con éxito!", "success");
    } else {
      // Editar libro
      libros.update(list => {
        const idx = list.findIndex(l => l.id === editingBookId);
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            titulo: bkTitulo.trim(),
            autor: bkAutor.trim(),
            anio: anioVal,
            paginas: paginasVal,
            categoria: bkCategoria.trim(),
            isbn: bkIsbn.trim(),
            stock: stockVal
          };
        }
        return list;
      });
      triggerToast("¡Material bibliográfico actualizado!", "success");
    }

    closeBookModal();
  }

  function deleteBook(id) {
    if (confirm("¿Estás seguro de que deseas eliminar permanentemente este libro del catálogo?")) {
      libros.update(list => list.filter(l => l.id !== id));
      triggerToast("El libro ha sido retirado del sistema.", "success");
    }
  }
</script>

<svelte:head>
  <title>Administrar Catálogo - Admin ULEAM</title>
</svelte:head>

<!-- Header -->
<div class="page-header">
  <div class="page-title">
    <h2>Administración de Catálogo</h2>
    <p>Registra nuevos ejemplares físicos/digitales, modifica stock y elimina material dañado</p>
  </div>
  
  {#if $loggedUser}
    <div class="user-profile-badge" onclick={() => goto('/estudiante/perfil')}>
      <div class="avatar-container">{($loggedUser.nombre || '').charAt(0)}</div>
      <div class="user-meta">
        <strong>{$loggedUser.nombre}</strong>
        <span>{$loggedUser.rol}</span>
      </div>
    </div>
  {/if}
</div>

<!-- Tabla Catálogo -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Material Bibliográfico</h3>
    <button class="btn btn-primary" onclick={showAddBookModal}>➕ Agregar Material</button>
  </div>

  <div style="margin-bottom: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
    <div style="flex-grow: 1; min-width: 250px;">
      <input type="text" bind:value={search} placeholder="Buscar por título, autor, categoría o ISBN...">
    </div>
    <div style="width: 220px;">
      <select bind:value={selectedCategory}>
        <option value="">Todas las categorías</option>
        {#each categorias as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Portada</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Categoría</th>
          <th>ISBN</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredBooks as l}
          <tr>
            <td>
              <div style="width: 45px; height: 60px; background: {l.color}; border-radius: 4px; display: flex; align-items: center; justify-content: center; padding: 4px; color: white; font-size: 0.5rem; text-align: center; font-weight: 700; box-shadow: var(--shadow-sm); overflow: hidden;">
                {(l.titulo || '').substring(0, 10)}...
              </div>
            </td>
            <td style="font-weight: 700;">{l.titulo}</td>
            <td>{l.autor}</td>
            <td><span class="badge badge-info" style="background: #e2e8f0; color: #475569;">{l.categoria}</span></td>
            <td style="font-family: monospace; font-size: 0.85rem;">{l.isbn}</td>
            <td>
              <span class="stock-badge {l.stock > 0 ? 'available' : 'empty'}">
                {l.stock > 0 ? `Stock: ${l.stock}` : 'Agotado'}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 8px;">
                <button onclick={() => showEditBookModal(l)} class="btn btn-outline btn-sm">Editar</button>
                <button onclick={() => deleteBook(l.id)} class="btn btn-danger btn-sm">Eliminar</button>
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 25px;">
              No se encontraron materiales en el catálogo.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Modal Agregar/Editar Libro -->
<div class="modal-overlay {showModal ? 'show' : ''}">
  <div class="modal-content">
    <div class="modal-header">
      <h4>{isEditing ? `Editar Libro: ${bkTitulo}` : 'Agregar Nuevo Material'}</h4>
      <button class="btn-close" onclick={closeBookModal}>&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="bkTitulo">Título del Libro</label>
        <input type="text" id="bkTitulo" bind:value={bkTitulo} placeholder="Ej. El túnel">
      </div>
      <div class="form-group">
        <label for="bkAutor">Autor</label>
        <input type="text" id="bkAutor" bind:value={bkAutor} placeholder="Ej. Ernesto Sábato">
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div class="form-group">
          <label for="bkAnio">Año de Publicación</label>
          <input type="number" id="bkAnio" bind:value={bkAnio} placeholder="Ej. 1948">
        </div>
        <div class="form-group">
          <label for="bkPaginas">Páginas</label>
          <input type="number" id="bkPaginas" bind:value={bkPaginas} placeholder="Ej. 160">
        </div>
      </div>
      <div class="form-group">
        <label for="bkCategoria">Categoría</label>
        <input type="text" id="bkCategoria" bind:value={bkCategoria} placeholder="Ej. Novela Psicológica">
      </div>
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
        <div class="form-group">
          <label for="bkIsbn">Código ISBN</label>
          <input type="text" id="bkIsbn" bind:value={bkIsbn} placeholder="Ej. 978-8420651361">
        </div>
        <div class="form-group">
          <label for="bkStock">Stock Inicial</label>
          <input type="number" id="bkStock" bind:value={bkStock} placeholder="Ej. 5">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick={closeBookModal}>Cancelar</button>
      <button class="btn btn-primary" onclick={saveBook}>Guardar Libro</button>
    </div>
  </div>
</div>

<!-- Toast Container -->
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