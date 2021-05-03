<template>

    <div class="window" >
        <b-navbar class="navbar-custom" id="top" toggleable="lg" type="dark" variant="dark">
                <img id="logo" src="../assets/logo.png" alt="GeoGateway Logo" v-on:click="move_logo">
            <b-button size="sm" v-b-toggle.sidebar-1>
                <b-icon-wrench></b-icon-wrench>
            </b-button>
          <b-button size="sm" id="login" href="/auth/login">
            <b-icon-person></b-icon-person>Login
          </b-button>
<!--            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->
        </b-navbar>
    </div>

</template>

<script>
    // import ToolBar from "./ToolBar";
    export default {
        name: "TopNav",
        components: {
            // ToolBar
        },
      methods: {
          loginRoute(){

          },
          move_logo: function () { 
              var step = 50;
              var y=document.getElementById('logo').offsetLeft;
              y= y + step;
              document.getElementById('logo').style.left= y + "px";
          }
      }
    }
</script>

<style scoped>
.navbar-custom {
  height: 40px;
}

#logo {
    position: absolute;
    left: 50%;
    margin-left: -10px;
    float: top;
    height: 30px;
    width: 100px;
}

</style>
