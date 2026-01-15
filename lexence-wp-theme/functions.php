<?php
/**
 * Lexence functions and definitions
 */

function lexence_setup()
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));

    register_nav_menus(array(
        'primary' => __('Menu Principal', 'lexence'),
        'footer' => __('Menu Pied de Page', 'lexence'),
    ));
}
add_action('after_setup_theme', 'lexence_setup');

function lexence_scripts()
{
    // Fonts
    wp_enqueue_style('lexence-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap', array(), null);

    // Main Stylesheet
    wp_enqueue_style('lexence-style', get_stylesheet_uri(), array(), '1.0.0');

    // GSAP & Scripts
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', true);

    // Clerk SDK (Frontend ONLY)
    wp_enqueue_script('clerk-js', 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js', array(), null, true);

    wp_enqueue_script('lexence-main', get_template_directory_uri() . '/js/main.js', array('gsap', 'clerk-js'), '1.0.0', true);

    // Pass data to JS (like site URL if needed)
    wp_localize_script('lexence-main', 'lexenceData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'themeUrl' => get_template_directory_uri()
    ));
}
add_action('wp_enqueue_scripts', 'lexence_scripts');

/**
 * Register Custom Post Type: Ideas
 */
function lexence_register_ideas_cpt()
{
    $labels = array(
        'name' => _x('Idées', 'post type general name', 'lexence'),
        'singular_name' => _x('Idée', 'post type singular name', 'lexence'),
        'menu_name' => _x('Forum Idées', 'admin menu', 'lexence'),
        'name_admin_bar' => _x('Idées', 'add new on admin bar', 'lexence'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // Enable Gutenberg/Block editor
        'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments'),
        'menu_icon' => 'dashicons-lightbulb',
        'rewrite' => array('slug' => 'suggestions'),
    );

    register_post_type('idea', $args);
}
add_action('init', 'lexence_register_ideas_cpt');

/**
 * Handle Idea Submission via AJAX
 */
add_action('wp_ajax_submit_idea', 'lexence_ajax_submit_idea');
add_action('wp_ajax_nopriv_submit_idea', 'lexence_ajax_submit_idea');

function lexence_ajax_submit_idea()
{
    $title = sanitize_text_field($_POST['title']);
    $content = sanitize_textarea_field($_POST['content']);

    if (empty($title)) {
        wp_send_json_error('Le titre est requis.');
    }

    $post_data = array(
        'post_title' => $title,
        'post_content' => $content,
        'post_status' => 'publish',
        'post_type' => 'idea',
    );

    $post_id = wp_insert_post($post_data);

    if (!is_wp_error($post_id)) {
        update_post_meta($post_id, 'votes_count', 0);
        wp_send_json_success(array('message' => 'Merci ! Votre idée a été publiée.'));
    } else {
        wp_send_json_error('Une erreur est survenue.');
    }
}

/**
 * Handle Voting via AJAX
 */
add_action('wp_ajax_vote_idea', 'lexence_ajax_vote_idea');
add_action('wp_ajax_nopriv_vote_idea', 'lexence_ajax_vote_idea');

function lexence_ajax_vote_idea()
{
    $post_id = intval($_POST['post_id']);
    if (!$post_id)
        wp_send_json_error('ID invalide.');

    $votes = get_post_meta($post_id, 'votes_count', true);
    $votes = $votes ? intval($votes) : 0;

    $new_votes = $votes + 1;
    update_post_meta($post_id, 'votes_count', $new_votes);

    wp_send_json_success(array('new_votes' => $new_votes));
}
