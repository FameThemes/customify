<?php
if ( ! function_exists( '_beacon_customizer_get_header_config' ) ) {
    function _beacon_customizer_get_header_config( $configs = array() ){

        $config = array(
            array(
                'name' => 'header_settings',
                'type' => 'panel',
                'theme_supports' => '',
                'title'          => __( 'Header', '_beacon' ),
            ),

            array(
                'name' => 'header_builder_panel',
                'type' => 'section',
                'panel' => 'header_settings',
                'theme_supports' => '',
                'title'          => __( 'Header Builder', '_beacon' ),
                'description' => __( 'This is section description',  '_beacon' ),
            ),

            array(
                'name' => 'header_builder_panel',
                'type' => 'js_raw',
                'section' => 'header_builder_panel',
                'theme_supports' => '',
                'title'          => __( 'Header Builder', '_beacon' ),
                'description' => __( 'Header Builder panel here....',  '_beacon' ),
                'selector' => '#masthead',
                'render_callback' => '_beacon_customize_render_header'
            ),

        );

        foreach ( _Beacon_Customizer_Layout_Builder::get_header_sections() as $id ) {
            $file = get_template_directory().'/inc/customizer-layout-builder/config/header/'.$id.'.php';
            if (  is_file( $file ) ) {
                require_once get_template_directory().'/inc/customizer-layout-builder/config/header/'.$id.'.php';
            }

            $func_id = str_replace( '-', '_', $id );

            if ( function_exists( '_beacon_builder_config_header_'.$func_id ) ) {
                $config = array_merge( $config, call_user_func_array( '_beacon_builder_config_header_'.$func_id, array() ) );
            }
        }

        return array_merge( $configs, $config );
    }
}

add_filter( '_beacon/customizer/config', '_beacon_customizer_get_header_config' );


function _beacon_builder_config_header_row_config( $section = false, $section_name = false ){
    if ( ! $section ) {
        $section  = 'header_top';
    }
    if ( ! $section_name ) {
        $section_name = __( 'Header Top', '_beacon' );
    }

    $config  = array(
        array(
            'name' => $section,
            'type' => 'section',
            'panel' => 'header_settings',
            'theme_supports' => '',
            'title'          => $section_name,
        ),

        array(
            'name' => $section.'_sticky',
            'type' => 'select',
            'section' => $section,
            'theme_supports' => '',
            'title'          => __( 'Sticky header', '_beacon' ),
            'choices' => array(
                'no' =>  __( 'No', '_beacon' ),
                'yes' =>  __( 'Yes', '_beacon' ),
            )
        ),

        array(
            'name' => $section.'_layout',
            'type' => 'select',
            'section' => $section,
            'theme_supports' => '',
            'title'          => __( 'Layout', '_beacon' ),
            'choices' => array(
                'default' =>  __( 'Default', '_beacon' ),
                'fullwidth' =>  __( 'Full Width', '_beacon' ),
                'boxed' =>  __( 'Boxed', '_beacon' ),
            )
        ),

        array(
            'name' => $section.'_sticky',
            'type' => 'select',
            'section' => $section,
            'theme_supports' => '',
            'title'          => __( 'Sticky header', '_beacon' ),
            'choices' => array(
                'no' =>  __( 'No', '_beacon' ),
                'yes' =>  __( 'Yes', '_beacon' ),
            )
        ),

        array(
            'name' => $section.'_padding',
            'type' => 'css_ruler',
            'section' => $section,
            'theme_supports' => '',
            'device_settings' => true,
            'title'          => __( 'Padding', '_beacon' ),
        ),

        array(
            'name' => $section.'_background',
            'type' => 'group',
            'section'     => $section,
            'title'          => __( 'Background', '_beacon' ),
            'description'    => __( 'This is description',  '_beacon' ),
            'live_title_field' => 'title',
            'field_class' => '_beacon-background-control',
            'selector' => '#page',
            'css_format' => 'background',
            'device_settings' => true,
            'default' => array(

            ),
            'fields' => array(
                array(
                    'name' => 'color',
                    'type' => 'color',
                    'label' => __( 'Color', '_beacon' ),
                    'device_settings' => true,
                ),
                array(
                    'name' => 'image',
                    'type' => 'image',
                    'label' => __( 'Image', '_beacon' ),
                ),
                array(
                    'name' => 'cover',
                    'type' => 'checkbox',
                    'required' => array( 'image', 'not_empty', ''),
                    'label' => __( 'Background cover', '_beacon' ),
                ),
                array(
                    'name' => 'position',
                    'type' => 'select',
                    'label' => __( 'Background Position', '_beacon' ),
                    'required' => array( 'image', 'not_empty', ''),
                    'choices' => array(
                        'default'       => __( 'Position', '_beacon' ),
                        'center'        => __( 'Center', '_beacon' ),
                        'top_left'      => __( 'Top Left', '_beacon' ),
                        'top_right'     => __( 'Top Right', '_beacon' ),
                        'top_center'    => __( 'Top Center', '_beacon' ),
                        'bottom_left'   => __( 'Bottom Left', '_beacon' ),
                        'bottom_center' => __( 'Bottom Center', '_beacon' ),
                        'bottom_right'  => __( 'Bottom Right', '_beacon' ),
                    ),
                ),

                array(
                    'name' => 'repeat',
                    'type' => 'select',
                    'label' => __( 'Background Repeat', '_beacon' ),
                    'required' => array(
                        array('image', 'not_empty', ''),
                        // array('style', '!=', 'cover' ),
                    ),
                    'choices' => array(
                        'default' => __( 'Repeat', '_beacon' ),
                        'no-repeat' => __( 'No-repeat', '_beacon' ),
                        'repeat-x' => __( 'Repeat Horizontal', '_beacon' ),
                        'repeat-y' => __( 'Repeat Vertical', '_beacon' ),
                    ),
                ),

                array(
                    'name' => 'attachment',
                    'type' => 'select',
                    'label' => __( 'Background Attachment', '_beacon' ),
                    'required' => array(
                        array('image', 'not_empty', ''),
                        array('cover', '!=', '1' ),
                    ),
                    'choices' => array(
                        'default' => __( 'Attachment', '_beacon' ),
                        'scroll' => __( 'Scroll', '_beacon' ),
                        'fixed' => __( 'Fixed', '_beacon' )
                    ),
                ),

            )
        ),

    );
    return $config;
}


function _beacon_builder_config_header_row_render( $row_id ){

}
