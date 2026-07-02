<script>
  import { onMount } from 'svelte';
  import { loggedUser, actions } from '$lib/store.js';
  import { goto } from '$app/navigation';

  let currentRoute = '';
  let showSidebar = false;

  onMount(() => {
    // Verificar si el usuario está logueado
    if (!$loggedUser) {
      goto('/');
    }
  });

  function handleLogout() {
    actions.logout();
    goto('/');
  }
</script>

<!-- Layout para Estudiante -->
<div class="app-container">
  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="brand-icon">📚</div>
        <div class="brand-info">
          <h1>Biblio Inteligente</h1>
          <p>ULEAM Portal</p>
        </div>
      </div>
    </div>

    <div class="nav-menu">
      <a href="/estudiante" class="nav-link">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Inicio</span>
      </a>
      <a href="/estudiante/catalogo" class="nav-link">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.89 12.55L12 15.89l6.11-3.34c-1.83.62-3.87.95-6.11.95s-4.28-.33-6.11-.95z"/></svg>
        <span>Catálogo</span>
      </a>
      <a href="/estudiante/prestamos" class="nav-link">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
        <span>Mis Préstamos</span>
      </a>
      <a href="/estudiante/quejas" class="nav-link">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <span>Quejas / Sugerencias</span>
      </a>
      <a href="/estudiante/perfil" class="nav-link">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Mi Perfil</span>
      </a>
    </div>

    <div class="sidebar-footer">
      <button on:click={handleLogout} class="btn-logout">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </div>

  <!-- Contenedor Principal -->
  <div class="main-content">
    {#if $loggedUser}
      <!-- Encabezado de Página Principal -->
      <div class="page-header">
        <div class="page-title">
          <h2>Bienvenido, {$loggedUser.nombre.split(' ')[0]}</h2>
          <p>Portal Autónomo del Estudiante / Docente ULEAM</p>
        </div>
        
        <div class="user-profile-badge" on:click={() => goto('/estudiante/perfil')}>
          <div class="avatar-container">{$loggedUser.nombre.charAt(0)}</div>
          <div class="user-meta">
            <strong>{$loggedUser.nombre}</strong>
            <span>{$loggedUser.rol}</span>
          </div>
        </div>
      </div>
    {/if}

    <slot />
  </div>
</div>
