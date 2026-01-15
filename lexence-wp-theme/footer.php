<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">
                <h3 class="footer-logo">Lexence.</h3>
                <p class="footer-tagline">L'élégance des mots au quotidien.</p>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h4>Application</h4>
                    <a href="#features">Fonctionnalités</a>
                    <a href="#ideas">Roadmap</a>
                </div>
                <div class="link-group">
                    <h4>Légal</h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer',
                        'container' => false,
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>
                <div class="link-group">
                    <h4>Contact</h4>
                    <a href="#">Support</a>
                    <a href="#">Presse</a>
                    <a href="#">Twitter</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy;
                <?php echo date('Y'); ?> Lexence. Tous droits réservés.
            </p>
        </div>
    </div>
</footer>

<div id="dynamic-background"></div>

<?php wp_footer(); ?>
</body>

</html>