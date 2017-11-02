

(function( $, wpcustomize ) {
    var $document = $( document );

    var CustomizeBuilder = function( $el ,controlId, items ){

        var Builder = {
            controlId: '',
            cols: 12,
            cellHeight: 45,
            items: [],
            container: null,
            ready: false,
            devices: {'desktop': 'Desktop/Tablet', 'mobile': 'Mobile' },
            activePanel: 'desktop',
            panels: {},
            activeRow: 'main',
            getTemplate: _.memoize(function () {
                var control = this;
                var compiled,
                    /*
                     * Underscore's default ERB-style templates are incompatible with PHP
                     * when asp_tags is enabled, so WordPress uses Mustache-inspired templating syntax.
                     *
                     * @see trac ticket #22344.
                     */
                    options = {
                        evaluate: /<#([\s\S]+?)#>/g,
                        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
                        escape: /\{\{([^\}]+?)\}\}(?!\})/g,
                        variable: 'data'
                    };

                return function (data, id, data_variable_name ) {
                    if (_.isUndefined(id)) {
                        id = 'tmpl-customize-control-' + control.type;
                    }
                    if ( ! _.isUndefined( data_variable_name ) && _.isString( data_variable_name ) ) {
                        options.variable = data_variable_name;
                    } else {
                        options.variable = 'data';
                    }
                    compiled = _.template($('#' + id).html(), null, options);
                    return compiled(data);
                };

            }),

            drag_drop: function(){
                var that = this;
                var handleTarget;

                $( '._beacon--device-panel', that.container ).each( function(){
                    var panel = $( this );
                    var device = panel.data( 'device' );
                    var sortable_ids= [];
                    $( '._beacon--cb-items', panel ).each( function( index ){
                        var id = '_sid_'+device+index;
                        $( this ).attr( 'id', id );
                        sortable_ids[ index ] = '#'+id;
                    });
                    $( '.grid-stack', panel ).each( function(){
                        $( this ).droppable( {
                            over: function( event, ui ) {
                                /**
                                 * @see http://api.jqueryui.com/droppable/#event-over
                                 */
                                var droppable = $( this );

                                console.log( 'drop', droppable );
                                console.log( 'Over pos', ui.position );
                                that.grid( droppable, ui );
                            }
                        } );

                    } );


                } );
            },

            grid: function( $droppable, ui ){
                var that = this;
                var width  = $droppable.width();
                var itemWidth = ui.draggable.width();
                var colWidth = width/that.cols;
                var x = 0;
                var y = 1;
                var left = ui.position.left;
                x = Math.round( left/ colWidth );

                console.log( 'Width', width+'--'+itemWidth + '--x:' + x );
            },

            addNewWidget: function ( $item ) {

                var that = this;
                var panel = that.container.find('._beacon--device-panel._beacon--panel-'+that.activePanel );
                var el = panel.find( '._beacon--cb-items' ).first();
                var elItem = $('<div class="grid-stack-item"><div class="grid-stack-item-content" /></div></div>');
                elItem.draggable({
                    revert: "invalid",
                    appendTo: panel,
                    scroll: false,
                    zIndex: 999,
                    handle: '.grid-stack-item-content',
                    start: function( event, ui ){
                        $( 'body' ).addClass( 'builder-item-moving' );
                    },
                    stop: function(  event, ui ){
                        $( 'body' ).removeClass( 'builder-item-moving' );
                    }
                }).resizable({
                    handles: 'w, e'
                });
                el.append( elItem );

            },

            findNewPosition: function( new_node ){

            },

            addPanel: function( device ){
                var that = this;
                var template = that.getTemplate();
                var template_id =  'tmpl-_beacon--cb-panel';
                if (  $( '#'+template_id ).length == 0 ) {
                    return ;
                }
                var html = template( {}, template_id );
                return '<div class="_beacon--device-panel _beacon-vertical-panel _beacon--panel-'+device+'" data-device="'+device+'">'+html+'</div>';
            },



            addDevicePanels: function(){
                var that = this;
                _.each( that.devices, function( device_name, device ) {
                    var panelHTML = that.addPanel( device );
                    $( '._beacon--cb-devices-switcher', that.container ).append( '<a href="#" class="switch-to-'+device+'" data-device="'+device+'">'+device_name+'</a>' );
                    $( '._beacon--cb-body', that.container ).append( panelHTML );
                } );

            },

            addItem: function( node ){
                var that = this;
                var template = that.getTemplate();
                var template_id =  'tmpl-_beacon--cb-item';
                if (  $( '#'+template_id ).length == 0 ) {
                  return ;
                }
                var html = template( node, template_id );
                return $( html );
            },

            addAvailableItems: function(){
                var that = this;

                // <div class="_beacon-available-items"></div>
                _.each( that.devices, function(device_name, device ){
                    var $itemWrapper = $( '<div class="_beacon-available-items" data-device="'+device+'"></div>' );
                    $( '._beacon--panel-'+device, that.container ).append( $itemWrapper );
                    _.each( that.items, function( node ) {
                        var item = that.addItem( node );
                        $itemWrapper.append( item );
                    } );
                } );

            },

            switchToDevice: function( device ){
                var that = this;
                $( '._beacon--cb-devices-switcher a', that.container).removeClass('_beacon--tab-active');
                $( '._beacon--cb-devices-switcher .switch-to-'+device, that.container ).addClass( '_beacon--tab-active' );
                $( '._beacon--device-panel', that.container  ).addClass( '_beacon--panel-hide' );
                $( '._beacon--device-panel._beacon--panel-'+device, that.container  ).removeClass( '_beacon--panel-hide' );
                that.activePanel = device;
            },

            addExistingRowsItems: function(){
                var that  = this;
                that.ready = true;
            },



            focus: function(){
                $document.on( 'click', '._beacon--cb-item-setting', function( e ) {
                    e.preventDefault();
                    var section = $( this ).data( 'section' ) || '';
                    var control = $( this ).data( 'control' ) || '';
                    var did = false;
                    if ( control ) {
                        if ( ! _.isUndefined(  wpcustomize.control( control ) ) ) {
                            wpcustomize.control( control ).focus();
                            did = true;
                        }
                    }
                    if ( ! did ) {
                        if ( section && ! _.isUndefined(  wpcustomize.section( section ) ) ) {
                            wpcustomize.section( section ).focus();
                            did = true;
                        }
                    }

                } );

            },
            /**
             * @see https://github.com/gridstack/gridstack.js/tree/develop/doc#removewidgetel-detachnode
             */
            remove: function(){
                var that = this;

            },

            encodeValue: function( value ){
                return encodeURI( JSON.stringify( value ) )
            },
            decodeValue: function( value ){
                return JSON.parse( decodeURI( value ) );
            },

            save: function(){
                return ;
                var that = this;
                if ( ! that.ready  ) {
                    return ;
                }

                var data = {};
                _.each( that.panels, function( settings,  device ) {
                    data[device] = {};
                    _.each( settings, function( row, index ) {
                        var rowData = _.map( $( ' > .grid-stack-item:visible', row.container ), function (el) {
                            el = $(el);
                            var node = el.data('_gridstack_node');
                            if ( ! _.isUndefined( node ) ) {
                                return {
                                    x: node.x,
                                    y: node.y,
                                    width: node.width,
                                    height: node.height,
                                    id: el.data('id') || ''
                                };
                            }

                            return false;

                        });
                        data[device][index] = rowData;
                    });
                });

                wpcustomize.control( that.controlId ).setting.set( that.encodeValue( data ) );
                console.log('Panel Data: ', data );

            },

            init: function( $el, controlId, items ){
                var that = this;
                that.container = $el;
                that.controlId = controlId;
                that.items = items;

                that.addDevicePanels();
                that.switchToDevice( that.activePanel );
                that.addAvailableItems();
                that.switchToDevice( that.activePanel );
                that.drag_drop();
                that.focus();
                that.remove();
                that.addExistingRowsItems();

                $( '._beacon-available-items', that.container ).on( 'click', '.grid-stack-item', function( e ){
                    e.preventDefault();
                    var item = $( this );
                    that.addNewWidget( item );
                } );

                // Switch panel
                that.container.on( 'click', '._beacon--cb-devices-switcher a', function(e){
                    e.preventDefault();
                    var device = $( this ).data('device');
                    that.switchToDevice( device );
                } );


            }
        };

        Builder.init( $el, controlId, items );
        return Builder;
    };


    wpcustomize.bind( 'ready', function( e, b ) {
        var Header = new CustomizeBuilder(
            $( '._beacon--customize-builder' ),
            'header_builder_panel',
            _Beacon_Layout_Builder.header_items
        );
    });


    // When data change
    /*
    wpcustomize.bind( 'change', function( e, b ) {
       console.log( 'Change' );
    });
    */


})( jQuery, wp.customize || null );