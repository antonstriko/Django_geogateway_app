<template>
  <div class="toolbar-active">
    <b-sidebar id="sidebar-1" bg-variant="dark">
        <ToolTabs />
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

  .toolbar-active {
      position: relative;
      float: left;
      width: 400px;

  }

    #sidebar-1 {
        height: 100%;
    }



</style>