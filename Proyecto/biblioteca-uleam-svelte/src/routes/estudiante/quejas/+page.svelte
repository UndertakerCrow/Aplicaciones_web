<script>
  import { loggedUser, quejas, actions } from '$lib/store.js';

  let subject = '';
  let desc = '';

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

  // Historial de reportes del estudiante activo
  $: studentQuejas = $quejas.filter(q => q.userId === $loggedUser?.id);

  function submitComplaint() {
    if (!subject.trim() || !desc.trim()) {
      triggerToast("Por favor, rellena todos los campos del reporte.", "warning");
      return;
    }

    actions.enviarQueja(subject.trim(), desc.trim(), $loggedUser.id, $loggedUser.nombre);
    
    subject = '';
    desc = '';
    
    triggerToast("Tu reporte ha sido enviado al equipo de administración del ULEAM. ¡Gracias!", "success");
  }

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString('es-EC', options);
  }
</script>

<svelte:head>
  <title>Quejas y Sugerencias - Biblioteca Inteligente ULEAM</title>
</svelte:head>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start; flex-wrap: wrap;">
  <!-- Formulario -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Enviar Reporte</h3>
    </div>
    
    <div class="form-group">
      <label for="complainSubject">Asunto / Tema</label>
      <input type="text" id="complainSubject" bind:value={subject} placeholder="Ej. Fallo en el escaneo de ISBN, error de sensor...">
    </div>

    <div class="form-group" style="margin-bottom: 25px;">
      <label for="complainDesc">Descripción Detallada</label>
      <textarea id="complainDesc" bind:value={desc} style="height: 150px;" placeholder="Describe detalladamente el problema experimentado en la biblioteca..."></textarea>
    </div>

    <button on:click={submitComplaint} class="btn btn-primary" style="width: 100%; justify-content: center;">
      Enviar Queja / Sugerencia
    </button>
  </div>

  <!-- Historial del Estudiante -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Mis Reportes Enviados</h3>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Asunto</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {#each studentQuejas as q}
            <tr>
              <td style="font-weight: 600; font-size: 0.9rem;" title={q.descripcion}>{q.asunto}</td>
              <td style="font-size: 0.85rem;">{formatDate(q.fecha)}</td>
              <td>
                <span class="badge {q.estado === 'Resuelto' ? 'badge-success' : q.estado === 'En Proceso' ? 'badge-warning' : 'badge-info'}">
                  {q.estado}
                </span>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 30px;">
                Aún no has registrado ninguna queja o sugerencia.
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
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
