<template>
  <div class="toolbar-active">
    <b-collapse id="sidebar-1" bg-variant="dark">
        <ToolTabs />
    </b-collapse>
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
      width: 500px;
      height: calc(100% - 100px);
      overflow: auto;

  }

    #sidebar-1 {
        height: 100%;
        width: 500px;
        overflow: auto;
    }



</style>