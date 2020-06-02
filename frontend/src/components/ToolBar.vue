<template>
  <div class="toolbar-active">
    <b-sidebar id="sidebar-1" bg-variant="dark">
      <div class="px-3 py-2">
    <ToolTabs />
      </div>
    </b-sidebar>
  </div>
</template>

<script>
  import ToolTabs from "./ToolTabs";
    export default {
        name: "ToolBar",
      components: {
          ToolTabs
      }
    }
</script>

<style scoped>
.px-3 {
  height: 300px;
  width: 100%;
}
</style>