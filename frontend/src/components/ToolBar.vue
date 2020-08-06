<template>

    <b-collapse id="sidebar-1" bg-variant="dark">
        <ToolTabs />
    </b-collapse>

</template>

<script>
  import ToolTabs from "./ToolTabs";
  export default {
    name: "ToolBar",
    components: {
      ToolTabs
    },

  }
</script>

<style scoped>


    #sidebar-1 {
        height: calc(100% - 100px);
        width: 500px;
        overflow: auto;
        float: left;
        background-color: #343a40;
    }



</style>