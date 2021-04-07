<template>
    <div>
        <!-- save some space
        <h3>3D Imaging</h3>
        <hr>
        -->
        <div align="left">
            <input
            type="checkbox"
            v-model="ridgecrest"
            id="ridgecrest"
            ><label for="ridgecrest"><strong>Postseismic Products of Ridgecrest Earthquake</strong></label>
            <br/>
            <div id="ridgecrest_div" v-show="this.ridgecrest">
                <p>High-Resolution Targeted 3D imaging Postseismic Products of the Ridgecrest M6.4 (July 4, 2019) and M7.1 (July 5, 2019) Earthquake Sequence. 
                    Collected by Andrea Donnellan and Gregory Lyzenga<a href="https://appliedsciences.nasa.gov/our-impact/news/nasa-geogateway-team-uses-drones-map-3d-2019-california-earthquakes-ruptures" target=_>&nbsp;more</a>
                </p>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "ThreeDImaging",
        data: function() {
            return {
                ridgecrest:false
            }
        }
    }
</script>

<style scoped>

</style>
