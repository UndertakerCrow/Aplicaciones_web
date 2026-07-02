<script>
  import { loggedUser, prestamos, actions } from '$lib/store.js';

  let toastMessage = '';
  let toastType = 'success';
  let toastVisible = false;

  function triggerToast(msg, type = 'success') {
    toastMessage = msg;
    toastType = type;
    toastVisible = true;
    setTimeout(() => toastVisible = false, 3500);
  }

  // Reactivo: préstamos de este usuario
  const userLoans = $derived($prestamos.filter(p => p.userId === $loggedUser?.id));
  const activeLoans = $derived(userLoans.filter(p => p.status === 'Activo' || p.status === 'Atrasado'));
  const historyLoans = $derived(userLoans.filter(p => p.status === 'Devuelto'));

  function returnBook(loanId) {
    if (confirm("¿Confirmas que deseas devolver este libro en la compuerta inteligente de la biblioteca?")) {
      const res = actions.devolverPrestamo(loanId);
      if (res.success) {
        if (res.multa > 0) {
          triggerToast(`Libro devuelto con éxito. Se ha generado una multa de $${res.multa.toFixed(2)} por entrega tardía.`, "warning");
        } else {
          triggerToast("Libro devuelto con éxito. ¡Gracias!", "success");
        }
      } else {
        triggerToast(res.message, "danger");
      }
    }
  }

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString('es-EC', options);
  }
</script>

<svelte:head>
  <title>Mis Préstamos - Biblioteca Inteligente ULEAM</title>
</svelte:head>

<!-- Préstamos Activos -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Material en tu Posesión (Activo)</h3>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Cód Préstamo</th>
          <th>Título del Libro</th>
          <th>Fecha Préstamo</th>
          <th>Fecha Límite</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {#each activeLoans as p}
          <tr>
            <td style="font-weight: 700; font-size: 0.85rem; color: var(--primary-dark);">{p.id}</td>
            <td style="font-weight: 600;">{p.bookTitulo}</td>
            <td>{formatDate(p.fechaPrestamo)}</td>
            <td><strong>{formatDate(p.fechaDevolucion)}</strong></td>
            <td><span class="badge {p.status === 'Atrasado' ? 'badge-danger' : 'badge-success'}">{p.status === 'Atrasado' ? 'Atrasado' : 'Al día'}</span></td>
            <td>
              <button onclick={() => returnBook(p.id)} class="btn btn-outline btn-sm" style="color: var(--primary); border-color: var(--primary);">
                Devolver Libro
              </button>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
              No tienes ningún libro prestado en este momento.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Historial de Préstamos -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Historial de Entregas</h3>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Cód Préstamo</th>
          <th>Título del Libro</th>
          <th>Fecha Préstamo</th>
          <th>Fecha Límite</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {#each historyLoans as p}
          <tr>
            <td style="font-weight: 600; color: var(--text-muted);">{p.id}</td>
            <td>{p.bookTitulo}</td>
            <td>{formatDate(p.fechaPrestamo)}</td>
            <td>{formatDate(p.fechaDevolucion)}</td>
            <td><span class="badge badge-info">Entregado</span></td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
              Aún no tienes un historial de entregas.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Toast alert -->
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
