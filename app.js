//<debug>
Ext.Loader.setPath({
    'Ext.plugin': 'lib/plugin'
});
//</debug>


/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'DinoKale',

    requires: [
        'Ext.MessageBox',
        'Ext.Button',
        'Ext.SegmentedButton',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.plugin.google.Traffic',
        'Ext.plugin.google.Tracker'
    ],

    views: [
        'Main'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        var position = new google.maps.LatLng(37.44885, -122.158592);  //Sencha HQ

        var infowindow = new google.maps.InfoWindow({
            content: 'Sencha HQ'
        });

        //Tracking Marker Image
        var image = new google.maps.MarkerImage(
            'resources/images/point.png',
            new google.maps.Size(32, 31),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 31)
        );

        var shadow = new google.maps.MarkerImage(
            'resources/images/shadow.png',
            new google.maps.Size(64, 52),
            new google.maps.Point(0, 0),
            new google.maps.Point(-5, 42)
        );

        trackingButton = Ext.create('Ext.Button', {
            iconCls: 'locate'
        }),

        trafficButton = Ext.create('Ext.Button', {
            pressed: true,
            iconCls: 'maps'
        }),


        toolbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            ui: 'light',
            items: [
                {
                    iconCls: 'home',
                    handler: function() {
                        //disable tracking
                        var segmented = Ext.getCmp('segmented'),
                            pressedButtons = segmented.getPressedButtons(),
                            trafficIndex = pressedButtons.indexOf(trafficButton),
                            newPressed = (trafficIndex != -1) ? [trafficButton] : [];
                        segmented.setPressedButtons(newPressed);
                        mapdemo.getMap().panTo(position);
                    }
                },
                {
                    id: 'segmented',
                    xtype: 'segmentedbutton',
                    allowMultiple: true,
                    listeners: {
                        toggle: function(buttons, button, active) {
                            if (button == trafficButton) {
                                mapdemo.getPlugins()[1].setHidden(!active);
                            }
                            else if (button == trackingButton) {
                                var tracker = mapdemo.getPlugins()[0],
                                    marker = tracker.getMarker();
                                marker.setVisible(active);
                                tracker.setTrackSuspended(!active);
                            }
                        }
                    },
                    items: [
                        trackingButton, trafficButton
                    ]
                }
            ]
        });


        var mapdemo = Ext.create('Ext.Map', {
            mapOptions : {
                center : new google.maps.LatLng(37.381592, -122.135672),  //nearby San Fran
                zoom : 12,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
            },

            plugins : [
                new Ext.plugin.google.Tracker({
                    trackSuspended: true,   //suspend tracking initially
                    allowHighAccuracy: false,
                    marker: new google.maps.Marker({
                        position: position,
                        title: 'My Current Location',
                        shadow: shadow,
                        icon: image
                    })
                }),
                new Ext.plugin.google.Traffic()
            ],
            mapListeners: {
                dragstart: function() {
                    var segmented = Ext.getCmp('segmented'),
                        pressedButtons = segmented.getPressedButtons().slice(),
                        trackingIndex = pressedButtons.indexOf(trackingButton);
                    if (trackingIndex != -1) {
                        pressedButtons.splice(trackingIndex, 1);
                        segmented.setPressedButtons(pressedButtons);
                    }
                }
            },

            listeners: {
                maprender: function(comp, map) {
                    var marker = new google.maps.Marker({
                        position: position,
                        title : 'Sencha HQ',
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });

                    setTimeout(function() {
                        map.panTo(position);
                    }, 1000);
                }

            }
        });

        // Initialize the main view
        // Ext.Viewport.add(Ext.create('DinoKale.view.Main'));

        Ext.create('Ext.Panel', {
            fullscreen: true,
            layout: 'fit',
            items: [toolbar, mapdemo]
        });
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
