<template>
    <div>
        <b-form-group >
            <b-form-checkbox-group id="checkbox-group-2" v-model="selected" name="flavour-2" stacked >
                <b-form-checkbox value="ucerf" v-on:change="mapTools.ucerf=!mapTools.ucerf"><p>UCERF3 Faults</p></b-form-checkbox>
                <b-form-checkbox value="kml" v-on:change="mapTools.kml=!mapTools.kml"><p>KML Mapper</p></b-form-checkbox>
                <b-form-checkbox value="states" v-on:change="mapTools.boundaries=!mapTools.boundaries"><p>Show State Boundaries</p></b-form-checkbox>
                <b-form-checkbox value="coasts" v-on:change="mapTools.coasts=!mapTools.coasts"><p>Show Coastlines</p></b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>

        <div id="tools-show">
            <div v-if="mapTools.ucerf">
                <hr class="divider" />
                <b-form-radio-group  >
                    <b-form-radio v-model="selected" name="some-radios" value="black"><p>black</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="red"><p>red</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="yellow"><p>yellow</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="grey"><p>grey</p></b-form-radio>
                </b-form-radio-group>
            </div>

            <div v-if="mapTools.kml">
                <hr class="divider" />
                <h2>KML File Upload</h2>
                <form method="post" enctype="multipart/form-data">
                    <input type="file" name="kml-file"> <br/><br/>
                    <button type="submit">Upload File</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MapTools",
        data() {
            return {
                selected: [],
            }
        },
        methods: {

        },
        computed: {
            mapTools(){
                return this.$store.state.mapTools;
            }
        }

    }
</script>

<style scoped>
    p, h1, h2, h3, h4, hr {
        color: #cccccc;
    }
    #tools-show {
        height: 100%;
    }
    .divider {
         border: 2px solid #cccccc;
        border-radius: 1px;
    }

</style>