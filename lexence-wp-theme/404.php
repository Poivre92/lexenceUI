<?php get_header(); ?>

<main class="site-main container text-center"
    style="padding: 10rem 1rem; min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h1 class="hero-title" style="font-size: 6rem; margin-bottom: 0;">404</h1>
    <h2 class="section-title">Page introuvable</h2>
    <p class="section-subtitle" style="margin-bottom: 2rem;">Il semblerait que vous vous soyez égaré dans les méandres
        du vocabulaire.</p>
    <a href="<?php echo esc_url(home_url('/')); ?>" class="btn-primary">Retour à l'accueil</a>
</main>

<?php get_footer(); ?>