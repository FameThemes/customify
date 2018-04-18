/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

( function( $, api ) {
    var $document = $( document );

    var header_changed = function( partial_id, remove_items ){

        if( _.isUndefined( remove_items ) ) {
            remove_items = false;
        }
        if( partial_id === 'header_builder_panel' || partial_id === 'customify_customize_render_header' ) {

            $( '.close-sidebar-panel' ).not( ':last' ).remove();
            $('.header-menu-sidebar' ).not( ':last' ).remove();

            if ( remove_items ) {
                $('body > .header-menu-sidebar, #page > .header-menu-sidebar' ).remove();
            }
            if ( $( 'body' ).hasClass( 'menu_sidebar_dropdown' ) ) {
                $( '#header-menu-sidebar' ).insertAfter( "#masthead" );
            } else {
                $( 'body' ).prepend(  $( '#header-menu-sidebar' ) );
            }
        }

        var header = $( '#masthead' );
        if ( $( '.search-form--mobile', header ).length ) {
            if ( remove_items ) {
                $('.mobile-search-form-sidebar').remove();
            }
            var search_form = $( '.search-form--mobile' ).eq(0);
            search_form.addClass('mobile-search-form-sidebar')
                .removeClass( 'hide-on-mobile hide-on-tablet' );
            $( 'body' ).prepend( search_form );
        }

        $document.trigger( 'header_builder_panel_changed',[ partial_id ] );
    };

	// Header text color.
	wp.customize( 'header_textcolor', function( settings ) {
        settings.bind( function( to ) {
			if ( 'blank' === to ) {
				$( '.site-title, .site-description' ).css( {
					'clip': 'rect(1px, 1px, 1px, 1px)',
					'position': 'absolute'
				} );
			} else {
				$( '.site-title, .site-description' ).css( {
					'clip': 'auto',
					'position': 'relative'
				} );
				$( '.site-title a, .site-description' ).css( {
					'color': to
				} );
			}
		} );
	} );

	wp.customize( 'header_sidebar_animate', function( settings ) {
        settings.bind( function( to ) {
            header_changed( 'header_builder_panel', false );
            $document.trigger('customize_section_opened', [ 'header_sidebar' ]) ;
            if ( to.indexOf( 'menu_sidebar_dropdown' ) > 1 ) {
                $( '.menu-mobile-toggle, .menu-mobile-toggle .hamburger' ).addClass( 'is-active' );
            } else {
                $( '.menu-mobile-toggle, .menu-mobile-toggle .hamburger' ).removeClass( 'is-active' );
            }
        });
    }) ;

    api.bind( 'preview-ready', function() {

        var defaultTarget = window.parent === window ? null : window.parent;

        // When focus section
        defaultTarget.wp.customize.state( 'expandedSection' ).bind( function( section ) {
            if ( section && ! _.isUndefined( section.id ) ) {
                $document.trigger('customize_section_opened', [ section.id  ]) ;
            } else {
                $document.trigger('customize_section_opened', [ '__no_section_selected'  ]) ;
            }
        });

        $document.on( 'click', '#masthead .customize-partial-edit-shortcut-header_panel', function( e ){
            e.preventDefault();
            defaultTarget.wp.customize.panel( 'header_settings' ).focus();
        } );

        // for custom when click on preview
        $document.on( 'click', '.builder-item-focus .item--preview-name', function( e ){
            e.preventDefault();
            var p = $( this ).closest('.builder-item-focus');
            var section_id =  p.attr( 'data-section' ) || '';
            if( section_id ) {
                if ( defaultTarget.wp.customize.section( section_id ) ) {
                    defaultTarget.wp.customize.section( section_id ).focus();
                }
            }
        } );

        // When selective refresh re-rendered content
        wp.customize.selectiveRefresh.bind( 'partial-content-rendered', function( settings ) {
            console.log( 'settings.partial.id', settings.partial.id );
            $document.trigger( 'selective-refresh-content-rendered', [settings.partial.id ] );
            header_changed( settings.partial.id );
        } );

    } );


    var skips_to_add_shortcut = {
        customify_customize_render_header: 1,
        customify_customize_render_footer: 1
    };

    /**
     * Do not focus to header, footer customize control
     * @see /wp-includes/js/customize-selective-refresh.js
     */
    wp.customize.selectiveRefresh.Partial.prototype.ready = function(){
        var partial = this;

        if ( _.isUndefined( skips_to_add_shortcut[ partial.id ] ) ) {
            _.each(partial.placements(), function (placement) {
                $(placement.container).attr('title', wp.customize.selectiveRefresh.data.l10n.shiftClickToEdit);
                partial.createEditShortcutForPlacement(placement);
            });
            $(document).on('click', partial.params.selector, function (e) {
                if (!e.shiftKey) {
                    return;
                }
                e.preventDefault();
                _.each(partial.placements(), function (placement) {
                    if ($(placement.container).is(e.currentTarget)) {
                        partial.showControl();
                    }
                });
            });
        }
    };


} )( jQuery, wp.customize );
