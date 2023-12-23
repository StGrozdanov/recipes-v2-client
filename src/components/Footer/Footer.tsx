import styles from './Footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Animate from '../common/Animate/Animate';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <article className={styles['left-article']}>
                <img src="images/footer-image.jpg" />
                <p className={styles.copyright}>©2024 Copyright: all-the-best-recipes.web.app</p>
            </article>
            <article className={styles["right-article"]}>
                <section className={styles['link-section']}>
                    <p className={styles.projects}>Other projects</p>
                    <ul className={styles['project-links-list']}>
                        <Animate animationName='fadeInUp' delay={200}>
                            <a
                                href='https://st-grozdanov.vercel.app/'
                                target="_blank"
                                rel="noreferrer"
                                className={styles['project-links']}
                            >
                                <img
                                    className={styles['project-images']}
                                    src="images/portfolio.png"
                                />
                            </a>
                        </Animate>
                        <Animate animationName='fadeInUp' delay={200}>
                            <a
                                href='https://forge-my-physique.web.app/'
                                target="_blank"
                                rel="noreferrer"
                                className={styles['project-links']}
                            >
                                <img
                                    className={styles['project-images']}
                                    src="images/forge.png"
                                />
                            </a>
                        </Animate>
                        <Animate animationName='fadeInUp' delay={400}>
                            <a
                                href='https://movies-mern-stack.web.app/'
                                target="_blank"
                                rel="noreferrer"
                                className={styles['project-links']}
                            >
                                <img
                                    className={styles['project-images']}
                                    src="images/movies.ico"
                                />
                            </a>
                        </Animate>
                        <Animate animationName='fadeInUp' delay={500}>
                            <a
                                href='https://viva-las-vegas-ba1bf.web.app/'
                                target="_blank"
                                rel="noreferrer"
                                className={styles['project-links']}
                            >
                                <img
                                    className={styles['project-images']}
                                    src="images/casino.png"
                                />
                            </a>
                        </Animate>
                    </ul>
                    <ul className={styles['project-links-list']}>
                        <a
                            href="mailto:st.grozdanov.developer@gmail.com"
                            className={styles['project-links-email']}
                            style={{ position: 'relative' }}
                        >
                            <FontAwesomeIcon
                                color='whitesmoke'
                                icon={faEnvelope}
                                className={styles.email}
                            />
                        </a>
                        <a
                            href="#"
                            className={styles['project-links-facebook']}
                            style={{ position: 'relative', animationDelay: '280ms' }}
                        >
                            <svg
                                className={styles.facebook}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                fill="currentColor"
                                color='white'
                            >
                                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/stoyan-grozdanov"
                            target="_blank"
                            rel="noreferrer"
                            className={styles['project-links-linked-in']}
                            style={{ position: 'relative', animationDelay: '800ms' }}
                        >
                            <svg
                                className={styles['linked-in']}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                fill="currentColor"
                                color='white'
                            >
                                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                            </svg>
                        </a>
                        <a
                            href="https://github.com/StGrozdanov"
                            target="_blank"
                            rel="noreferrer"
                            className={styles['project-links-github']}
                            style={{ position: 'relative', animationDelay: '1200ms' }}
                        >
                            <svg
                                className={styles.github}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                fill="currentColor"
                                color='white'
                            >
                                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                            </svg>
                        </a>
                    </ul>
                </section>
            </article>
        </footer >
    );
}