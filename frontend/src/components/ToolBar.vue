<template>

    <b-collapse visible id="sidebar-1" bg-variant="dark">
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
        height: 100%;
        width: 27%;
        overflow-y: scroll;
        float: left;
        background-color: #e6e6ff;
        -webkit-transition: none;
        transition: none;
    }


</style>