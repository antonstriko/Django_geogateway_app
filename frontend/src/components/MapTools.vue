<template>
    <div>
        <b-form-group >
            <b-form-checkbox-group id="checkbox-group-2" v-model="selected" name="flavour-2" stacked >
                <b-form-checkbox value="ucerf" @change="updateLayer('ucerf')"><p>UCERF3 Faults</p></b-form-checkbox>
                <b-form-checkbox value="kml" @change="updateLayer('kml')"><p>KML Mapper</p></b-form-checkbox>
                <b-form-checkbox value="states" @change="updateLayer('boundaries')"><p>Show State Boundaries</p></b-form-checkbox>
                <b-form-checkbox value="coasts" @change="updateLayer('coasts')"><p>Show Coastlines</p></b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>

        <div id="tools-show">
            <div v-if="mapTools.ucerf[0]">
                <hr class="divider" />
                <b-form-radio-group  >
                    <b-form-radio v-model="selected" name="some-radios" value="black"><p>black</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="red"><p>red</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="yellow"><p>yellow</p></b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="grey"><p>grey</p></b-form-radio>
                </b-form-radio-group>
            </div>

            <div v-if="mapTools.kml[0]">
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
    import {bus} from '../main'
    export default {
        name: "MapTools",
        data() {
            return {
                selected: [],
                ucerfUrl: "https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ucerf3_black.kml",
                boundariesUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/gz_2010_us_040_00_20m.kml',
                coastsUrl: 'https://raw.githubusercontent.com/GeoGateway/GeoGatewayStaticResources/master/kmz/ne_50m_coastline.kml',

            }
        },
        methods: {
            updateLayer(l){
                // Should the store be used in this case or is the event bus sufficient?
                // TODO improve efficiency and utilize vue mutations to do this
                switch (l) {
                    case 'ucerf':
                        bus.$emit('UrlAddLayer', this.ucerfUrl, 'ucerfL')
                        break;
                    case 'kml':
                        break;
                    case 'boundaries':
                        bus.$emit('UrlAddLayer', this.boundariesUrl, 'boundariesL')
                        break;
                    case 'coasts':
                        bus.$emit('UrlAddLayer', this.boundariesUrl, 'coastsL')
                        break;

                }


            },
        },
        computed: {
            mapTools(){
                return this.$store.state.mapToolsState;
            }
        }

    }
</script>

<style scoped>


    .divider {
        border: 2px solid #cccccc;
        border-radius: 1px;
    }

</style>