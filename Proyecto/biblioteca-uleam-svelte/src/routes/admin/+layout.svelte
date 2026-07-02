<script>
  import { onMount } from 'svelte';
  import { loggedUser, actions } from '$lib/store.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { children } = $props();

  onMount(() => {
    // Validar sesión de administrador
    if (!$loggedUser || $loggedUser.rol !== 'Administrador') {
      goto('/');
    }
  });

  function handleLogout() {
    actions.logout();
    goto('/');
  }
</script>

<!-- Layout para Administrador -->
<div class="app-container">
  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="brand-icon" style="background: linear-gradient(135deg, var(--secondary), var(--primary));">⚙️</div>
        <div class="brand-info">
          <h1>Panel de Control</h1>
          <p>Admin ULEAM</p>
        </div>
      </div>
    </div>

    <div class="nav-menu">
      <a href="/admin" class="nav-link" class:active={$page.url.pathname === '/admin'}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Dashboard</span>
      </a>
      <a href="/admin/gestion-usuarios" class="nav-link" class:active={$page.url.pathname.startsWith('/admin/gestion-usuarios')}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 1.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span>Gestión de Usuarios</span>
      </a>
      <a href="/admin/catalogo" class="nav-link" class:active={$page.url.pathname.startsWith('/admin/catalogo')}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.89 12.55L12 15.89l6.11-3.34c-1.83.62-3.87.95-6.11.95s-4.28-.33-6.11-.95z"/></svg>
        <span>Catálogo</span>
      </a>
      <a href="/admin/prestamos" class="nav-link" class:active={$page.url.pathname.startsWith('/admin/prestamos')}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
        <span>Préstamos</span>
      </a>
      <a href="/admin/sanciones" class="nav-link" class:active={$page.url.pathname.startsWith('/admin/sanciones')}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <span>Sanciones</span>
      </a>
      <a href="/admin/reportes" class="nav-link" class:active={$page.url.pathname.startsWith('/admin/reportes')}>
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
        <span>Reportes</span>
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
    {@render children()}
  </div>
</div>
