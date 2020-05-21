new Vue({
    el: '#map-tools',
    delimiters: ['[[', ']]'],
    data: {
        counter: 0
    }
})

new Vue({
    el: '#tools-panel',
    delimiters: ['[[', ']]'],
    data: {
        isKML: false,
        isUCERF3: false,
        isBoundaries: false,
        isCoasts: false,
        isLocation: false,
    }
    // data() {
    //     return {
    //         selected: [], // Must be an array reference!
    //         options: [
    //             { text: 'KML Mapper', value: 'kml' },
    //             { text: 'UCERF3 Faults', value: 'faults' },
    //             { text: ' Show State Boundaries', value: 'states' },
    //             { text: 'Show Coastlines', value: 'coasts' },
    //             { text: 'Show Your Location', value: 'location' }
    //         ]
    //     }
    // }
});

new Vue({ el: '#side-panel' });


new Vue({
    el: '#map-tools-check',


})