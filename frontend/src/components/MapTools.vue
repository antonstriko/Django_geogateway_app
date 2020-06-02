<template>
<div>
    <b-form-checkbox
      id="checkbox-1"
      v-model="status"
      name="checkbox-1"
      value="accepted"
      unchecked-value="not_accepted"
    >
        <p>UCERF3 Faults</p>
    </b-form-checkbox>
</div>
</template>

<script>
    export default {
        name: "MapTools"
    }
</script>

<style scoped>
 p {
     color: #cccccc;
 }
</style>