<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <header class="header">
        <div class="container header-container">
            <div class="logo">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="logo-text">Lexence.</a>
            </div>

            <nav class="nav desktop-nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'menu_class' => 'nav-list',
                    'fallback_cb' => false,
                ));
                ?>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                    <span class="toggle-icon">🌓</span>
                </button>
                <div id="clerk-user-button"></div>
                <div id="clerk-auth-buttons" style="display: none; gap: 1rem;">
                    <button class="btn-primary" onclick="window.Clerk.openSignIn()">Se connecter</button>
                    <button class="btn-secondary" onclick="window.Clerk.openSignUp()">S'inscrire</button>
                </div>
            </nav>

            <button class="hamburger" aria-label="Menu" id="mobile-menu-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>

            <div class="mobile-nav" id="mobile-nav-overlay">
                <div class="mobile-nav-content">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'container' => false,
                        'menu_class' => 'mobile-nav-list',
                        'fallback_cb' => false,
                    ));
                    ?>
                    <div class="mobile-auth" id="mobile-clerk-auth">
                        <button class="btn-primary full-width" onclick="window.Clerk.openSignIn()">Se connecter</button>
                    </div>
                </div>
            </div>
        </div>
    </header>