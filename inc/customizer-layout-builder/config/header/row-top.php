<?php
function _beacon_builder_config_header_row_top( $section = false, $section_name = false ){
    if ( ! $section ) {
        $section  = 'header_top';
    }
    if ( ! $section_name ) {
        $section_name = __( 'Header Top', '_beacon' );
    }

    return _beacon_builder_config_header_row_config( $section, $section_name );
}


