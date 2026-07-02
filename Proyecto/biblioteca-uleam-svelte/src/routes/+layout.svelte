<script lang="ts">
	import { page } from '$app/state';
	import './styles.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Biblioteca Inteligente ULEAM</title>
</svelte:head>

{@render children()}

{#if page.url.pathname !== '/'}
  <!-- Selector de Roles Flotante para pruebas rápidas -->
  <div class="test-role-switcher">
    <span>Probar Rol Svelte:</span>
    <a href="/estudiante" class="role-btn {page.url.pathname.startsWith('/estudiante') ? 'active' : ''}">Estudiante</a>
    <a href="/admin" class="role-btn {page.url.pathname.startsWith('/admin') ? 'active' : ''}">Admin</a>
  </div>
{/if}
