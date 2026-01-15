<?php
/**
 * Template Name: Front Page
 */

get_header(); ?>

<main class="main-content">
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-background-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>

        <div class="container hero-container">
            <div class="hero-content reveal">
                <h1 class="hero-title animated-title">Cultivez l'art de l'expression française</h1>
                <div class="hero-subtitle">
                    <p id="typewriter-hero"></p>
                </div>
                <div class="hero-platforms">
                    <p class="platforms-label">Disponible sur</p>
                    <div class="platform-buttons">
                        <a href="#" class="btn-platform">App Store</a>
                        <a href="#" class="btn-platform">Google Play</a>
                    </div>
                </div>
            </div>

            <div class="hero-image-wrapper reveal" style="transition-delay: 0.3s;">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/hero-clay-mockup.png"
                    alt="Lexence App Interface" class="hero-clay-mockup">
            </div>
        </div>
    </section>

    <!-- Why Lexence Section (Bento Grid) -->
    <section id="why" class="section why-section">
        <div class="container">
            <div class="why-header reveal">
                <span class="why-label">L'Expérience Lexence</span>
                <h2 class="section-title">Pourquoi nous choisir ?</h2>
                <p class="section-subtitle">L'alliance de la science cognitive et de l'élégance littéraire pour une
                    maîtrise sans compromis.</p>
            </div>

            <div class="bento-grid">
                <!-- Card 01 -->
                <div class="bento-item large reveal">
                    <div class="bento-card">
                        <div class="bento-header">
                            <span class="bento-id">01</span>
                            <div class="bento-icon-wrapper">🪶</div>
                        </div>
                        <div class="bento-body">
                            <div class="bento-visual-default">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/statue_cicero_vector.jpg"
                                    alt="Eloquence" class="bento-statue-img">
                            </div>
                            <div class="bento-text-content">
                                <h3 class="bento-title">Éloquence & Précision</h3>
                                <p class="bento-description">Accédez à une sélection rigoureuse de termes rares et
                                    littéraires pour affiner votre discours.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 02 -->
                <div class="bento-item standard reveal">
                    <div class="bento-card is-frameless">
                        <div class="bento-header">
                            <span class="bento-id">02</span>
                            <div class="bento-icon-wrapper">🧠</div>
                        </div>
                        <div class="bento-body">
                            <h3 class="bento-title">Système de Leitner</h3>
                            <p class="bento-description">Optimisez votre mémorisation grâce à la répétition espacée.</p>
                        </div>
                    </div>
                </div>

                <!-- More cards will follow same structure -->
            </div>
        </div>
    </section>

    <!-- Features Section (Mini-Games) -->
    <section id="features" class="section features-section">
        <div class="container">
            <div class="features-layout">
                <div class="features-content">
                    <div class="reveal">
                        <h2 class="section-title">Maîtrise Ludique</h2>
                        <p class="section-description">
                            Apprendre ne doit pas être une corvée. Découvrez nos mini-jeux conçus pour ancrer chaque mot
                            dans votre mémoire tout en vous amusant.
                        </p>
                    </div>

                    <ul class="games-list" id="games-list">
                        <!-- Items will be handled by JS/PHP or static list, let's use static for structure -->
                        <li class="game-item active" data-index="0" data-id="quiz">
                            <span class="game-bullet">•</span>
                            <div>
                                <strong class="game-name">Mini-Quiz</strong>
                                <p class="game-desc">Testez vos connaissances avec des définitions précises.</p>
                            </div>
                            <div class="game-progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </li>
                        <li class="game-item" data-index="1" data-id="synonym">
                            <span class="game-bullet">•</span>
                            <div>
                                <strong class="game-name">Chasse aux Synonymes</strong>
                                <p class="game-desc">Distinguez la nuance en trouvant le mot juste.</p>
                            </div>
                            <div class="game-progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </li>
                        <li class="game-item" data-index="2" data-id="missing">
                            <span class="game-bullet">•</span>
                            <div>
                                <strong class="game-name">Le Mot Manquant</strong>
                                <p class="game-desc">L'art de compléter la phrase avec élégance.</p>
                            </div>
                            <div class="game-progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </li>
                        <li class="game-item" data-index="3" data-id="letters">
                            <span class="game-bullet">•</span>
                            <div>
                                <strong class="game-name">Défi des Lettres</strong>
                                <p class="game-desc">Reconstituez le mot lettre après lettre.</p>
                            </div>
                            <div class="game-progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </li>
                        <li class="game-item" data-index="4" data-id="crossword">
                            <span class="game-bullet">•</span>
                            <div>
                                <strong class="game-name">Les Mots Croisés</strong>
                                <p class="game-desc">Retrouvez vos mots appris pour les ancrer durablement.</p>
                            </div>
                            <div class="game-progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="features-visual">
                    <div class="reveal" style="transition-delay: 0.3s;">
                        <div class="phone-mockup-abstract">
                            <div class="mockup-frame">
                                <div class="mockup-screen-gif">
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/minigames/quiz.gif"
                                        class="game-gif active" data-id="quiz" alt="Quiz">
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/minigames/synonym.gif"
                                        class="game-gif" data-id="synonym" alt="Synonymes">
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/minigames/missing.gif"
                                        class="game-gif" data-id="missing" alt="Mot manquant">
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/minigames/letters.gif"
                                        class="game-gif" data-id="letters" alt="Lettres">
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/minigames/crossword.gif"
                                        class="game-gif" data-id="crossword" alt="Mots croisés">

                                    <div class="gif-overlay-interaction">
                                        <span class="interaction-badge" id="interaction-badge">❓</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Ideas Section -->
    <section id="ideas" class="section ideas-section">
        <div class="container">
            <div class="section-header reveal">
                <span class="why-label">Boîte à Idées</span>
                <h2 class="section-title">Co-créons Lexence</h2>
                <p class="section-subtitle">Votre avis compte. Proposez des fonctionnalités ou votez pour celles que
                    vous voulez voir arriver.</p>
            </div>

            <div class="ideas-container">
                <div class="ideas-form-wrapper reveal">
                    <h3>Proposer une idée</h3>
                    <form id="submit-idea-form">
                        <div class="form-group">
                            <input type="text" id="idea-title" placeholder="Titre de votre idée..." required>
                        </div>
                        <div class="form-group">
                            <textarea id="idea-content" placeholder="Dites-en nous plus..." rows="4"></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Envoyer</button>
                    </form>
                    <div id="form-message"></div>
                </div>

                <div class="ideas-list reveal" id="ideas-list">
                    <?php
                    $ideas = new WP_Query(array(
                        'post_type' => 'idea',
                        'posts_per_page' => 10,
                        'meta_key' => 'votes_count',
                        'orderby' => 'meta_value_num',
                        'order' => 'DESC'
                    ));

                    if ($ideas->have_posts()):
                        while ($ideas->have_posts()):
                            $ideas->the_post();
                            $votes = get_post_meta(get_the_ID(), 'votes_count', true) ?: 0;
                            ?>
                            <div class="idea-card">
                                <div class="idea-votes">
                                    <button class="vote-button" data-id="<?php the_ID(); ?>">
                                        <span class="arrow">▲</span>
                                        <span class="count"><?php echo $votes; ?></span>
                                    </button>
                                </div>
                                <div class="idea-content">
                                    <h4><?php the_title(); ?></h4>
                                    <p><?php echo wp_trim_words(get_the_content(), 20); ?></p>
                                </div>
                            </div>
                            <?php
                        endwhile;
                        wp_reset_postdata();
                    else:
                        echo '<p class="text-center">Aucune idée pour le moment. Soyez le premier !</p>';
                    endif;
                    ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section testimonials-section">
        <div class="container">
            <div class="trust-header text-center">
                <p class="trust-label">L'EXCELLENCE RECONNUE</p>
                <h2 class="section-title">Ils cultivent leur différence</h2>
                <div class="trust-badges">
                    <span class="badge">⭐ 4.9/5 sur l'App Store</span>
                    <span class="badge">🏆 Meilleure App Culture 2026</span>
                    <span class="badge">👥 +50 000 Esprits Libres</span>
                </div>
            </div>

            <div class="carousel-container" id="testimonials-carousel">
                <div class="testimonials-track" id="testimonials-track">
                    <?php
                    $testimonials = [
                        ["name" => "Alexandre V.", "role" => "Avocat au Barreau", "text" => "La précision des mots est mon outil de travail quotidien. Lexence m'a permis d'affiner mes plaidoiries avec une subtilité que je ne soupçonnais pas."],
                        ["name" => "Sophie D.", "role" => "Étudiante en Lettres Modernes", "text" => "Enfin une application qui ne nous infantilise pas ! Le design est apaisant, et chaque mot appris est une petite victoire sur la banalité."],
                        ["name" => "Marc H.", "role" => "Directeur de Création", "text" => "L'esthétique de l'application est à la hauteur de son contenu. C'est du lourd : propre, intelligent, efficace. Je redécouvre le plaisir d'apprendre sans effort."],
                        ["name" => "Isabelle L.", "role" => "Journaliste", "text" => "Trouver le mot juste est un art. Lexence est le pinceau qu'il me manquait. L'algorithme d'espacement fonctionne vraiment."],
                        ["name" => "Thomas B.", "role" => "Amoureux des mots", "text" => "Je pensais avoir un bon vocabulaire, j'ai réalisé à quel point la langue française est vaste. Chaque session est une leçon d'humilité et d'émerveillement."]
                    ];

                    foreach ($testimonials as $index => $t) {
                        echo '<div class="testimonial-slide" data-index="' . $index . '">';
                        echo '<div class="testimonial-card">';
                        echo '<div class="quote-icon">“</div>';
                        echo '<p class="testimonial-text">' . $t['text'] . '</p>';
                        echo '<div class="testimonial-author">';
                        echo '<span class="author-name">' . $t['name'] . '</span>';
                        echo '<span class="author-role">' . $t['role'] . '</span>';
                        echo '</div></div></div>';
                    }
                    ?>
                </div>

                <div class="carousel-indicators">
                    <?php foreach ($testimonials as $index => $t): ?>
                        <button class="indicator <?php echo $index === 0 ? 'active' : ''; ?>"
                            data-index="<?php echo $index; ?>" aria-label="Témoignage <?php echo $index + 1; ?>"></button>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="marketing-assurance text-center" style="margin-top: 2rem;">
                <p>Rejoignez le cercle de ceux qui maîtrisent l'art de la nuance.</p>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>