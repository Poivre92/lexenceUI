<?php get_header(); ?>

<main class="site-main container" style="padding: 8rem 1rem;">
    <?php
    while (have_posts()):
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header text-center">
                <h1 class="entry-title section-title">
                    <?php the_title(); ?>
                </h1>
            </header>

            <div class="entry-content" style="max-width: 800px; margin: 0 auto; line-height: 1.8;">
                <?php
                the_content();

                wp_link_pages(array(
                    'before' => '<div class="page-links">' . esc_html__('Pages:', 'lexence'),
                    'after' => '</div>',
                ));
                ?>
            </div>
        </article>
        <?php
    endwhile; // End of the loop.
    ?>
</main>

<?php get_footer(); ?>