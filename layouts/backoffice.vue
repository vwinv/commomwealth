<template>
  <div style="min-height: 100vh">
    <div class="container" style="padding: 16px 0">
      <div class="grid">
        <aside class="card" style="grid-column: span 3; position: sticky; top: 16px; height: fit-content">
          <BackofficeSidebar />
        </aside>
        <main style="grid-column: span 9">
          <div class="card">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

